import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createStripeServerClient } from "@/lib/stripe/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";

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

  const stripe = createStripeServerClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let body: { atPeriodEnd?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    // ok
  }

  const { companyId } = await params;
  const { data: company } = await supabase
    .from("companies")
    .select("stripe_subscription_id")
    .eq("id", companyId)
    .single();
  const subscriptionId =
    (company as { stripe_subscription_id?: string | null } | null)
      ?.stripe_subscription_id ?? null;
  if (!subscriptionId) {
    return NextResponse.json(
      { error: "Company has no Stripe subscription" },
      { status: 400 }
    );
  }

  const atPeriodEnd = body.atPeriodEnd !== false;
  const updated = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: atPeriodEnd,
  });

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "billing.cancel",
    targetCompanyId: companyId,
    metadata: { atPeriodEnd, status: updated.status },
  });

  return NextResponse.json({ ok: true, cancelAtPeriodEnd: updated.cancel_at_period_end });
}

