import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { decryptSecret, getTwoFactorRow, verifyTotpCode } from "@/lib/security/twoFactor";

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
  if (!row?.secret_enc) return NextResponse.json({ error: "2FA not configured" }, { status: 400 });

  const ok = verifyTotpCode(decryptSecret(row.secret_enc), code);
  if (!ok) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  await supabase.from("owner_two_factor").update({
    enabled: false,
    updated_at: new Date().toISOString(),
  }).eq("owner_user_id", user.id);

  const cookieStore = await cookies();
  cookieStore.set("fc_2fa", "0", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true, enabled: false });
}

