import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";

export async function POST(
  request: Request,
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

  let body: { role?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role = (body.role ?? "").trim();
  if (!role) return NextResponse.json({ error: "Missing role" }, { status: 400 });

  const { userId } = await params;
  const { data } = await supabase.auth.admin.getUserById(userId);
  const appMeta = (data.user?.app_metadata as Record<string, unknown> | undefined) ?? {};

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { ...appMeta, role },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "user.change_role",
    targetUserId: userId,
    metadata: { role },
  });

  return NextResponse.json({ ok: true, role });
}

