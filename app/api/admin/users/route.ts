import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

type AuthUserLike = {
  id: string;
  email?: string | null;
  created_at?: string | null;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
};

function normalizeQuery(q: string | null): string {
  return (q ?? "").trim().toLowerCase();
}

export async function GET(request: Request) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const q = normalizeQuery(url.searchParams.get("q"));
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const perPage = Math.min(
    100,
    Math.max(10, Number(url.searchParams.get("perPage") ?? "50") || 50)
  );

  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rawUsers = ((data?.users ?? []) as unknown as AuthUserLike[]).filter(
    (u) => Boolean(u?.id)
  );

  const filtered =
    q.length > 0
      ? rawUsers.filter((u) => {
          const email = (u.email ?? "").toLowerCase();
          const name = String(u.user_metadata?.name ?? "").toLowerCase();
          const id = u.id.toLowerCase();
          return email.includes(q) || name.includes(q) || id.includes(q);
        })
      : rawUsers;

  const userIds = filtered.map((u) => u.id);

  const { data: ownerRows } = await supabase
    .from("owner_users")
    .select("id,email,name,company_id")
    .in("id", userIds);

  const ownerById = new Map<
    string,
    { id: string; email: string | null; name: string | null; company_id: string | null }
  >(
    (ownerRows ?? []).map((r) => [
      (r as { id: string }).id,
      {
        id: (r as { id: string }).id,
        email: (r as { email?: string | null }).email ?? null,
        name: (r as { name?: string | null }).name ?? null,
        company_id: (r as { company_id?: string | null }).company_id ?? null,
      },
    ])
  );

  const companyIds = Array.from(
    new Set(
      (ownerRows ?? [])
        .map((r) => (r as { company_id?: string | null }).company_id ?? null)
        .filter(Boolean) as string[]
    )
  );

  const { data: companies } = companyIds.length
    ? await supabase
        .from("companies")
        .select("id,name,account_status,subscription_status,worker_limit")
        .in("id", companyIds)
    : { data: [] as unknown[] };

  const companyById = new Map<
    string,
    {
      id: string;
      name: string;
      account_status: string | null;
      subscription_status: string | null;
      worker_limit: number | null;
    }
  >(
    (companies ?? []).map((c) => [
      (c as { id: string }).id,
      {
        id: (c as { id: string }).id,
        name: (c as { name: string }).name,
        account_status: (c as { account_status?: string | null }).account_status ?? null,
        subscription_status:
          (c as { subscription_status?: string | null }).subscription_status ?? null,
        worker_limit: (c as { worker_limit?: number | null }).worker_limit ?? null,
      },
    ])
  );

  const items = filtered.map((u) => {
    const owner = ownerById.get(u.id) ?? null;
    const companyId = owner?.company_id ?? null;
    const company = companyId ? companyById.get(companyId) ?? null : null;
    const role = String((u.app_metadata ?? {})["role"] ?? "user");
    return {
      id: u.id,
      email: u.email ?? owner?.email ?? null,
      name: String(u.user_metadata?.name ?? owner?.name ?? "") || null,
      role,
      createdAt: u.created_at ?? null,
      lastSignInAt: u.last_sign_in_at ?? null,
      emailConfirmedAt: u.email_confirmed_at ?? null,
      company: company
        ? {
            id: company.id,
            name: company.name,
            accountStatus: company.account_status,
            subscriptionStatus: company.subscription_status,
            workerLimit: company.worker_limit,
          }
        : null,
    };
  });

  return NextResponse.json({
    page,
    perPage,
    total: data?.total ?? null,
    items,
  });
}

