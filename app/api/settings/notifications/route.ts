import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, mergeCompanySettingsForDb, updateCompany } from "@/lib/data";

type NotificationPrefs = {
  weeklyLabourSummaryEmail: boolean;
  overtimeThresholdEmail: boolean;
  overtimeThresholdInApp: boolean;
  jobOverBudgetInApp: boolean;
  unapprovedTimesheetsEmail: boolean;
  clockInReminderInApp: boolean;
  breakReminderInApp: boolean;
  shiftEditedEmail: boolean;
};

function defaults(): NotificationPrefs {
  return {
    weeklyLabourSummaryEmail: true,
    overtimeThresholdEmail: true,
    overtimeThresholdInApp: true,
    jobOverBudgetInApp: true,
    unapprovedTimesheetsEmail: true,
    clockInReminderInApp: true,
    breakReminderInApp: true,
    shiftEditedEmail: true,
  };
}

function asBool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

export async function GET() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const d = defaults();
  return NextResponse.json({
    notifications: {
      weeklyLabourSummaryEmail: asBool(company.settings?.weeklyLabourSummaryEmail, d.weeklyLabourSummaryEmail),
      overtimeThresholdEmail: asBool(company.settings?.overtimeThresholdEmail, d.overtimeThresholdEmail),
      overtimeThresholdInApp: asBool(company.settings?.overtimeThresholdInApp, d.overtimeThresholdInApp),
      jobOverBudgetInApp: asBool(company.settings?.jobOverBudgetInApp, d.jobOverBudgetInApp),
      unapprovedTimesheetsEmail: asBool(company.settings?.unapprovedTimesheetsEmail, d.unapprovedTimesheetsEmail),
      clockInReminderInApp: asBool(company.settings?.clockInReminderInApp, d.clockInReminderInApp),
      breakReminderInApp: asBool(company.settings?.breakReminderInApp, d.breakReminderInApp),
      shiftEditedEmail: asBool(company.settings?.shiftEditedEmail, d.shiftEditedEmail),
    },
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  let body: { notifications?: Partial<NotificationPrefs> } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const patch = body.notifications ?? {};
  const d = defaults();

  const next: NotificationPrefs = {
    weeklyLabourSummaryEmail: asBool(patch.weeklyLabourSummaryEmail, asBool(company.settings?.weeklyLabourSummaryEmail, d.weeklyLabourSummaryEmail)),
    overtimeThresholdEmail: asBool(patch.overtimeThresholdEmail, asBool(company.settings?.overtimeThresholdEmail, d.overtimeThresholdEmail)),
    overtimeThresholdInApp: asBool(patch.overtimeThresholdInApp, asBool(company.settings?.overtimeThresholdInApp, d.overtimeThresholdInApp)),
    jobOverBudgetInApp: asBool(patch.jobOverBudgetInApp, asBool(company.settings?.jobOverBudgetInApp, d.jobOverBudgetInApp)),
    unapprovedTimesheetsEmail: asBool(patch.unapprovedTimesheetsEmail, asBool(company.settings?.unapprovedTimesheetsEmail, d.unapprovedTimesheetsEmail)),
    clockInReminderInApp: asBool(patch.clockInReminderInApp, asBool(company.settings?.clockInReminderInApp, d.clockInReminderInApp)),
    breakReminderInApp: asBool(patch.breakReminderInApp, asBool(company.settings?.breakReminderInApp, d.breakReminderInApp)),
    shiftEditedEmail: asBool(patch.shiftEditedEmail, asBool(company.settings?.shiftEditedEmail, d.shiftEditedEmail)),
  };

  const settings = mergeCompanySettingsForDb(company.settings, next);
  const updated = await updateCompany(company.id, { settings }, supabase);
  if (!updated) return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });

  return NextResponse.json({ ok: true, notifications: next });
}

