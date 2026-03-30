import { createClient } from "@/lib/supabase/server";
import {
  addJob,
  addJobType,
  getCompanyForCurrentUser,
  getJobTypes,
  getOnboardingProfile,
  updateOnboardingProfileProgress,
} from "@/lib/data";
import { onboardingSeedJobsSchema } from "@/lib/onboardingSeedSchemas";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = onboardingSeedJobsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const existingTypes = await getJobTypes(company.id, supabase);
  const typeByName = new Map(existingTypes.map((t) => [t.name.toLowerCase(), t.id]));
  const created = [];
  for (const j of parsed.data.jobs) {
    let typeId: string | undefined;
    if (j.jobType) {
      const key = j.jobType.toLowerCase();
      typeId = typeByName.get(key);
      if (!typeId) {
        const t = await addJobType({ name: j.jobType, companyId: company.id }, supabase);
        typeId = t.id;
        typeByName.set(key, typeId);
      }
    }

    const job = await addJob(
      {
        name: j.title,
        address: j.customerOrSiteName || "Site to be confirmed",
        companyId: company.id,
        customerName: j.customerOrSiteName ?? undefined,
        typeId,
        hoursExpected: j.estimatedHours,
        date: j.scheduledDate ?? undefined,
        workerIds: j.assignedWorkerIds ?? [],
        status: "scheduled",
        createdViaOnboarding: true,
      },
      supabase
    );
    created.push(job);
  }

  const profile = await getOnboardingProfile(company.id, supabase);
  if (profile) {
    await updateOnboardingProfileProgress(
      company.id,
      {
        onboardingStepCompleted: 6,
        onboardingSeedJobsCompleted: created.length > 0,
      },
      supabase
    );
  }

  return NextResponse.json({ ok: true, jobs: created, createdCount: created.length });
}
