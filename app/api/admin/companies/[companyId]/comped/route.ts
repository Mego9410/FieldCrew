import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { adminUpdateCompany } from "@/lib/admin/db";

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

  let body: { comped?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // ok
  }

  const comped = body.comped !== false;
  const { companyId } = await params;

  const { data: company } = await supabase
    .from("companies")
    .select("settings,stripe_subscription_id,subscription_status")
    .eq("id", companyId)
    .single();

  const settings =
    ((company as { settings?: unknown } | null)?.settings as Record<string, unknown> | null) ??
    {};
  const nextSettings: Record<string, unknown> = {
    ...settings,
    billing: {
      ...(typeof settings.billing === "object" && settings.billing ? (settings.billing as Record<string, unknown>) : {}),
      comped,
    },
  };

  // If there is no Stripe subscription, subscription_status controls access.
  // If there *is* a Stripe subscription, we don't override Stripe's status here.
  const hasStripeSub =
    Boolean((company as { stripe_subscription_id?: string | null } | null)?.stripe_subscription_id);
  const update: Record<string, unknown> = { settings: nextSettings };
  if (!hasStripeSub) {
    update.subscription_status = comped ? "active" : "inactive";
  }

  const { error } = await adminUpdateCompany(supabase, companyId, update);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "billing.set_comped",
    targetCompanyId: companyId,
    metadata: { comped, hasStripeSub },
  });

  return NextResponse.json({ ok: true, comped, hasStripeSub });
}

