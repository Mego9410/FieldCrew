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
      // Idempotency: if a worker with this phone already exists for the company,
      // update their details instead of inserting a duplicate (common when users go back and re-submit).
      const { data: existing } = await supabase
        .from("workers")
        .select("id")
        .eq("company_id", company.id)
        .eq("phone", w.mobileNumber)
        .maybeSingle();

      const role = (w.role?.toLowerCase() as "lead" | "tech" | "apprentice" | undefined) ?? "tech";
      const worker = existing?.id
        ? await supabase
            .from("workers")
            .update({
              name,
              hourly_rate: w.hourlyRate,
              role,
              created_via_onboarding: true,
            })
            .eq("id", existing.id)
            .select("*")
            .single()
            .then(({ data, error }) => {
              if (error || !data) throw error ?? new Error("Update failed");
              return data;
            })
        : await addWorker(
            {
              name,
              phone: w.mobileNumber,
              hourlyRate: w.hourlyRate,
              companyId: company.id,
              role,
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
