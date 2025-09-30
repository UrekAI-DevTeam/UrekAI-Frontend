import { NextRequest } from 'next/server';
import { postGoogleAuth } from '@/services/routes/auth';

export async function POST(request: NextRequest) {
  return postGoogleAuth(request);
}


