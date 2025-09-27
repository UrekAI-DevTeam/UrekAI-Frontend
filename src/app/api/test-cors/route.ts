import { NextResponse } from 'next/server';
import { getCorsTest, optionsCorsTest } from '@/services/routes/chat';

export async function GET() {
  return getCorsTest();
}

export async function OPTIONS() {
  return optionsCorsTest();
}
