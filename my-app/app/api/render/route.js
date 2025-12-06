import { NextResponse } from 'next/server';

// POST /api/render
export async function POST(request) {
  try {
    const { code, quality = 'l', user_request = 'visualization request' } = await request.json();

    const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/visualize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        quality,
        user_request,
      }),
    });

    if (!response.ok) {
      throw new Error('Manim rendering failed');
    }

    const data = await response.json();

    return NextResponse.json({
      success: data.success,
      video_path: data.video_path,
      video_url: data.video_url,
      scene_name: data.scene_name,
      explanation: data.explanation,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Render API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to render video',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
