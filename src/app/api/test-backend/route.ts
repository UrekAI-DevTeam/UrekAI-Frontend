import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';

export async function GET() {
  try {
    console.log('Testing backend connectivity to:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/v1/api/data/upload-file`, {
      method: 'GET', // Just test connectivity
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

    return NextResponse.json({
      success: true,
      backendUrl: API_BASE_URL,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
  } catch (error) {
    console.error('Backend connectivity test failed:', error);
    return NextResponse.json({
      success: false,
      backendUrl: API_BASE_URL,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
