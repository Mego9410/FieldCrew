import { createClient } from "@/lib/supabase/server";
import {
  getCompanyForCurrentUser,
  getOnboardingProfile,
  updateCompany,
  upsertOnboardingProfile,
} from "@/lib/data";
import { generateEstimatedSnapshot } from "@/lib/insights/generateEstimatedSnapshot";
import { onboardingInsightBodySchema } from "@/lib/onboardingInsightSchema";
import type { OnboardingInsightInputs } from "@/types/onboarding";
import { NextResponse } from "next/server";

async function handleUpsert(request: Request) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = onboardingInsightBodySchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    return NextResponse.json({ error: "Validation failed", details: msg }, { status: 400 });
  }

  const b = parsed.data;
  const insightInputs: OnboardingInsightInputs = {
    companyName: b.companyName,
    tradeType: b.tradeType,
    fieldTechCount: b.fieldTechCount,
    officeStaffCount: b.officeStaffCount,
    jobsPerWeek: b.jobsPerWeek,
    avgJobDurationBand: b.avgJobDurationBand,
    overrunFrequency: b.overrunFrequency,
    overtimeFrequency: b.overtimeFrequency ?? "rarely",
  };

  const estimatedSnapshot = generateEstimatedSnapshot(insightInputs);
  const existingProfile = await getOnboardingProfile(company.id, supabase);

  let profile: Awaited<ReturnType<typeof upsertOnboardingProfile>> = null;
  try {
    profile = await upsertOnboardingProfile(
      company.id,
      {
        companyName: b.companyName,
        insightInputs,
        estimatedSnapshot,
        onboardingStepCompleted: 4,
        onboardingSeedWorkersCompleted: existingProfile?.onboardingSeedWorkersCompleted ?? false,
        onboardingSeedJobsCompleted: existingProfile?.onboardingSeedJobsCompleted ?? false,
      },
      supabase
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save onboarding profile";
    return NextResponse.json({ error: "Failed to save onboarding profile", details: message }, { status: 500 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Failed to save onboarding profile" }, { status: 500 });
  }

  let updated: Awaited<ReturnType<typeof updateCompany>> = null;
  try {
    updated = await updateCompany(
      company.id,
      {
        name: b.companyName,
        usingEstimatedInsight: true,
      },
      supabase
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update company";
    return NextResponse.json({ error: "Failed to update company", details: message }, { status: 500 });
  }
  if (!updated) {
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, estimatedSnapshot, profile });
}

export async function POST(request: Request) {
  return handleUpsert(request);
}

export async function PATCH(request: Request) {
  return handleUpsert(request);
}
