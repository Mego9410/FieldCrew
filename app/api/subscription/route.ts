import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getWorkers } from "@/lib/data";

const PLAN_BY_LIMIT: Record<number, { name: string; price: number }> = {
  5: { name: "Starter", price: 49 },
  15: { name: "Growth", price: 89 },
  30: { name: "Pro", price: 149 },
};

export async function GET() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }
  const workers = await getWorkers(company.id, supabase);
  const workerLimit = company.workerLimit ?? 5;
  const plan = PLAN_BY_LIMIT[workerLimit] ?? { name: "Starter", price: 49 };
  return NextResponse.json({
    planName: plan.name,
    planPrice: plan.price,
    workerLimit,
    workersUsed: workers.length,
    subscriptionStatus: company.subscriptionStatus ?? null,
  });
}
