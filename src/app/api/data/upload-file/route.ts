import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated by verifying cookies
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in first.' },
        { status: 401 }
      );
    }

    // Stream the body directly to the backend to support large files
    const response = await fetch(`${API_BASE_URL}/v1/api/data/upload-file`, {
      method: 'POST',
      body: request.body,
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Content-Type': request.headers.get('content-type') || 'application/octet-stream',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      console.error('Backend upload error:', response.status, errorData);
      return NextResponse.json(
        { error: errorData.error || `Upload failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('File upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
