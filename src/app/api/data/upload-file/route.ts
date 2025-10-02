import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API route called');
    
    // Check if user is authenticated by verifying cookies
    const cookieHeader = request.headers.get('cookie');
    console.log('Cookie header present:', !!cookieHeader);
    console.log('Cookie header value:', cookieHeader);
    
    if (!cookieHeader) {
      console.log('No cookies found, returning 401');
      return NextResponse.json(
        { error: 'Authentication required. Please sign in first.' },
        { status: 401 }
      );
    }

    console.log('Making request to backend:', `${API_BASE_URL}/v1/api/data/upload-file`);
    
    // Stream the body directly to the backend to support large files
    const response = await fetch(`${API_BASE_URL}/v1/api/data/upload-file`, {
      method: 'POST',
      body: request.body,
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'Content-Type': request.headers.get('content-type') || 'application/octet-stream',
      },
      credentials: 'include',
      duplex: 'half', // Required for streaming request body
    } as RequestInit & { duplex: 'half' });

    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Upload failed with status ${response.status}`;
      } catch (parseError) {
        // If response is not JSON, try to get text
        try {
          const responseText = await response.text();
          errorMessage = `Upload failed (${response.status}): ${responseText.substring(0, 200)}`;
        } catch {
          errorMessage = `Upload failed with status ${response.status}`;
        }
      }
      
      console.error('Backend upload error:', { 
        status: response.status, 
        statusText: response.statusText,
        errorMessage 
      });
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('File upload API error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
