import { createClient } from "@/lib/supabase/server";
import {
  getCompanyForCurrentUser,
  updateCompany,
  mergeCompanySettingsForDb,
} from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }
  return NextResponse.json({
    jobReminderHours: company.settings?.jobReminderHours ?? 0,
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let body: { jobReminderHours?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const hours =
    body.jobReminderHours !== undefined ? Number(body.jobReminderHours) : undefined;
  if (hours !== undefined && (isNaN(hours) || hours < 0)) {
    return NextResponse.json(
      { error: "jobReminderHours must be a non-negative number" },
      { status: 400 }
    );
  }

  const settings = mergeCompanySettingsForDb(company.settings, {
    jobReminderHours: hours ?? 0,
  });
  const updated = await updateCompany(
    company.id,
    { settings },
    supabase
  );
  if (!updated) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
  return NextResponse.json({
    jobReminderHours: updated.settings?.jobReminderHours ?? 0,
  });
}
