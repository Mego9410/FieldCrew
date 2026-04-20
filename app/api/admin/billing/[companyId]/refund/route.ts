import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createStripeServerClient } from "@/lib/stripe/server";
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

  const refund = await stripe.refunds.create({
    ...(paymentIntentId ? { payment_intent: paymentIntentId } : {}),
    ...(chargeId ? { charge: chargeId } : {}),
    ...(typeof body.amountCents === "number" && body.amountCents > 0
      ? { amount: Math.floor(body.amountCents) }
      : {}),
  });

  const { companyId } = await params;
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

