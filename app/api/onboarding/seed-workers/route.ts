import { createClient } from "@/lib/supabase/server";
import {
  addWorker,
  getCompanyForCurrentUser,
  getOnboardingProfile,
  WorkerLimitError,
  updateOnboardingProfileProgress,
} from "@/lib/data";
import { onboardingSeedWorkersSchema } from "@/lib/onboardingSeedSchemas";
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

  const parsed = onboardingSeedWorkersSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const created = [];
  try {
    for (const w of parsed.data.workers) {
      const name = `${w.firstName}${w.lastName ? ` ${w.lastName}` : ""}`.trim();
      const worker = await addWorker(
        {
          name,
          phone: w.mobileNumber,
          hourlyRate: w.hourlyRate,
          companyId: company.id,
          role: (w.role?.toLowerCase() as "lead" | "tech" | "apprentice" | undefined) ?? "tech",
          createdViaOnboarding: true,
        },
        supabase
      );
      created.push(worker);
    }
  } catch (e) {
    if (e instanceof WorkerLimitError) {
      return NextResponse.json(
        { error: e.message, code: e.code, limit: e.limit },
        { status: 402 }
      );
    }
    const message = e instanceof Error ? e.message : "Could not save workers";
    return NextResponse.json({ error: "Could not save workers", details: message }, { status: 500 });
  }

  const profile = await getOnboardingProfile(company.id, supabase);
  if (profile) {
    await updateOnboardingProfileProgress(
      company.id,
      {
        onboardingStepCompleted: 5,
        onboardingSeedWorkersCompleted: created.length > 0,
      },
      supabase
    );
  }

  return NextResponse.json({ ok: true, workers: created, createdCount: created.length });
}
