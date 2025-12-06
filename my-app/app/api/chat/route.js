import { NextResponse } from 'next/server';

// POST /api/chat
export async function POST(request) {
  try {
    const { message, chatId } = await request.json();

    // Option 1: Call your Python backend API
    // Replace PYTHON_BACKEND_URL with your actual Python server URL
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        chat_id: chatId,
      }),
    });

    if (!response.ok) {
      throw new Error('Python backend request failed');
    }

    const data = await response.json();

    // Pass through all data from the Python backend
    return NextResponse.json({
      success: data.success,
      response: data.response,
      code: data.code,
      filename: data.filename,
      execution_time: data.execution_time,
      chat_id: data.chat_id,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process message',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
