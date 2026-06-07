import { getSupabaseProjectOrigin } from "@/lib/supabase/auth-proxy";
import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // The branded auth domain (e.g. auth.getfieldcrew.com) is served by this app on
    // Vercel. Supabase issues OAuth callback URLs on that domain, so Google redirects
    // back to /auth/v1/callback here. Forward every GoTrue endpoint (/auth/v1/*) to the
    // real Supabase project; otherwise these requests hit Next.js and return its 404.
    // The app itself has no /auth/v1/* routes, so this never shadows a real page.
    if (pathname.startsWith("/auth/v1/")) {
      const supabaseOrigin = getSupabaseProjectOrigin();
      if (supabaseOrigin) {
        const target = new URL(
          `${pathname}${request.nextUrl.search}`,
          supabaseOrigin
        );
        return NextResponse.rewrite(target);
      }
    }

    return await updateSession(request);
  } catch (e) {
    console.error("[middleware]", e);
    // Fail closed for protected areas: if session handling throws, never let an
    // unauthenticated/unverified request fall through to /app or /admin.
    const pathname = request.nextUrl.pathname;
    const isProtected =
      pathname === "/app" ||
      pathname.startsWith("/app/") ||
      pathname === "/admin" ||
      pathname.startsWith("/admin/");
    if (isProtected) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      loginUrl.searchParams.set("error", "session_error");
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/* (dev/prod assets: CSS chunks, HMR, flight, image optimizer, etc.)
     * - favicon.ico
     * - common static file extensions
     */
    "/((?!_next/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
