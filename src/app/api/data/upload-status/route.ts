import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upload_id = searchParams.get('upload_id');
    const extension = searchParams.get('extension');

    if (!upload_id || !extension) {
      return NextResponse.json(
        { error: 'Missing upload_id or extension parameter' },
        { status: 400 }
      );
    }

    // Forward the request to the backend with authentication cookies
    const response = await fetch(
      `${API_BASE_URL}/v1/api/data/upload-status?upload_id=${upload_id}&extension=${extension}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Status check failed' }));
      return NextResponse.json(
        { error: errorData.error || 'Status check failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
