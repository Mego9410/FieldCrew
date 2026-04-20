import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createStripeServerClient } from "@/lib/stripe/server";
import { getBillingPlan } from "@/lib/billing/plans";
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

  const stripe = createStripeServerClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let body: { planId?: string; prorationBehavior?: "none" | "create_prorations" | "always_invoice" } =
    {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const plan = getBillingPlan(body.planId);
  if (!plan?.stripePriceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
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

  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const itemId = sub.items.data[0]?.id;
  if (!itemId) {
    return NextResponse.json(
      { error: "Subscription has no items" },
      { status: 400 }
    );
  }

  const proration_behavior =
    body.prorationBehavior === "none"
      ? "none"
      : body.prorationBehavior === "always_invoice"
        ? "always_invoice"
        : "create_prorations";

  const workerLimit = WORKER_LIMITS[plan.id];

  await stripe.subscriptions.update(subscriptionId, {
    proration_behavior,
    items: [{ id: itemId, price: plan.stripePriceId }],
    metadata: {
      ...(sub.metadata ?? {}),
      company_id: sub.metadata?.company_id ?? companyId,
      worker_limit: String(workerLimit),
      plan_name: plan.name,
    },
  });

  await adminUpdateCompany(supabase, companyId, { worker_limit: workerLimit });

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "billing.change_plan",
    targetCompanyId: companyId,
    metadata: { planId: plan.id, proration_behavior },
  });

  return NextResponse.json({ ok: true, planId: plan.id, workerLimit });
}

