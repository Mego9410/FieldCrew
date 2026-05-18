import { getAuthProxyConfig } from "@/lib/supabase/auth-proxy";
import { agentLog } from "@/lib/debug/agent-log";
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
    // #region agent log
    agentLog(
      "middleware.ts:entry",
      "middleware branch",
      {
        hostname,
        pathname,
        hasAuthProxy: Boolean(authProxy),
        authHost: authProxy?.authHost ?? null,
        proxyMatch: Boolean(authProxy && hostname === authProxy.authHost),
        isAuthV1: pathname.startsWith("/auth/v1"),
      },
      "H1-H2"
    );
    // #endregion

    if (authProxy && hostname === authProxy.authHost) {
      const target = new URL(
        `${pathname}${request.nextUrl.search}`,
        authProxy.supabaseOrigin
      );
      // #region agent log
      agentLog(
        "middleware.ts:proxy",
        "rewriting to supabase",
        { target: target.toString() },
        "H2"
      );
      // #endregion
      return NextResponse.rewrite(target);
    }

    return await updateSession(request);
  } catch (e) {
    console.error("[middleware]", e);
    // #region agent log
    agentLog(
      "middleware.ts:catch",
      "middleware error",
      { error: e instanceof Error ? e.message : "unknown" },
      "H2"
    );
    // #endregion
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
