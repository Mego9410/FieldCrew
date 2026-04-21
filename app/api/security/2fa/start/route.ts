import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildOtpAuthUrl, generateSecret, upsertTwoFactorSecret } from "@/lib/security/twoFactor";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.email) return NextResponse.json({ error: "User email required" }, { status: 400 });

  const secret = generateSecret();
  await upsertTwoFactorSecret(supabase, user.id, secret);
  const otpauthUrl = buildOtpAuthUrl({ email: user.email, secret });

  return NextResponse.json({
    ok: true,
    otpauthUrl,
    // Provide secret for manual entry (shown once per setup flow).
    secret,
  });
}

