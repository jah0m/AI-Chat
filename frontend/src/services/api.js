// src/services/api.js
const API_URL = 'http://localhost:8000';

export const streamChatCompletion = async (messages, onChunk) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let processPosition;
      while ((processPosition = buffer.indexOf('\n\n')) !== -1) {
        const block = buffer.substring(0, processPosition);
        buffer = buffer.substring(processPosition + 2);

        const lines = block.split('\n');
        let fullData = '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return true;
            if (data.startsWith('[ERROR]')) throw new Error(data.slice(8));
            fullData += data;
          }
        }

        // 显示拼好的完整 chunk
        for (const char of fullData) {
          onChunk(char);
          await new Promise(resolve => setTimeout(resolve, 5));
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error in streamChatCompletion:', error);
    throw error;
  }
};

