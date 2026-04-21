import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { adminUpdateCompany } from "@/lib/admin/db";

const WORKER_LIMITS: Record<"starter" | "growth" | "pro", number> = {
  starter: 5,
  growth: 15,
  pro: 30,
};

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

  let body: { planId?: "starter" | "growth" | "pro" } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const planId = body.planId ?? "starter";
  const workerLimit = WORKER_LIMITS[planId] ?? 5;
  const { companyId } = await params;

  const { error } = await adminUpdateCompany(supabase, companyId, {
    worker_limit: workerLimit,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "billing.set_plan_db_only",
    targetCompanyId: companyId,
    metadata: { planId, workerLimit },
  });

  return NextResponse.json({ ok: true, planId, workerLimit });
}

