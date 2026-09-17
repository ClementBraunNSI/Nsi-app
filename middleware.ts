import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { canonicalAppPath } from "@/lib/nsi-levels";

export async function middleware(request: NextRequest) {
  const canonical = canonicalAppPath(request.nextUrl.pathname);
  if (canonical) {
    const redirected = request.nextUrl.clone();
    redirected.pathname = canonical;
    return NextResponse.redirect(redirected, 307);
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
