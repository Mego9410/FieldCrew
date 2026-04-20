import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createStripeServerClient } from "@/lib/stripe/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";

export async function POST(
  _request: Request,
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

  const { companyId } = await params;
  const { data: company } = await supabase
    .from("companies")
    .select("stripe_subscription_id,stripe_customer_id")
    .eq("id", companyId)
    .single();

  const subscriptionId =
    (company as { stripe_subscription_id?: string | null } | null)
      ?.stripe_subscription_id ?? null;
  const customerId =
    (company as { stripe_customer_id?: string | null } | null)
      ?.stripe_customer_id ?? null;

  if (!subscriptionId || !customerId) {
    return NextResponse.json(
      { error: "Company has no Stripe subscription/customer" },
      { status: 400 }
    );
  }

  const invoices = await stripe.invoices.list({
    customer: customerId,
    subscription: subscriptionId,
    limit: 10,
  });

  const failed = invoices.data.find(
    (i) => i.status === "open" || i.status === "uncollectible"
  );

  if (!failed) {
    return NextResponse.json({ ok: true, retried: false });
  }

  const paid = await stripe.invoices.pay(failed.id);

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "billing.retry_failed_payment",
    targetCompanyId: companyId,
    metadata: { invoiceId: failed.id, status: paid.status },
  });

  return NextResponse.json({ ok: true, retried: true, invoiceId: failed.id, status: paid.status });
}

