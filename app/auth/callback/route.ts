import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import { NextResponse } from "next/server";

/**
 * OAuth callback (e.g. Google). Supabase redirects here with ?code=...
 * Exchange the code for a session and redirect to the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = searchParams.get("next") ?? routes.owner.home;

  if (!code) {
    return NextResponse.redirect(`${origin}${routes.public.login}?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}${routes.public.login}?error=${encodeURIComponent(error.message)}`
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
