# AI Chat Demo

A full-stack AI Chat application with Python backend and React frontend
![image](https://github.com/user-attachments/assets/b016c4df-74c2-4d54-b7f7-5c562cdd7f58)


## Features

- Interactive chat interface
- AI-powered responses
- Real-time communication
- Responsive design

## Tech Stack

- **Backend**: Python (FastAPI)
- **Frontend**: React + Vite
- **AI**: OpenAI API integration

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- Docker (optional)

### Installation

1. Set up backend:

```bash
cd backend
pip install poetry
poetry install
```

2. Set up frontend:

```bash
cd ../frontend
npm install
```

### Configuration

1. Create `.env` files in both `backend` and `frontend` directories
2. Add your OpenAI API key to backend `.env`:

```
OPENAI_API_KEY=your_api_key
```

## Running the Application

### Development

Start backend:

```bash
cd backend
poetry run python app/main.py
```

Start frontend:

```bash
cd frontend
npm run dev
```

### Docker

```bash
docker-compose up --build
```
