import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { adminUpdateCompany } from "@/lib/admin/db";

/**
 * V1 safety: "delete" is a soft-delete marker.
 * We intentionally avoid hard deletes because companies are referenced widely.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
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

  const { companyId } = await params;

  let body: { confirmName?: string } = {};
  try {
    body = await request.json();
  } catch {
    // ok
  }

  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("id", companyId)
    .single();

  const name = (company as { name?: string | null } | null)?.name ?? "";
  if (name && body.confirmName?.trim() !== name) {
    return NextResponse.json(
      { error: "Confirmation name mismatch" },
      { status: 400 }
    );
  }

  const { error } = await adminUpdateCompany(supabase, companyId, {
    account_status: "deleted",
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "company.soft_delete",
    targetCompanyId: companyId,
    metadata: { confirmName: body.confirmName ?? null },
  });

  return NextResponse.json({ ok: true });
}

