import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getWorkers } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }
  const workers = await getWorkers(company.id, supabase);
  return NextResponse.json({ workers });
}
