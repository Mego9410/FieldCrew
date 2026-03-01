import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ensureOwnerUserForAuthUser } from "@/lib/data";
import { routes } from "@/lib/routes";

function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ""
  );
}

const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL && getSupabaseAnonKey();

/**
 * Refreshes the Supabase auth session and keeps cookies in sync.
 * Run this in middleware so Server Components get a valid session.
 */
type CookieEntry = { name: string; value: string; options?: Record<string, unknown> };

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const sessionCookies: CookieEntry[] = [];

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieEntry[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          sessionCookies.push(...cookiesToSet);
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Record<string, unknown>)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // When Supabase redirects to Site URL (/) with ?code=..., exchange the code here
  // so session cookies are set on the redirect response and the user is created.
  if (pathname === "/" && searchParams.has("code")) {
    const code = searchParams.get("code")!;
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const loginUrl = new URL(routes.public.login, request.url);
      loginUrl.searchParams.set("error", encodeURIComponent(error.message));
      return NextResponse.redirect(loginUrl);
    }

    if (data?.session?.user) {
      try {
        await ensureOwnerUserForAuthUser(supabase, data.session.user);
      } catch {
        // Continue to dashboard; owner user may be created on next /app load
      }
    }

    const nextParam = searchParams.get("next");
    const nextPath =
      nextParam?.startsWith("/") && !nextParam.startsWith("//")
        ? nextParam
        : routes.owner.home;
    const redirectRes = NextResponse.redirect(new URL(nextPath, request.url));
    // Preserve full cookie options (httpOnly, secure, sameSite, maxAge) so the session persists.
    if (sessionCookies.length > 0) {
      sessionCookies.forEach(({ name, value, options }) =>
        redirectRes.cookies.set(name, value, { path: "/", ...options } as { path: string; [key: string]: unknown })
      );
    } else {
      supabaseResponse.cookies.getAll().forEach((c) =>
        redirectRes.cookies.set(c.name, c.value, { path: "/" })
      );
    }
    return redirectRes;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Send OAuth errors from root to login so user sees the troubleshooting message.
  const isRootWithOAuthError =
    pathname === "/" &&
    (request.nextUrl.searchParams.get("error") === "server_error" ||
      request.nextUrl.searchParams.get("error_code") === "unexpected_failure");
  if (isRootWithOAuthError) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "oauth_exchange_failed");
    return NextResponse.redirect(loginUrl);
  }

  const isAppRoute = pathname.startsWith("/app");
  if (isAppRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
