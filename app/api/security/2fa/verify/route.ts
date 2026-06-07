import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { sendSecurity2faEnabledEmail } from "@/lib/email/notifications";
import {
  TWO_FACTOR_COOKIE,
  TWO_FACTOR_COOKIE_MAX_AGE,
  twoFactorCookieValue,
} from "@/lib/security/twoFactorCookie";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import {
  decryptSecret,
  generateRecoveryCodes,
  getTwoFactorRow,
  parseRecoveryCodesJson,
  recoveryCodesToJson,
  tryConsumeRecoveryCode,
  verifyTotpCode,
} from "@/lib/security/twoFactor";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Throttle TOTP/recovery attempts to prevent brute force of the 6-digit code.
  const rl = rateLimit(`2fa-verify:${user.id}`, { limit: 10, windowMs: 5 * 60_000 });
  if (!rl.allowed) return tooManyRequests(rl.retryAfterSeconds);

  let body: { code?: string; recoveryCode?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const row = await getTwoFactorRow(supabase, user.id);
  if (!row?.secret_enc) {
    return NextResponse.json({ error: "2FA not started" }, { status: 400 });
  }

  const secret = decryptSecret(row.secret_enc);

  const recoveryRecords = parseRecoveryCodesJson(row.recovery_codes);
  const hasRecoveryCodes = recoveryRecords.length > 0;

  let ok = false;
  let updatedRecoveryRecords = recoveryRecords;

  const code = (body.code ?? "").trim();
  const recoveryCode = (body.recoveryCode ?? "").trim().toLowerCase();

  if (code) {
    ok = verifyTotpCode(secret, code);
  } else if (recoveryCode) {
    const consumed = tryConsumeRecoveryCode(recoveryRecords, recoveryCode);
    ok = consumed.ok;
    updatedRecoveryRecords = consumed.next;
  } else {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  if (!ok) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  let recoveryCodesPlain: string[] | null = null;
  let recoveryCodesJson = updatedRecoveryRecords as unknown;
  if (!hasRecoveryCodes) {
    const generated = generateRecoveryCodes(10);
    recoveryCodesPlain = generated.plain;
    recoveryCodesJson = recoveryCodesToJson(generated.hashes);
  }

  await supabase.from("owner_two_factor").update({
    enabled: true,
    recovery_codes: recoveryCodesJson,
    updated_at: new Date().toISOString(),
  }).eq("owner_user_id", user.id);

  // Security email (best-effort)
  try {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://fieldcrew.app");
    await sendSecurity2faEnabledEmail({
      to: user.email ?? "",
      userEmail: user.email ?? "",
      eventAt: new Date().toISOString(),
      device: request.headers.get("user-agent") ?? "—",
      ipAddress: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "—",
      securitySettingsUrl: `${origin.replace(/\/$/, "")}/app/settings/security`,
    });
  } catch {}

  // Mark this device/session as verified for 2FA-gated routes. The cookie value
  // is an HMAC bound to this user id so it can't be forged or reused by another
  // account on the same browser.
  const cookieStore = await cookies();
  cookieStore.set(TWO_FACTOR_COOKIE, await twoFactorCookieValue(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TWO_FACTOR_COOKIE_MAX_AGE,
  });

  return NextResponse.json({
    ok: true,
    enabled: true,
    recoveryCodes: recoveryCodesPlain,
  });
}

