// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Поки що пропускаємо всі запити
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};