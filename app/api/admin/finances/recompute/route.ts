import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

const PLAN_BY_LIMIT: Record<number, { name: string; mrrUsd: number }> = {
  5: { name: "Starter", mrrUsd: 49 },
  15: { name: "Growth", mrrUsd: 89 },
  30: { name: "Pro", mrrUsd: 149 },
};

type SubSnap = {
  stripe_subscription_id: string;
  effective_at: string;
  status: string;
  worker_limit: number | null;
};

type Invoice = {
  stripe_invoice_id: string;
  status: string | null;
  created_at: string;
  paid_at: string | null;
  amount_paid: number | null;
  amount_due: number | null;
  currency: string | null;
  updated_at: string;
};

type Charge = {
  stripe_charge_id: string;
  amount_refunded: number;
  refunded_at: string | null;
  currency: string | null;
  updated_at: string;
};

function isoDate(d: Date) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function dayStartUtc(dayIso: string) {
  return new Date(`${dayIso}T00:00:00.000Z`);
}

function dayEndUtc(dayIso: string) {
  return new Date(`${dayIso}T23:59:59.999Z`);
}

function parseDays(v: string | null) {
  const n = parseInt(v ?? "30", 10);
  if (!Number.isFinite(n)) return 30;
  return Math.min(Math.max(n, 1), 366);
}

export async function POST(request: Request) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const days = parseDays(url.searchParams.get("days"));

  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const startIso = isoDate(start);
  const endIso = isoDate(end);

  // Fetch snapshots slightly before window to seed state.
  const seedStart = new Date(start);
  seedStart.setUTCDate(seedStart.getUTCDate() - 14);

  const [{ data: snapsRaw, error: snapsErr }, { data: invRaw, error: invErr }, { data: chRaw, error: chErr }] =
    await Promise.all([
      supabase
        .from("stripe_subscription_snapshots")
        .select("stripe_subscription_id,effective_at,status,worker_limit")
        .gte("effective_at", seedStart.toISOString())
        .lte("effective_at", dayEndUtc(endIso).toISOString())
        .order("effective_at", { ascending: true }),
      supabase
        .from("stripe_invoice_facts")
        .select("stripe_invoice_id,status,created_at,paid_at,amount_paid,amount_due,currency,updated_at")
        .gte("created_at", seedStart.toISOString())
        .lte("created_at", dayEndUtc(endIso).toISOString())
        .order("created_at", { ascending: true }),
      supabase
        .from("stripe_charge_facts")
        .select("stripe_charge_id,amount_refunded,refunded_at,currency,updated_at")
        .gte("updated_at", seedStart.toISOString())
        .lte("updated_at", dayEndUtc(endIso).toISOString())
        .order("updated_at", { ascending: true }),
    ]);

  if (snapsErr) return NextResponse.json({ error: snapsErr.message }, { status: 500 });
  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 500 });
  if (chErr) return NextResponse.json({ error: chErr.message }, { status: 500 });

  const snaps = (snapsRaw ?? []) as unknown as SubSnap[];
  const invoices = (invRaw ?? []) as unknown as Invoice[];
  const charges = (chRaw ?? []) as unknown as Charge[];

  // Build subscription timelines
  const snapBySub = new Map<string, SubSnap[]>();
  for (const s of snaps) {
    const arr = snapBySub.get(s.stripe_subscription_id) ?? [];
    arr.push(s);
    snapBySub.set(s.stripe_subscription_id, arr);
  }

  // Helper: compute MRR at end of given day by walking per-subscription timelines.
  function computeMrrForDayEnd(dayIso: string): number {
    const endTs = dayEndUtc(dayIso).getTime();
    let total = 0;
    for (const [, timeline] of snapBySub) {
      // timeline is sorted asc by effective_at
      let last: SubSnap | null = null;
      for (let i = 0; i < timeline.length; i++) {
        const t = new Date(timeline[i]!.effective_at).getTime();
        if (t <= endTs) last = timeline[i]!;
        else break;
      }
      if (!last) continue;
      if ((last.status ?? "").toLowerCase() !== "active") continue;
      const wl = last.worker_limit ?? 5;
      total += PLAN_BY_LIMIT[wl]?.mrrUsd ?? PLAN_BY_LIMIT[5].mrrUsd;
    }
    return total;
  }

  function sumCashPaid(dayIso: string): { cents: number; count: number } {
    const startTs = dayStartUtc(dayIso).getTime();
    const endTs = dayEndUtc(dayIso).getTime();
    let cents = 0;
    let count = 0;
    for (const inv of invoices) {
      if ((inv.currency ?? "").toLowerCase() !== "usd") continue;
      if (!inv.paid_at) continue;
      const t = new Date(inv.paid_at).getTime();
      if (t >= startTs && t <= endTs) {
        cents += inv.amount_paid ?? 0;
        count += 1;
      }
    }
    return { cents, count };
  }

  function sumRefunds(dayIso: string): number {
    const startTs = dayStartUtc(dayIso).getTime();
    const endTs = dayEndUtc(dayIso).getTime();
    let cents = 0;
    for (const ch of charges) {
      if ((ch.currency ?? "").toLowerCase() !== "usd") continue;
      if (!ch.refunded_at) continue;
      const t = new Date(ch.refunded_at).getTime();
      if (t >= startTs && t <= endTs) cents += ch.amount_refunded ?? 0;
    }
    return cents;
  }

  function invoiceStatusCountsAtEnd(dayIso: string): {
    failed: number;
    open: number;
    pastDue: number;
  } {
    const endTs = dayEndUtc(dayIso).getTime();
    // Use latest known invoice status up to end of day (by updated_at) for invoices created within seed window.
    const latestById = new Map<string, Invoice>();
    for (const inv of invoices) {
      const t = new Date(inv.updated_at).getTime();
      if (t > endTs) continue;
      const prev = latestById.get(inv.stripe_invoice_id);
      if (!prev || new Date(prev.updated_at).getTime() < t) latestById.set(inv.stripe_invoice_id, inv);
    }
    let failed = 0;
    let open = 0;
    let pastDue = 0;
    for (const [, inv] of latestById) {
      const s = (inv.status ?? "").toLowerCase();
      if (s === "past_due") pastDue += 1;
      else if (s === "open") open += 1;
      else if (s === "uncollectible") failed += 1;
    }
    return { failed, open, pastDue };
  }

  type RollupUpsertRow = {
    day: string;
    mrr_usd: number;
    cash_collected_usd_cents: number;
    refunds_usd_cents: number;
    paid_invoices_count: number;
    failed_invoices_count: number;
    open_invoices_count: number;
    past_due_invoices_count: number;
    updated_at: string;
  };

  const upserts: RollupUpsertRow[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const day = isoDate(d);
    const mrrUsd = computeMrrForDayEnd(day);
    const cash = sumCashPaid(day);
    const refunds = sumRefunds(day);
    const counts = invoiceStatusCountsAtEnd(day);

    upserts.push({
      day,
      mrr_usd: mrrUsd,
      cash_collected_usd_cents: cash.cents,
      refunds_usd_cents: refunds,
      paid_invoices_count: cash.count,
      failed_invoices_count: counts.failed,
      open_invoices_count: counts.open,
      past_due_invoices_count: counts.pastDue,
      updated_at: new Date().toISOString(),
    });
  }

  // Upsert rollups
  type UntypedUpsert = {
    from: (table: "stripe_finance_daily") => {
      upsert: (values: unknown, opts?: unknown) => Promise<{ error: { message: string } | null }>;
    };
  };
  const { error: upErr } = await (supabase as unknown as UntypedUpsert)
    .from("stripe_finance_daily")
    .upsert(upserts, { onConflict: "day" });

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, start: startIso, end: endIso, days, upserted: upserts.length });
}

