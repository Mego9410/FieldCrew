import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, updateCompany } from "@/lib/data";
import type { CompanySettings } from "@/lib/entities";
import { NextResponse } from "next/server";

export type OnboardingSaveBody = {
  step: number;
  payload?: {
    companyName?: string;
    workType?: string;
    expectedTeamSize?: number;
    currentTrackingMethod?: string;
    settings?: Partial<CompanySettings>;
  };
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let body: OnboardingSaveBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { step, payload = {} } = body;
  const updates: Parameters<typeof updateCompany>[1] = {};
  const currentSettings = company.settings ?? {};

  if (payload.companyName != null) updates.name = payload.companyName;
  if (payload.workType != null) (updates as Record<string, unknown>).workType = payload.workType;
  if (payload.expectedTeamSize != null) (updates as Record<string, unknown>).expectedTeamSize = payload.expectedTeamSize;
  if (payload.currentTrackingMethod != null) (updates as Record<string, unknown>).currentTrackingMethod = payload.currentTrackingMethod;
  if (payload.settings != null) {
    (updates as Record<string, unknown>).settings = { ...currentSettings, ...payload.settings, onboardingStep: step };
  } else {
    (updates as Record<string, unknown>).settings = { ...currentSettings, onboardingStep: step };
  }

  const updated = await updateCompany(company.id, updates, supabase);
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, company: updated });
}
