from fastapi import FastAPI, Body, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
import os
from dotenv import load_dotenv
import importlib.util

load_dotenv()


def load_prompt_from_file(file_path="./app/prompt.py"):
    try:

        spec = importlib.util.spec_from_file_location("prompt", file_path)
        prompt_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(prompt_module)

        system_prompt = getattr(
            prompt_module, "SYSTEM_PROMPT_2", "You are a helpful assistant."
        )
        print(f"Loaded system prompt from {file_path}: {system_prompt}")
        return system_prompt
    except Exception as e:
        print(f"Failed to load prompt from {file_path}: {e}")
        return "You are a helpful assistant."


SYSTEM_PROMPT = load_prompt_from_file()

api_configs = {
    "openai": {
        "api_key": os.getenv("OPENAI_API_KEY"),
        "base_url": os.getenv("OPENAI_API_BASE"),
        "default_model": os.getenv("OPENAI_API_MODEL", "gpt-3.5-turbo"),
    },
    "gemini": {
        "api_key": os.getenv("GEMINI_API_KEY"),
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
        "default_model": os.getenv("GEMINI_API_MODEL", "gemini-2.0-flash"),
    },
}

API_PROVIDER = os.getenv("API_PROVIDER", "openai").lower()

current_config = api_configs[API_PROVIDER]
client = OpenAI(api_key=current_config["api_key"], base_url=current_config["base_url"])
DEFAULT_MODEL = current_config["default_model"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: str  # 'system', 'user', or 'assistant'
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    stream: bool = True
    model: Optional[str] = None
    provider: Optional[str] = None


@app.get("/")
async def root():
    return {
        "message": "AI Streaming API with FastAPI",
        "system_prompt": SYSTEM_PROMPT,
        "current_provider": API_PROVIDER,
        "default_model": DEFAULT_MODEL,
    }


@app.post("/chat")
async def chat(request: ChatRequest = Body(...)):
    """Handle chat requests, supporting conversation context and dynamic AI provider selection"""
    # Ensure message list is not empty
    if not request.messages:
        raise HTTPException(status_code=400, detail="Messages cannot be empty")

    # Determine the AI provider and model for current request
    provider = request.provider or API_PROVIDER

    if provider not in api_configs:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

    # If request specifies a different provider, create corresponding client
    current_client = client
    if request.provider and request.provider != API_PROVIDER:
        provider_config = api_configs[provider]
        current_client = OpenAI(
            api_key=provider_config["api_key"], base_url=provider_config["base_url"]
        )

    # Determine which model to use
    model = request.model or api_configs[provider]["default_model"]

    # Prepare message list, ensure first is system message
    ai_messages = []
    has_system_message = any(msg.role == "system" for msg in request.messages)

    if not has_system_message:
        # Add system prompt as first message
        ai_messages.append({"role": "system", "content": SYSTEM_PROMPT})

    # Add other messages
    for msg in request.messages:
        ai_messages.append({"role": msg.role, "content": msg.content})

    if request.stream:
        # Return streaming response
        return StreamingResponse(
            stream_ai_response(current_client, ai_messages, model, provider),
            media_type="text/event-stream",
        )
    else:
        # Return complete response
        print(f"Sending non-streaming response using {provider} with model {model}")
        try:
            response = current_client.chat.completions.create(
                model=model, messages=ai_messages, stream=False
            )
            return {
                "message": {
                    "role": "assistant",
                    "content": response.choices[0].message.content,
                }
            }
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Error from {provider}: {str(e)}"
            )


async def stream_ai_response(ai_client, messages, model, provider):
    """Generator function for streaming AI responses"""
    try:
        response = ai_client.chat.completions.create(
            model=model, messages=messages, stream=True
        )

        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                # Split each line with data: prefix to prevent multi-line issues
                for line in content.splitlines():
                    yield f"data: {line}\n"
                yield "\n"

        yield "data: [DONE]\n\n"

    except Exception as e:
        error_msg = str(e).replace("\n", " ")
        yield f"data: [ERROR] {error_msg}\n\n"


@app.get("/models")
async def list_models(provider: Optional[str] = None):
    """List available models for the specified provider"""
    try:
        # Determine which provider to query
        provider = provider or API_PROVIDER

        if provider not in api_configs:
            raise HTTPException(
                status_code=400, detail=f"Unsupported provider: {provider}"
            )

        # If specified provider is not default, create temporary client
        if provider != API_PROVIDER:
            provider_config = api_configs[provider]
            temp_client = OpenAI(
                api_key=provider_config["api_key"], base_url=provider_config["base_url"]
            )
            models = temp_client.models.list()
        else:
            models = client.models.list()

        return {"models": [model.id for model in models]}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error listing models for {provider}: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
