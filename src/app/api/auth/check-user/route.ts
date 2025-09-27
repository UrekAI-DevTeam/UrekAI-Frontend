import { NextRequest } from 'next/server';
import { getCheckUser } from '@/services/routes/auth';

export async function GET(request: NextRequest) {
  return getCheckUser(request);
}
