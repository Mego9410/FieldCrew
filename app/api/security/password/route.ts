import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TWO_FACTOR_COOKIE } from "@/lib/security/twoFactorCookie";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = rateLimit(`password:${user.id}`, { limit: 5, windowMs: 15 * 60_000 });
  if (!rl.allowed) return tooManyRequests(rl.retryAfterSeconds);

  let body: { currentPassword?: string; newPassword?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const currentPassword = (body.currentPassword ?? "").trim();
  const newPassword = (body.newPassword ?? "").trim();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both currentPassword and newPassword are required" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  // Re-authenticate to confirm the current password.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Invalidate the device 2FA cookie so a password change forces re-verification.
  const cookieStore = await cookies();
  cookieStore.set(TWO_FACTOR_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}

