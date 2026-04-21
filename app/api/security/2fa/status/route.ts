import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getTwoFactorRow } from "@/lib/security/twoFactor";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const row = await getTwoFactorRow(supabase, user.id);
  const enabled = Boolean(row?.enabled);
  const verified = (await cookies()).get("fc_2fa")?.value === "1";

  return NextResponse.json({
    enabled,
    verified: enabled ? verified : true,
    email: user.email ?? "",
  });
}

