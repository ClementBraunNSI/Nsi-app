import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/niveaux')) {
    const redirected = request.nextUrl.clone();
    redirected.pathname = request.nextUrl.pathname.replace(/^\/niveaux/, '/cours') || '/cours';
    return NextResponse.redirect(redirected, 307);
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
