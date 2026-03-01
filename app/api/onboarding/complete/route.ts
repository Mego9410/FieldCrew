import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, updateCompany } from "@/lib/data";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const updated = await updateCompany(
    company.id,
    { onboardingStatus: "complete" } as Parameters<typeof updateCompany>[1],
    supabase
  );
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
