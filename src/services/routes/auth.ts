import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';

export async function postGoogleAuth(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, auth_code, access_token, redirect_uri } = body;

    const authCode = code || auth_code;
    const accessToken = access_token;

    if (!authCode && !accessToken) {
      return NextResponse.json({ error: 'Authorization code or access token is required' }, { status: 400 });
    }

    let requestBody: Record<string, string>;

    if (accessToken) {
      requestBody = {
        access_token: accessToken,
        redirect_uri: redirect_uri || request.headers.get('origin') || 'http://localhost:3000'
      };
    } else {
      requestBody = {
        code: authCode,
        redirect_uri: redirect_uri || request.headers.get('origin') || 'http://localhost:3000'
      };
    }

    let response = await fetch(`${backendUrl}/v1/api/users/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const requestBody2 = accessToken ? {
        auth_code: accessToken,
        redirect_uri: redirect_uri || request.headers.get('origin') || 'http://localhost:3000'
      } : {
        auth_code: authCode,
        redirect_uri: redirect_uri || request.headers.get('origin') || 'http://localhost:3000'
      };

      response = await fetch(`${backendUrl}/v1/api/users/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody2),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'Google authentication failed', 
        details: errorText,
        status: response.status 
      }, { status: response.status });
    }

    const data = await response.json();

    // Normalize the payload to always include { id, email, name, picture }
    const base: any = data?.user ?? data ?? {};

    // Try common photo fields from backend
    let picture: string | undefined =
      base.picture || base.avatar || base.avatar_url || base.photoURL || base.photo_url || base.image;

    // If missing and we have an access token, enrich from Google userinfo
    if (!picture && accessToken) {
      try {
        const gi = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (gi.ok) {
          const gu = await gi.json();
          if (gu?.picture) picture = String(gu.picture);
        }
      } catch {}
    }

    const normalized = {
      id: String(base.id ?? base.sub ?? ''),
      email: String(base.email ?? ''),
      name: String(base.name ?? base.given_name ?? base.preferred_username ?? 'Google User'),
      picture: picture ? String(picture) : '',
    };

    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      const responseWithCookies = NextResponse.json(normalized);
      responseWithCookies.headers.set('set-cookie', cookies);
      return responseWithCookies;
    }

    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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


