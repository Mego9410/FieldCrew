import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, updateCompany } from "@/lib/data";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const { data: row } = await supabase.from("companies").select("settings").eq("id", company.id).single();
  const raw = (row?.settings as Record<string, unknown> | null) ?? {};
  const nextSettings = { ...raw, estimated_insight_dismissed: true };
  const updated = await updateCompany(
    company.id,
    { settings: nextSettings } as Parameters<typeof updateCompany>[1],
    supabase
  );
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
