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

  let body: { pause?: boolean } = {};
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

  const pause = body.pause !== false;
  await stripe.subscriptions.update(subscriptionId, {
    pause_collection: pause ? { behavior: "void" } : null,
  });

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: pause ? "billing.pause" : "billing.unpause",
    targetCompanyId: companyId,
    metadata: { pause },
  });

  return NextResponse.json({ ok: true, pause });
}

