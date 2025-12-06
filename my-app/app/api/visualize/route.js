import { NextResponse } from 'next/server';

// POST /api/visualize
export async function POST(request) {
  try {
    const { code, type, parameters } = await request.json();

    // Call your Python backend for Manim visualization
    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/visualize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        visualization_type: type,
        parameters: parameters,
      }),
    });

    if (!response.ok) {
      throw new Error('Visualization request failed');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      videoUrl: data.video_url,
      animationData: data.animation_data,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Visualize API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate visualization',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
