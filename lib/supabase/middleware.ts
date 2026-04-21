import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ensureOwnerUserForAuthUser, getSubscriptionStatusForUser } from "@/lib/data";
import { routes } from "@/lib/routes";
import { isAllowlistedAdminEmail } from "@/lib/admin/allowlist";

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

  // Exchange OAuth PKCE code before getUser(). If we call getUser() first, the server
  // auth client can sync storage and drop the PKCE verifier cookie, and the later
  // /auth/callback route handler then fails with "PKCE code verifier not found".
  const isOAuthCodeReturn =
    searchParams.has("code") &&
    (pathname === "/" || pathname === "/auth/callback");

  if (isOAuthCodeReturn) {
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
        : routes.auth.postLogin;
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

  let user: Awaited<
    ReturnType<typeof supabase.auth.getUser>
  >["data"]["user"] = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (
      error &&
      error.message !== "Auth session missing!" &&
      !error.message.includes("Refresh Token")
    ) {
      console.warn("[middleware] getUser:", error.message);
    }
    user = data?.user ?? null;
  } catch (e) {
    console.error("[middleware] getUser failed:", e);
  }

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
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isOnboardingRoute = pathname === "/onboarding" || pathname.startsWith("/onboarding/");

  // Allow unauthenticated access to /onboarding (preview / force onboarding from login page)
  if (isOnboardingRoute && !user) {
    return supabaseResponse;
  }

  // Subscribe page is public (first step of onboarding); layout handles redirects for logged-in users
  // No middleware redirect for /subscribe

  if (isAppRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAllowlistedAdminEmail(user.email)) {
      // Avoid leaking that /admin exists; send them to the owner app.
      return NextResponse.redirect(new URL(routes.owner.home, request.url));
    }
  }

  // Logged-in user on /app: ensure they have a company.
  // Note: In an edge-case, allow access even without subscription/onboarding complete (read-only mode in UI).
  if (isAppRoute && user) {
    const sub = await getSubscriptionStatusForUser(user.id, supabase);
    if (!sub.companyId) {
      const subscribeUrl = new URL(routes.owner.subscribe, request.url);
      return NextResponse.redirect(subscribeUrl);
    }
    if (sub.accountStatus === "deleted" || sub.accountStatus === "suspended") {
      const loginUrl = new URL(routes.public.login, request.url);
      loginUrl.searchParams.set("error", "account_disabled");
      return NextResponse.redirect(loginUrl);
    }
    // No redirects here; UI will show an onboarding prompt and block writes if needed.
  }

  return supabaseResponse;
}
