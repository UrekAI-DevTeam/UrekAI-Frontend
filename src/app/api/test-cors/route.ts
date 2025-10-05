import { NextResponse } from 'next/server';
import { getCorsTest, optionsCorsTest } from '@/services/api/chat';

export async function GET() {
  return getCorsTest();
}

export async function OPTIONS() {
  return optionsCorsTest();
}
