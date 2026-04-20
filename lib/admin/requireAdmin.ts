import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAllowlistedAdminEmail } from "@/lib/admin/allowlist";

export type RequireAdminOk = {
  userId: string;
  email: string;
};

/**
 * Enforce super-admin access (V1) using env allowlist.
 * Returns a small identity payload for audit logging.
 */
export async function requireAdminOrResponse(): Promise<
  { ok: true; admin: RequireAdminOk } | { ok: false; response: NextResponse }
> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const email = data.user.email ?? "";
  if (!isAllowlistedAdminEmail(email)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true, admin: { userId: data.user.id, email } };
}

