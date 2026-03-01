import { createClient } from "@/lib/supabase/server";
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
  // Pass session.user so we don't rely on cookies in the same request.
  try {
    if (data?.session?.user) {
      await ensureOwnerUserForAuthUser(supabase, data.session.user);
    }
  } catch (err) {
    console.error("[auth/callback] ensureOwnerUserForAuthUser failed:", err);
    return NextResponse.redirect(
      `${origin}${routes.public.login}?error=${encodeURIComponent("Account setup failed. Please try again.")}`
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
