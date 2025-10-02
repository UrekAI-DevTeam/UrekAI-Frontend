import { NextRequest, NextResponse } from 'next/server';
import { getCheckUser } from '@/services/routes/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Auth status check called');
    const cookies = request.headers.get('cookie');
    console.log('Cookies received:', cookies);
    
    if (!cookies) {
      return NextResponse.json({ 
        authenticated: false, 
        error: 'No authentication cookies found' 
      });
    }
    
    // Check with backend
    const response = await getCheckUser(request);
    const data = await response.json();
    
    if (response.ok) {
      return NextResponse.json({ 
        authenticated: true, 
        user: data 
      });
    } else {
      return NextResponse.json({ 
        authenticated: false, 
        error: data.error || 'Authentication check failed' 
      });
    }
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
