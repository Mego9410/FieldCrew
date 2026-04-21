import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decryptSecret, generateRecoveryCodes, getTwoFactorRow, recoveryCodesToJson, verifyTotpCode } from "@/lib/security/twoFactor";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { code?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const code = (body.code ?? "").trim();
  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

  const row = await getTwoFactorRow(supabase, user.id);
  if (!row?.secret_enc || !row.enabled) return NextResponse.json({ error: "2FA not enabled" }, { status: 400 });

  const ok = verifyTotpCode(decryptSecret(row.secret_enc), code);
  if (!ok) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  const generated = generateRecoveryCodes(10);
  await supabase.from("owner_two_factor").update({
    recovery_codes: recoveryCodesToJson(generated.hashes),
    updated_at: new Date().toISOString(),
  }).eq("owner_user_id", user.id);

  return NextResponse.json({ ok: true, recoveryCodes: generated.plain });
}

