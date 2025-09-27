import { NextRequest } from 'next/server';
import { postLogout } from '@/services/routes/auth';

export async function POST(request: NextRequest) {
  return postLogout(request);
}
