import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { canonicalAppPath } from "@/lib/nsi-levels";

/** Préchargement d'un lien par Next.js : la vraie navigation repassera par ici. */
function isPrefetch(request: NextRequest) {
  return (
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch" ||
    (request.headers.get("sec-purpose") ?? "").includes("prefetch")
  );
}

export async function middleware(request: NextRequest) {
  const canonical = canonicalAppPath(request.nextUrl.pathname);
  if (canonical) {
    const redirected = request.nextUrl.clone();
    redirected.pathname = canonical;
    return NextResponse.redirect(redirected, 307);
  }
  // Actions serveur et routes /api lisent et rafraîchissent elles-mêmes la session ; un préchargement n'en a pas besoin.
  // Sans ce tri, chaque battement d'une évaluation ou chaque lien survolé appelait Supabase deux fois de plus.
  if (request.nextUrl.pathname.startsWith("/api/") || request.headers.has("next-action") || isPrefetch(request)) {
    return NextResponse.next();
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|wasm|mp3|mp4|webm|txt|xml|map|pdf|zip|whl)$).*)",
  ],
};
