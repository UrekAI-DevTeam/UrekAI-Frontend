import { NextRequest } from 'next/server';
import { postSignIn } from '@/services/routes/auth';

export async function POST(request: NextRequest) {
  return postSignIn(request);
}
