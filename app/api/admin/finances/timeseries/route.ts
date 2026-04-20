import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

type Row = {
  day: string;
  mrr_usd: number;
  cash_collected_usd_cents: number;
  refunds_usd_cents: number;
  paid_invoices_count: number;
  failed_invoices_count: number;
  open_invoices_count: number;
  past_due_invoices_count: number;
};

function isoDate(d: Date) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseRange(range: string | null): number {
  const r = (range ?? "").trim().toLowerCase();
  if (r === "7d") return 7;
  if (r === "30d") return 30;
  if (r === "90d") return 90;
  if (r === "365d") return 365;
  return 30;
}

export async function GET(request: Request) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service role not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const days = parseRange(url.searchParams.get("range"));

  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const { data, error } = await supabase
    .from("stripe_finance_daily")
    .select(
      "day,mrr_usd,cash_collected_usd_cents,refunds_usd_cents,paid_invoices_count,failed_invoices_count,open_invoices_count,past_due_invoices_count"
    )
    .gte("day", isoDate(start))
    .lte("day", isoDate(end))
    .order("day", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as Row[];

  // Always return a continuous series (fill missing days with zeroes)
  const byDay = new Map<string, Row>();
  for (const r of rows) byDay.set(r.day, r);

  const series: Row[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const day = isoDate(d);
    const r = byDay.get(day);
    series.push(
      r ?? {
        day,
        mrr_usd: 0,
        cash_collected_usd_cents: 0,
        refunds_usd_cents: 0,
        paid_invoices_count: 0,
        failed_invoices_count: 0,
        open_invoices_count: 0,
        past_due_invoices_count: 0,
      }
    );
  }

  return NextResponse.json({ rangeDays: days, series });
}

