// API utility functions for calling Python backend

export async function sendChatMessage(message, chatId) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        chatId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
}

export async function generateVisualization(code, type, parameters) {
  try {
    const response = await fetch('/api/visualize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        type,
        parameters,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate visualization');
    }

    return await response.json();
  } catch (error) {
    console.error('Visualization API Error:', error);
    throw error;
  }
}

export async function executePythonScript(script, args) {
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script,
        args,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute script');
    }

    return await response.json();
  } catch (error) {
    console.error('Execute API Error:', error);
    throw error;
  }
}

export async function checkBackendHealth() {
  try {
    const response = await fetch('/api/health');
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy' };
  }
}
