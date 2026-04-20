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

  let body: { promoCode?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const promoCode = (body.promoCode ?? "").trim();
  if (!promoCode) {
    return NextResponse.json({ error: "Missing promoCode" }, { status: 400 });
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

  const found = await stripe.promotionCodes.list({
    code: promoCode,
    active: true,
    limit: 1,
  });
  const promotionCodeId = found.data[0]?.id ?? null;
  if (!promotionCodeId) {
    return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
  }

  await stripe.subscriptions.update(subscriptionId, {
    discounts: [{ promotion_code: promotionCodeId }],
    metadata: { promo_code_admin_applied: promoCode },
  });

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "billing.apply_coupon",
    targetCompanyId: companyId,
    metadata: { promoCode, promotionCodeId },
  });

  return NextResponse.json({ ok: true, promoCode });
}

