import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

type InvoiceRow = {
  stripe_invoice_id: string;
  company_id: string | null;
  status: string | null;
  created_at: string;
  due_at: string | null;
  amount_due: number | null;
  currency: string | null;
  hosted_invoice_url: string | null;
  attempt_count: number | null;
  next_payment_attempt: string | null;
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
    .from("stripe_invoice_facts")
    .select(
      "stripe_invoice_id,company_id,status,created_at,due_at,amount_due,currency,hosted_invoice_url,attempt_count,next_payment_attempt"
    )
    .in("status", ["open", "past_due", "uncollectible"])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const invoices = (data ?? []) as unknown as InvoiceRow[];
  const companyIds = Array.from(new Set(invoices.map((i) => i.company_id).filter(Boolean))) as string[];

  const companiesById = new Map<string, { id: string; name: string }>();
  if (companyIds.length) {
    const { data: companies } = await supabase.from("companies").select("id,name").in("id", companyIds);
    ((companies ?? []) as unknown as { id: string; name: string }[]).forEach((c) => companiesById.set(c.id, c));
  }

  const now = Date.now();
  type AgingBucket = { count: number; amountDue: number };
  const agingBuckets: Record<"0-7" | "8-14" | "15-30" | "30+", AgingBucket> = {
    "0-7": { count: 0, amountDue: 0 },
    "8-14": { count: 0, amountDue: 0 },
    "15-30": { count: 0, amountDue: 0 },
    "30+": { count: 0, amountDue: 0 },
  };

  const enriched = invoices.map((i) => {
    const dueAt = i.due_at ? new Date(i.due_at).getTime() : null;
    const ageDays = dueAt != null ? Math.max(0, Math.floor((now - dueAt) / (24 * 3600 * 1000))) : null;
    const amt = i.amount_due ?? 0;

    if (ageDays != null) {
      const bucket =
        ageDays <= 7 ? "0-7" : ageDays <= 14 ? "8-14" : ageDays <= 30 ? "15-30" : "30+";
      agingBuckets[bucket].count += 1;
      agingBuckets[bucket].amountDue += amt;
    }

    const company =
      i.company_id && companiesById.has(i.company_id) ? companiesById.get(i.company_id)! : null;

    return {
      id: i.stripe_invoice_id,
      status: i.status ?? null,
      companyId: i.company_id,
      companyName: company?.name ?? null,
      createdAt: i.created_at,
      dueAt: i.due_at,
      amountDue: i.amount_due ?? null,
      currency: i.currency ?? null,
      hostedInvoiceUrl: i.hosted_invoice_url ?? null,
      attemptCount: i.attempt_count ?? null,
      nextPaymentAttempt: i.next_payment_attempt ?? null,
      ageDays,
    };
  });

  // Sort by amount due desc, then age desc
  enriched.sort((a, b) => (b.amountDue ?? 0) - (a.amountDue ?? 0) || (b.ageDays ?? 0) - (a.ageDays ?? 0));

  return NextResponse.json({ agingBuckets, invoices: enriched });
}

