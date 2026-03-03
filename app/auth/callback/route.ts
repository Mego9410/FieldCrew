import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import { ensureOwnerUserForAuthUser } from "@/lib/data";
import { NextResponse } from "next/server";

/**
 * OAuth callback (e.g. Google). Supabase redirects here with ?code=...
 * Exchange the code for a session and redirect to the app.
 * The "next" param is restricted to relative paths to avoid open redirects.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const nextPath =
    nextParam?.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : routes.owner.home;

  if (!code) {
    return NextResponse.redirect(`${origin}${routes.public.login}?error=no_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}${routes.public.login}?error=${encodeURIComponent(error.message)}`
    );
  }

  // Ensure the signed-in user has a company and owner_users row (new signups).
  // Use service-role client so inserts succeed regardless of session/cookie timing; we pass
  // session.user so we only create rows for the user we just authenticated.
  try {
    if (data?.session?.user) {
      const serviceSupabase = createServiceRoleClient();
      await ensureOwnerUserForAuthUser(
        serviceSupabase ?? supabase,
        data.session.user
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[auth/callback] ensureOwnerUserForAuthUser failed:", err);
    // Surface the real error so we can fix RLS/config (e.g. "new row violates row-level security policy").
    const userMessage =
      process.env.NODE_ENV === "development"
        ? `Account setup failed: ${message}`
        : "Account setup failed. Please try again.";
    return NextResponse.redirect(
      `${origin}${routes.public.login}?error=${encodeURIComponent(userMessage)}`
    );
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${nextPath}`);
  }
  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${nextPath}`);
  }
  return NextResponse.redirect(`${origin}${nextPath}`);
}
