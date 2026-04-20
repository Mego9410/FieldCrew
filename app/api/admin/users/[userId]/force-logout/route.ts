import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";

/**
 * Supabase admin sign-out requires a JWT, not a userId.
 * Practical support workaround: short ban to force re-authentication.
 * (This revokes refresh tokens + blocks new sessions briefly.)
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  const { userId } = await params;

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: "1m",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "user.force_logout",
    targetUserId: userId,
    metadata: { method: "ban_duration", duration: "1m" },
  });

  return NextResponse.json({ ok: true });
}

