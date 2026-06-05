import { getAuthProxyConfig } from "@/lib/supabase/auth-proxy";
import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const host =
      request.headers.get("x-forwarded-host") ??
      request.headers.get("host") ??
      "";
    const hostname = host.split(",")[0]?.trim().replace(/:\d+$/, "") ?? "";
    const pathname = request.nextUrl.pathname;

    const authProxy = getAuthProxyConfig();

    if (authProxy && hostname === authProxy.authHost) {
      const target = new URL(
        `${pathname}${request.nextUrl.search}`,
        authProxy.supabaseOrigin
      );
      return NextResponse.rewrite(target);
    }

    return await updateSession(request);
  } catch (e) {
    console.error("[middleware]", e);
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
