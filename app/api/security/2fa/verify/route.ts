import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
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

  // Mark this device/session as verified for 2FA-gated routes.
  const cookieStore = await cookies();
  cookieStore.set("fc_2fa", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({
    ok: true,
    enabled: true,
    recoveryCodes: recoveryCodesPlain,
  });
}

