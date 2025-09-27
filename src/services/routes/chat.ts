import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';

export async function postChatQuery(request: NextRequest) {
  try {
    const body = await request.json();
    const { userQuery, chatId } = body;
    if (!userQuery) {
      return NextResponse.json({ error: 'User query is required' }, { status: 400 });
    }
    const response = await fetch(`${backendUrl}/v1/api/chat/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: JSON.stringify({ userQuery, chatId }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Chat query failed', details: errorText }, { status: response.status });
    }
    const data = await response.json();
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      const responseWithCookies = NextResponse.json(data);
      responseWithCookies.headers.set('set-cookie', cookies);
      return responseWithCookies;
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function getCorsTest() {
  return NextResponse.json(
    { 
      message: 'CORS test successful',
      timestamp: new Date().toISOString(),
      origin: 'Next.js API Route'
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function optionsCorsTest() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}


