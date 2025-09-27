import { NextRequest } from 'next/server';
import { postChatQuery } from '@/services/routes/chat';

export async function POST(request: NextRequest) {
  return postChatQuery(request);
}
