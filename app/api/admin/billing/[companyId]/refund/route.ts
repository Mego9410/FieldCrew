import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createStripeServerClient } from "@/lib/stripe/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const stripe = createStripeServerClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  let body: { paymentIntentId?: string; chargeId?: string; amountCents?: number } =
    {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const paymentIntentId = body.paymentIntentId?.trim();
  const chargeId = body.chargeId?.trim();
  if (!paymentIntentId && !chargeId) {
    return NextResponse.json(
      { error: "Provide paymentIntentId or chargeId" },
      { status: 400 }
    );
  }

  const { companyId } = await params;

  // Verify the charge/payment intent actually belongs to this company's Stripe
  // customer before issuing a refund (prevents refunding arbitrary charges).
  const service = createServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }
  const { data: companyRow } = await service
    .from("companies")
    .select("stripe_customer_id")
    .eq("id", companyId)
    .maybeSingle();
  const companyCustomerId =
    (companyRow as { stripe_customer_id?: string | null } | null)?.stripe_customer_id ?? null;
  if (!companyCustomerId) {
    return NextResponse.json(
      { error: "Company has no Stripe customer" },
      { status: 400 }
    );
  }

  let refund;
  try {
    // Resolve the charge's owning customer and confirm it matches this company.
    let chargeCustomerId: string | null = null;
    if (chargeId) {
      const charge = await stripe.charges.retrieve(chargeId);
      chargeCustomerId =
        typeof charge.customer === "string" ? charge.customer : charge.customer?.id ?? null;
    } else if (paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      chargeCustomerId =
        typeof pi.customer === "string" ? pi.customer : pi.customer?.id ?? null;
    }

    if (chargeCustomerId !== companyCustomerId) {
      return NextResponse.json(
        { error: "Charge does not belong to this company" },
        { status: 403 }
      );
    }

    refund = await stripe.refunds.create({
      ...(paymentIntentId ? { payment_intent: paymentIntentId } : {}),
      ...(chargeId ? { charge: chargeId } : {}),
      ...(typeof body.amountCents === "number" && body.amountCents > 0
        ? { amount: Math.floor(body.amountCents) }
        : {}),
    });
  } catch (err) {
    console.error("[admin/refund] Stripe error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Refund failed" },
      { status: 502 }
    );
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "billing.refund",
    targetCompanyId: companyId,
    metadata: {
      refundId: refund.id,
      paymentIntentId: paymentIntentId ?? null,
      chargeId: chargeId ?? null,
      amount: refund.amount,
      status: refund.status,
    },
  });

  return NextResponse.json({ ok: true, refundId: refund.id, status: refund.status });
}

