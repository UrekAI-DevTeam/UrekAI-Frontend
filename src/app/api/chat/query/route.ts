import { NextRequest } from 'next/server';
import { postChatQuery } from '@/services/api/chat';

export async function POST(request: NextRequest) {
  return postChatQuery(request);
}
