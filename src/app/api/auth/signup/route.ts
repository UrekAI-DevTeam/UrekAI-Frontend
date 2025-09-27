import { NextRequest } from 'next/server';
import { postSignUp } from '@/services/routes/auth';

export async function POST(request: NextRequest) {
  return postSignUp(request);
}
