import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookies = request.headers.get('cookie');
  const allHeaders = Object.fromEntries(request.headers.entries());
  
  return NextResponse.json({
    cookies: cookies || 'No cookies found',
    allHeaders,
    userAgent: request.headers.get('user-agent'),
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer')
  });
}
