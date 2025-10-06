import { NextRequest, NextResponse } from 'next/server';
import { serverApiRequest } from '@/utils/serverAPI';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';

export async function googleAuthCallback(code: string, codeVerifier: string) {
  try {
    const response = await serverApiRequest('/v1/api/users/auth/callback/google', {
      method: 'POST',
      body: { 
        code: code, 
        code_verifier: codeVerifier 
      },
      credentials: 'include' // Ensure cookies are sent/received
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Google authentication callback error:", error);
    throw error;
  }
}

export async function postSignUp(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const response = await fetch(`${backendUrl}/v1/api/users/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Sign-up failed', details: errorText }, { status: response.status });
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

export async function postSignIn(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const response = await fetch(`${backendUrl}/v1/api/users/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Sign-in failed', details: errorText }, { status: response.status });
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

export async function postLogout(request: NextRequest) {
  try {
    const response = await fetch(`${backendUrl}/v1/api/users/log-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Logout failed', details: errorText }, { status: response.status });
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

export async function getCheckUser(request: NextRequest) {
  try {
    const response = await fetch(`${backendUrl}/v1/api/users/check-user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      return NextResponse.json({ error: 'User check failed' }, { status: response.status });
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


