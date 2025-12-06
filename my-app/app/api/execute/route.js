import { NextResponse } from 'next/server';

// POST /api/execute
export async function POST(request) {
  try {
    const { script, args } = await request.json();

    // Call your Python backend to execute specific scripts
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script_name: script,
        arguments: args,
      }),
    });

    if (!response.ok) {
      throw new Error('Script execution failed');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      output: data.output,
      result: data.result,
      executionTime: data.execution_time,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Execute API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute script',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
