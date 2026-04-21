import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, mergeCompanySettingsForDb, updateCompany } from "@/lib/data";
import type { CompanyTourV1, CompanyTourV1Status } from "@/lib/entities";

type ProgressEvent =
  | "report_exported"
  | "payroll_exported"
  | "dismiss"
  | "resume"
  | "complete";

type Body = {
  status?: CompanyTourV1Status;
  step?: number;
  event?: ProgressEvent;
};

function getDefaultTour(): CompanyTourV1 {
  return { status: "active", step: 0 };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  let body: Body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const current = company.settings?.tourV1 ?? getDefaultTour();
  const next: CompanyTourV1 = { ...current };

  if (body.status) next.status = body.status;
  if (body.step != null && Number.isFinite(body.step)) {
    next.step = Math.max(current.step, Math.max(0, Math.floor(body.step)));
  }

  if (body.event) {
    if (body.event === "report_exported") next.reportExportedAt = now;
    if (body.event === "payroll_exported") next.payrollExportedAt = now;
    if (body.event === "dismiss") {
      next.status = "dismissed";
      next.dismissedAt = now;
    }
    if (body.event === "resume") {
      next.status = "active";
      next.dismissedAt = undefined;
    }
    if (body.event === "complete") {
      next.status = "completed";
      next.completedAt = now;
    }
  }

  const settings = mergeCompanySettingsForDb(company.settings, { tourV1: next });
  const updated = await updateCompany(company.id, { settings }, supabase);
  if (!updated) return NextResponse.json({ error: "Failed to update tutorial" }, { status: 500 });

  return NextResponse.json({ ok: true, tour: updated.settings?.tourV1 ?? null });
}

export async function GET() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
  return NextResponse.json({ tour: company.settings?.tourV1 ?? getDefaultTour() });
}

