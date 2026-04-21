import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

type AuthUserLike = {
  id: string;
  email?: string | null;
  created_at?: string | null;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
  banned_until?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
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

  const { userId } = await params;
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data?.user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const u = data.user as unknown as AuthUserLike;

  const { data: ownerRow } = await supabase
    .from("owner_users")
    .select("id,email,name,company_id")
    .eq("id", userId)
    .maybeSingle();

  const companyId =
    (ownerRow as { company_id?: string | null } | null)?.company_id ?? null;

  const { data: company } = companyId
    ? await supabase
        .from("companies")
        .select(
          "id,name,account_status,onboarding_status,subscription_status,worker_limit,stripe_customer_id,stripe_subscription_id"
        )
        .eq("id", companyId)
        .maybeSingle()
    : { data: null as unknown };

  return NextResponse.json({
    user: {
      id: u.id,
      email: u.email ?? (ownerRow as { email?: string | null } | null)?.email ?? null,
      name:
        String(u.user_metadata?.name ?? (ownerRow as { name?: string | null } | null)?.name ?? "") ||
        null,
      role: String((u.app_metadata ?? {})["role"] ?? "user"),
      createdAt: u.created_at ?? null,
      lastSignInAt: u.last_sign_in_at ?? null,
      emailConfirmedAt: u.email_confirmed_at ?? null,
      bannedUntil: u.banned_until ?? null,
      metadata: {
        app: u.app_metadata ?? {},
        user: u.user_metadata ?? {},
      },
    },
    ownerRow: ownerRow
      ? {
          id: (ownerRow as { id: string }).id,
          email: (ownerRow as { email?: string | null }).email ?? null,
          name: (ownerRow as { name?: string | null }).name ?? null,
          companyId: (ownerRow as { company_id?: string | null }).company_id ?? null,
        }
      : null,
    company: company
      ? {
          id: (company as { id: string }).id,
          name: (company as { name: string }).name,
          accountStatus: (company as { account_status?: string | null }).account_status ?? null,
          onboardingStatus:
            (company as { onboarding_status?: string | null }).onboarding_status ?? null,
          subscriptionStatus:
            (company as { subscription_status?: string | null }).subscription_status ?? null,
          workerLimit: (company as { worker_limit?: number | null }).worker_limit ?? null,
          stripeCustomerId:
            (company as { stripe_customer_id?: string | null }).stripe_customer_id ?? null,
          stripeSubscriptionId:
            (company as { stripe_subscription_id?: string | null }).stripe_subscription_id ?? null,
        }
      : null,
  });
}

