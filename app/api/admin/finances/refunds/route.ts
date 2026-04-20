import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

type ChargeRow = {
  stripe_charge_id: string;
  company_id: string | null;
  created_at: string;
  amount: number;
  amount_refunded: number;
  refunded_at: string | null;
  currency: string | null;
  receipt_url: string | null;
};

export async function GET(request: Request) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 1), 200);

  const { data, error } = await supabase
    .from("stripe_charge_facts")
    .select("stripe_charge_id,company_id,created_at,amount,amount_refunded,refunded_at,currency,receipt_url")
    .gt("amount_refunded", 0)
    .order("refunded_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const charges = (data ?? []) as unknown as ChargeRow[];
  const companyIds = Array.from(new Set(charges.map((c) => c.company_id).filter(Boolean))) as string[];

  const companiesById = new Map<string, { id: string; name: string }>();
  if (companyIds.length) {
    const { data: companies } = await supabase.from("companies").select("id,name").in("id", companyIds);
    ((companies ?? []) as unknown as { id: string; name: string }[]).forEach((c) => companiesById.set(c.id, c));
  }

  const enriched = charges.map((c) => ({
    id: c.stripe_charge_id,
    companyId: c.company_id,
    companyName: c.company_id ? companiesById.get(c.company_id)?.name ?? null : null,
    createdAt: c.created_at,
    refundedAt: c.refunded_at,
    amount: c.amount,
    amountRefunded: c.amount_refunded,
    currency: c.currency ?? null,
    receiptUrl: c.receipt_url ?? null,
  }));

  return NextResponse.json({ refunds: enriched });
}

