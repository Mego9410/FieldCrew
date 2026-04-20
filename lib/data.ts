/**
 * Supabase-backed data layer.
 * Replaces mock-storage with async Supabase queries for better performance.
 */

import { createClient } from "@/lib/supabase/client";
import type {
  Company,
  OwnerUser,
  Worker,
  WorkerInvite,
  Project,
  Job,
  TimeEntry,
  JobType,
  CompanyInput,
  OwnerUserInput,
  WorkerInput,
  WorkerInviteInput,
  ProjectInput,
  JobInput,
  TimeEntryInput,
  JobTypeInput,
} from "./entities";
import type {
  CompanyOnboardingProfile,
  EstimatedSnapshot,
  OnboardingInsightInputs,
} from "@/types/onboarding";

type SupabaseClient = ReturnType<typeof createClient>;

function uid(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Row mappers (snake_case ↔ camelCase) ───────────────────────────────────

function toCompany(r: Record<string, unknown>): Company {
  const settings = r.settings as Record<string, unknown> | null | undefined;
  return {
    id: r.id as string,
    name: r.name as string,
    address: r.address as string | undefined,
    ownerUserId: (r.owner_user_id as string) ?? undefined,
    workType: r.work_type as Company["workType"],
    expectedTeamSize: r.expected_team_size != null ? Number(r.expected_team_size) : undefined,
    currentTrackingMethod: r.current_tracking_method as Company["currentTrackingMethod"],
    onboardingStatus: (r.onboarding_status as string) ?? undefined,
    stripeCustomerId: (r.stripe_customer_id as string) ?? undefined,
    stripeSubscriptionId: (r.stripe_subscription_id as string) ?? undefined,
    subscriptionStatus: (r.subscription_status as string) ?? undefined,
    workerLimit: r.worker_limit != null ? Number(r.worker_limit) : undefined,
    usingEstimatedInsight: r.using_estimated_insight != null ? Boolean(r.using_estimated_insight) : undefined,
    settings: settings ? {
      onboardingStep:
        settings.onboarding_step != null
          ? Number(settings.onboarding_step)
          : settings.onboardingStep != null
            ? Number(settings.onboardingStep as number)
            : undefined,
      estimatedInsightDismissed:
        (settings.estimated_insight_dismissed ?? settings.estimatedInsightDismissed) as boolean | undefined,
      otAfterHoursPerDay: settings.ot_after_hours_per_day != null ? Number(settings.ot_after_hours_per_day) : undefined,
      otAfterHoursPerWeek: settings.ot_after_hours_per_week != null ? Number(settings.ot_after_hours_per_week) : undefined,
      weekendMultiplier: settings.weekend_multiplier != null ? Number(settings.weekend_multiplier) : undefined,
      holidayMultiplier: settings.holiday_multiplier != null ? Number(settings.holiday_multiplier) : undefined,
      requireJobCode: settings.require_job_code as boolean | undefined,
      requireGps: settings.require_gps as boolean | undefined,
      requireNotesOnClockOut: settings.require_notes_on_clock_out as boolean | undefined,
      requirePhotoOnClockOut: settings.require_photo_on_clock_out as boolean | undefined,
      jobReminderHours: settings.job_reminder_hours != null ? Number(settings.job_reminder_hours) : undefined,
    } : undefined,
  };
}

/** Convert company settings to DB JSONB shape (snake_case) for merging/update. */
function companySettingsToDb(s: Partial<Company["settings"]> | undefined): Record<string, unknown> {
  if (!s) return {};
  const out: Record<string, unknown> = {};
  if (s.otAfterHoursPerDay != null) out.ot_after_hours_per_day = s.otAfterHoursPerDay;
  if (s.otAfterHoursPerWeek != null) out.ot_after_hours_per_week = s.otAfterHoursPerWeek;
  if (s.weekendMultiplier != null) out.weekend_multiplier = s.weekendMultiplier;
  if (s.holidayMultiplier != null) out.holiday_multiplier = s.holidayMultiplier;
  if (s.requireJobCode != null) out.require_job_code = s.requireJobCode;
  if (s.requireGps != null) out.require_gps = s.requireGps;
  if (s.requireNotesOnClockOut != null) out.require_notes_on_clock_out = s.requireNotesOnClockOut;
  if (s.requirePhotoOnClockOut != null) out.require_photo_on_clock_out = s.requirePhotoOnClockOut;
  if (s.jobReminderHours != null) out.job_reminder_hours = s.jobReminderHours;
  if (s.onboardingStep != null) out.onboarding_step = s.onboardingStep;
  if (s.estimatedInsightDismissed != null) out.estimated_insight_dismissed = s.estimatedInsightDismissed;
  return out;
}

/** Merge current company settings with a patch for DB update (e.g. only jobReminderHours). */
export function mergeCompanySettingsForDb(
  current: Company["settings"] | undefined,
  patch: Partial<Company["settings"]>
): Record<string, unknown> {
  return { ...companySettingsToDb(current), ...companySettingsToDb(patch) };
}

function toOwnerUser(r: Record<string, unknown>): OwnerUser {
  return {
    id: r.id as string,
    email: r.email as string,
    name: r.name as string,
    companyId: r.company_id as string,
  };
}

function toWorker(r: Record<string, unknown>): Worker {
  return {
    id: r.id as string,
    name: r.name as string,
    phone: r.phone as string,
    hourlyRate: Number(r.hourly_rate ?? 0),
    companyId: r.company_id as string,
    role: (r.role as Worker["role"]) ?? "tech",
    overtimeRate: r.overtime_rate != null ? Number(r.overtime_rate) : undefined,
    inviteStatus: (r.invite_status as Worker["inviteStatus"]) ?? "not_sent",
    createdViaOnboarding:
      r.created_via_onboarding != null ? Boolean(r.created_via_onboarding) : undefined,
  };
}

function toProject(r: Record<string, unknown>): Project {
  return {
    id: r.id as string,
    name: r.name as string,
    color: (r.color as string) ?? "bg-slate-400",
    companyId: r.company_id as string,
  };
}

function toJobType(r: Record<string, unknown>): JobType {
  return {
    id: r.id as string,
    name: r.name as string,
    companyId: r.company_id as string,
  };
}

function toJob(r: Record<string, unknown>): Job {
  const row = r as Record<string, unknown>;
  return {
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
    companyId: row.company_id as string,
    projectId: row.project_id as string | undefined,
    typeId: row.type_id as string | undefined,
    customerName: row.customer_name as string | undefined,
    revenue: row.revenue != null ? Number(row.revenue) : undefined,
    date: row.date as string | undefined,
    time: row.time as string | undefined,
    startDate: row.start_date as string | undefined,
    endDate: row.end_date as string | undefined,
    hoursPerDay: row.hours_per_day != null ? Number(row.hours_per_day) : undefined,
    hoursExpected: row.hours_expected != null ? Number(row.hours_expected) : undefined,
    isAdhoc: Boolean(row.is_adhoc),
    workerIds: Array.isArray(row.worker_ids) ? (row.worker_ids as string[]) : undefined,
    status: row.status as Job["status"],
    instructions: row.instructions as string | undefined,
    createdViaOnboarding:
      row.created_via_onboarding != null ? Boolean(row.created_via_onboarding) : undefined,
  };
}

function toTimeEntry(r: Record<string, unknown>): TimeEntry {
  const row = r as Record<string, unknown>;
  const start = row.start;
  const end = row.end;
  return {
    id: row.id as string,
    workerId: row.worker_id as string,
    jobId: row.job_id as string,
    start: typeof start === "string" ? start : (start as Date)?.toISOString?.() ?? "",
    end: typeof end === "string" ? end : (end as Date)?.toISOString?.() ?? "",
    breaks: Number(row.breaks ?? 0),
    category: (row.category as TimeEntry["category"]) ?? "billable",
    isOvertime: Boolean(row.is_overtime),
    notes: row.notes as string | undefined,
  };
}

// ─── Companies ──────────────────────────────────────────────────────────────

export async function getCompanies(supabase?: SupabaseClient): Promise<Company[]> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("companies").select("*");
  if (error) throw error;
  return (data ?? []).map(toCompany);
}

export async function getCompany(id: string, supabase?: SupabaseClient): Promise<Company | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("companies").select("*").eq("id", id).single();
  if (error || !data) return null;
  return toCompany(data);
}

export async function addCompany(input: CompanyInput, supabase?: SupabaseClient): Promise<Company> {
  const db = supabase ?? createClient();
  const company: Company = { ...input, id: uid() };
  const { error } = await db.from("companies").insert({
    id: company.id,
    name: company.name,
    address: company.address ?? null,
    owner_user_id: (input as { ownerUserId?: string }).ownerUserId ?? null,
    work_type: (input as { workType?: string }).workType ?? null,
    expected_team_size: (input as { expectedTeamSize?: number }).expectedTeamSize ?? null,
    current_tracking_method: (input as { currentTrackingMethod?: string }).currentTrackingMethod ?? null,
    onboarding_status: (input as { onboardingStatus?: string }).onboardingStatus ?? "incomplete",
    settings: (input as { settings?: Record<string, unknown> }).settings ?? {},
  });
  if (error) throw error;
  return company;
}

export async function updateCompany(id: string, input: Partial<CompanyInput>, supabase?: SupabaseClient): Promise<Company | null> {
  const db = supabase ?? createClient();
  const updates: Record<string, unknown> = {};
  if (input.name != null) updates.name = input.name;
  if (input.address != null) updates.address = input.address;
  if ((input as { ownerUserId?: string }).ownerUserId !== undefined) updates.owner_user_id = (input as { ownerUserId?: string }).ownerUserId;
  if ((input as { workType?: string }).workType !== undefined) updates.work_type = (input as { workType?: string }).workType;
  if ((input as { expectedTeamSize?: number }).expectedTeamSize !== undefined) updates.expected_team_size = (input as { expectedTeamSize?: number }).expectedTeamSize;
  if ((input as { currentTrackingMethod?: string }).currentTrackingMethod !== undefined) updates.current_tracking_method = (input as { currentTrackingMethod?: string }).currentTrackingMethod;
  if ((input as { onboardingStatus?: string }).onboardingStatus !== undefined) updates.onboarding_status = (input as { onboardingStatus?: string }).onboardingStatus;
  if ((input as { settings?: Record<string, unknown> }).settings !== undefined) updates.settings = (input as { settings?: Record<string, unknown> }).settings;
  if ((input as { stripeCustomerId?: string | null }).stripeCustomerId !== undefined) updates.stripe_customer_id = (input as { stripeCustomerId?: string | null }).stripeCustomerId;
  if ((input as { stripeSubscriptionId?: string | null }).stripeSubscriptionId !== undefined) updates.stripe_subscription_id = (input as { stripeSubscriptionId?: string | null }).stripeSubscriptionId;
  if ((input as { subscriptionStatus?: string | null }).subscriptionStatus !== undefined) updates.subscription_status = (input as { subscriptionStatus?: string | null }).subscriptionStatus;
  if ((input as { workerLimit?: number }).workerLimit !== undefined) updates.worker_limit = (input as { workerLimit?: number }).workerLimit;
  if ((input as { usingEstimatedInsight?: boolean }).usingEstimatedInsight !== undefined) {
    updates.using_estimated_insight = (input as { usingEstimatedInsight?: boolean }).usingEstimatedInsight;
  }
  const { data, error } = await db.from("companies").update(updates).eq("id", id).select().single();
  if (error || !data) return null;
  return toCompany(data);
}

export async function deleteCompany(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("companies").delete().eq("id", id);
  return !error;
}

function toOnboardingProfile(r: Record<string, unknown>): CompanyOnboardingProfile | null {
  const snap = r.estimated_snapshot_json as EstimatedSnapshot | undefined;
  if (!snap || typeof snap !== "object") return null;
  return {
    companyId: r.company_id as string,
    companyName: r.company_name as string,
    tradeType: r.trade_type as CompanyOnboardingProfile["tradeType"],
    fieldTechCount: Number(r.field_tech_count ?? 0),
    officeStaffCount: r.office_staff_count != null ? Number(r.office_staff_count) : null,
    jobsPerWeek: Number(r.jobs_per_week ?? 0),
    avgJobDurationBand: r.avg_job_duration_band as CompanyOnboardingProfile["avgJobDurationBand"],
    overrunFrequency: r.overrun_frequency as CompanyOnboardingProfile["overrunFrequency"],
    overtimeFrequency: (r.overtime_frequency as CompanyOnboardingProfile["overtimeFrequency"]) ?? null,
    estimatedSnapshot: snap,
    onboardingCompletedAt: r.onboarding_completed_at ? String(r.onboarding_completed_at) : null,
    onboardingStepCompleted:
      r.onboarding_step_completed != null ? Number(r.onboarding_step_completed) : null,
    onboardingSeedWorkersCompleted:
      r.onboarding_seed_workers_completed != null
        ? Boolean(r.onboarding_seed_workers_completed)
        : false,
    onboardingSeedJobsCompleted:
      r.onboarding_seed_jobs_completed != null ? Boolean(r.onboarding_seed_jobs_completed) : false,
    createdAt: String(r.created_at ?? ""),
    updatedAt: String(r.updated_at ?? ""),
  };
}

export async function getOnboardingProfile(
  companyId: string,
  supabase?: SupabaseClient
): Promise<CompanyOnboardingProfile | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("company_onboarding_profile")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();
  if (error || !data) return null;
  return toOnboardingProfile(data as Record<string, unknown>);
}

export async function upsertOnboardingProfile(
  companyId: string,
  input: {
    companyName: string;
    insightInputs: OnboardingInsightInputs;
    estimatedSnapshot: EstimatedSnapshot;
    onboardingStepCompleted?: number;
    onboardingSeedWorkersCompleted?: boolean;
    onboardingSeedJobsCompleted?: boolean;
  },
  supabase?: SupabaseClient
): Promise<CompanyOnboardingProfile | null> {
  const db = supabase ?? createClient();
  const now = new Date().toISOString();
  const ii = input.insightInputs;
  const row: Record<string, unknown> = {
    company_id: companyId,
    company_name: input.companyName,
    trade_type: ii.tradeType,
    field_tech_count: ii.fieldTechCount,
    office_staff_count: ii.officeStaffCount ?? null,
    jobs_per_week: ii.jobsPerWeek,
    avg_job_duration_band: ii.avgJobDurationBand,
    overrun_frequency: ii.overrunFrequency,
    overtime_frequency: ii.overtimeFrequency ?? null,
    estimated_snapshot_json: input.estimatedSnapshot as unknown as Record<string, unknown>,
    onboarding_step_completed: input.onboardingStepCompleted ?? 4,
    onboarding_seed_workers_completed: input.onboardingSeedWorkersCompleted ?? false,
    onboarding_seed_jobs_completed: input.onboardingSeedJobsCompleted ?? false,
    updated_at: now,
  };

  const tryUpsert = async (r: Record<string, unknown>) => {
    return await db
      .from("company_onboarding_profile")
      .upsert(r, { onConflict: "company_id" })
      .select()
      .single();
  };

  // Backwards-compat: older DBs may not have the progress columns yet (added later).
  // If so, retry without those columns so onboarding can proceed.
  const first = await tryUpsert(row);
  if (first.error) {
    const msg = String((first.error as { message?: string }).message ?? "");
    const missingProgressCols =
      msg.includes("onboarding_step_completed") ||
      msg.includes("onboarding_seed_workers_completed") ||
      msg.includes("onboarding_seed_jobs_completed") ||
      msg.includes("column") && msg.includes("does not exist");

    if (missingProgressCols) {
      const { onboarding_step_completed, onboarding_seed_workers_completed, onboarding_seed_jobs_completed, ...rest } = row;
      const retry = await tryUpsert(rest);
      if (retry.error || !retry.data) {
        console.error("[upsertOnboardingProfile] retry failed:", retry.error);
        throw new Error((retry.error as { message?: string }).message ?? "Failed to save onboarding profile");
      }
      return toOnboardingProfile(retry.data as Record<string, unknown>);
    }

    console.error("[upsertOnboardingProfile] failed:", first.error);
    throw new Error((first.error as { message?: string }).message ?? "Failed to save onboarding profile");
  }

  if (!first.data) return null;
  return toOnboardingProfile(first.data as Record<string, unknown>);
}

export async function markOnboardingProfileDashboardEntered(
  companyId: string,
  supabase?: SupabaseClient
): Promise<void> {
  const db = supabase ?? createClient();
  await db
    .from("company_onboarding_profile")
    .update({ onboarding_completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("company_id", companyId);
}

export async function updateOnboardingProfileProgress(
  companyId: string,
  input: {
    onboardingStepCompleted?: number;
    onboardingSeedWorkersCompleted?: boolean;
    onboardingSeedJobsCompleted?: boolean;
  },
  supabase?: SupabaseClient
): Promise<void> {
  const db = supabase ?? createClient();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.onboardingStepCompleted !== undefined) {
    updates.onboarding_step_completed = input.onboardingStepCompleted;
  }
  if (input.onboardingSeedWorkersCompleted !== undefined) {
    updates.onboarding_seed_workers_completed = input.onboardingSeedWorkersCompleted;
  }
  if (input.onboardingSeedJobsCompleted !== undefined) {
    updates.onboarding_seed_jobs_completed = input.onboardingSeedJobsCompleted;
  }
  await db.from("company_onboarding_profile").update(updates).eq("company_id", companyId);
}

/** Distinct jobs that have at least one time entry for this company. */
export async function countJobsWithLabourEntries(companyId: string, supabase?: SupabaseClient): Promise<number> {
  const db = supabase ?? createClient();
  const { data: jobs, error: jErr } = await db.from("jobs").select("id").eq("company_id", companyId);
  if (jErr || !jobs?.length) return 0;
  const ids = jobs.map((j) => (j as { id: string }).id);
  const { data: entries, error: eErr } = await db.from("time_entries").select("job_id").in("job_id", ids);
  if (eErr || !entries?.length) return 0;
  return new Set(entries.map((e) => (e as { job_id: string }).job_id)).size;
}

// ─── OwnerUsers ─────────────────────────────────────────────────────────────

export async function getOwnerUsers(supabase?: SupabaseClient): Promise<OwnerUser[]> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("owner_users").select("*");
  if (error) throw error;
  return (data ?? []).map(toOwnerUser);
}

export async function getOwnerUserById(
  id: string,
  supabase?: SupabaseClient
): Promise<OwnerUser | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("owner_users").select("*").eq("id", id).single();
  if (error || !data) return null;
  return toOwnerUser(data);
}

export async function addOwnerUser(input: OwnerUserInput, supabase?: SupabaseClient): Promise<OwnerUser> {
  const db = supabase ?? createClient();
  const user: OwnerUser = { ...input, id: uid() };
  const { error } = await db.from("owner_users").insert({
    id: user.id,
    email: user.email,
    name: user.name,
    company_id: user.companyId,
  });
  if (error) throw error;
  return user;
}

/** Insert an owner user with a specific id (e.g. auth user id). Used when linking Supabase Auth to owner_users. */
export async function addOwnerUserWithId(
  id: string,
  input: OwnerUserInput,
  supabase?: SupabaseClient
): Promise<OwnerUser> {
  const db = supabase ?? createClient();
  const user: OwnerUser = { ...input, id };
  const { error } = await db.from("owner_users").insert({
    id: user.id,
    email: user.email,
    name: user.name,
    company_id: user.companyId,
  });
  if (error) throw error;
  return user;
}

/** Auth user shape we need (from Supabase Auth). */
type AuthUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> & { full_name?: string; name?: string };
};

/**
 * Ensures an auth user has a company and an owner_users row (for new signups).
 * Pass the user from the session (e.g. session.user after exchangeCodeForSession) when in the
 * auth callback, since cookies may not be available in the same request.
 */
export async function ensureOwnerUserForAuthUser(
  supabase: SupabaseClient,
  authUserOrNull?: AuthUserLike | null
): Promise<OwnerUser | null> {
  let authUser: AuthUserLike | null = authUserOrNull ?? null;
  if (!authUser) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return null;
    authUser = user;
  }

  const existing = await getOwnerUserById(authUser.id, supabase);
  if (existing) return existing;

  const company = await addCompany(
    { name: "My Company", address: undefined, ownerUserId: authUser.id },
    supabase
  );
  const name =
    authUser.user_metadata?.full_name ??
    authUser.user_metadata?.name ??
    authUser.email?.split("@")[0] ??
    "Owner";
  const ownerUser = await addOwnerUserWithId(
    authUser.id,
    {
      email: authUser.email ?? "",
      name: String(name),
      companyId: company.id,
    },
    supabase
  );
  return ownerUser;
}

export async function updateOwnerUser(id: string, input: Partial<OwnerUserInput>, supabase?: SupabaseClient): Promise<OwnerUser | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("owner_users")
    .update({
      ...(input.email != null && { email: input.email }),
      ...(input.name != null && { name: input.name }),
      ...(input.companyId != null && { company_id: input.companyId }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return toOwnerUser(data);
}

// ─── Workers ────────────────────────────────────────────────────────────────

export async function getWorkers(companyId?: string, supabase?: SupabaseClient): Promise<Worker[]> {
  const db = supabase ?? createClient();
  let q = db.from("workers").select("*");
  if (companyId) q = q.eq("company_id", companyId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toWorker);
}

export async function getWorker(id: string, supabase?: SupabaseClient): Promise<Worker | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("workers").select("*").eq("id", id).single();
  if (error || !data) return null;
  return toWorker(data);
}

/** Worker row for the given invite token (for worker app with anon key; uses RPC). */
export async function getWorkerByInviteToken(token: string, supabase?: SupabaseClient): Promise<Worker | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db.rpc("get_worker_by_invite_token", { p_token: token });
  if (error || !data?.length) return null;
  return toWorker(data[0] as Record<string, unknown>);
}

/** Thrown when the company has reached its worker limit (subscription). */
export class WorkerLimitError extends Error {
  code = "WORKER_LIMIT_REACHED" as const;
  constructor(public limit: number) {
    super(`Worker limit reached (${limit}). Upgrade your plan to add more workers.`);
    this.name = "WorkerLimitError";
  }
}

export async function addWorker(input: WorkerInput, supabase?: SupabaseClient): Promise<Worker> {
  const db = supabase ?? createClient();
  const company = await getCompany(input.companyId, db);
  const limit = company?.workerLimit ?? 5;
  const subStatus = company?.subscriptionStatus ?? null;
  const hasActiveSub = subStatus === "active" || subStatus === "trialing";
  const isOnboardingCreate = Boolean((input as { createdViaOnboarding?: boolean }).createdViaOnboarding);

  // During onboarding (before plan selection), let owners add workers without hitting the
  // subscription worker limit. Limits apply once a subscription is active/trialing.
  if (!isOnboardingCreate || hasActiveSub) {
    const existing = await getWorkers(input.companyId, db);
    if (existing.length >= limit) {
      throw new WorkerLimitError(limit);
    }
  }
  const worker: Worker = { ...input, id: uid() };
  const { error } = await db.from("workers").insert({
    id: worker.id,
    name: worker.name,
    phone: worker.phone,
    hourly_rate: worker.hourlyRate,
    company_id: worker.companyId,
    role: (input as { role?: string }).role ?? "tech",
    overtime_rate: (input as { overtimeRate?: number }).overtimeRate ?? null,
    invite_status: (input as { inviteStatus?: string }).inviteStatus ?? "not_sent",
    created_via_onboarding: (input as { createdViaOnboarding?: boolean }).createdViaOnboarding ?? false,
  });
  if (error) throw error;
  return worker;
}

export async function updateWorker(id: string, input: Partial<WorkerInput>, supabase?: SupabaseClient): Promise<Worker | null> {
  const db = supabase ?? createClient();
  const updates: Record<string, unknown> = {};
  if (input.name != null) updates.name = input.name;
  if (input.phone != null) updates.phone = input.phone;
  if (input.hourlyRate != null) updates.hourly_rate = input.hourlyRate;
  if (input.companyId != null) updates.company_id = input.companyId;
  if ((input as { role?: string }).role !== undefined) updates.role = (input as { role?: string }).role;
  if ((input as { overtimeRate?: number }).overtimeRate !== undefined) updates.overtime_rate = (input as { overtimeRate?: number }).overtimeRate;
  if ((input as { inviteStatus?: string }).inviteStatus !== undefined) updates.invite_status = (input as { inviteStatus?: string }).inviteStatus;
  if ((input as { createdViaOnboarding?: boolean }).createdViaOnboarding !== undefined) {
    updates.created_via_onboarding = (input as { createdViaOnboarding?: boolean }).createdViaOnboarding;
  }
  const { data, error } = await db.from("workers").update(updates).eq("id", id).select().single();
  if (error || !data) return null;
  return toWorker(data);
}

export async function deleteWorker(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("workers").delete().eq("id", id);
  return !error;
}

// ─── WorkerInvites ────────────────────────────────────────────────────────

function toWorkerInvite(r: Record<string, unknown>): WorkerInvite {
  return {
    id: r.id as string,
    workerId: r.worker_id as string,
    companyId: r.company_id as string,
    token: r.token as string,
    sentAt: r.sent_at != null ? (typeof r.sent_at === "string" ? r.sent_at : (r.sent_at as Date).toISOString()) : null,
    acceptedAt: r.accepted_at != null ? (typeof r.accepted_at === "string" ? r.accepted_at : (r.accepted_at as Date).toISOString()) : null,
    expiresAt: typeof r.expires_at === "string" ? r.expires_at : (r.expires_at as Date).toISOString(),
    channel: (r.channel as string) ?? "sms",
  };
}

export async function getWorkerInvitesByCompany(companyId: string, supabase?: SupabaseClient): Promise<WorkerInvite[]> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("worker_invites").select("*").eq("company_id", companyId);
  if (error) throw error;
  return (data ?? []).map(toWorkerInvite);
}

export async function getWorkerInviteByToken(token: string, supabase?: SupabaseClient): Promise<WorkerInvite | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db.rpc("get_worker_invite_by_token", { p_token: token });
  if (error || !data?.length) return null;
  return toWorkerInvite(data[0] as Record<string, unknown>);
}

export async function addWorkerInvite(input: WorkerInviteInput, supabase?: SupabaseClient): Promise<WorkerInvite> {
  const db = supabase ?? createClient();
  const inv: WorkerInvite = { ...input, id: uid() };
  const { error } = await db.from("worker_invites").insert({
    id: inv.id,
    worker_id: inv.workerId,
    company_id: inv.companyId,
    token: inv.token,
    sent_at: inv.sentAt ?? null,
    accepted_at: inv.acceptedAt ?? null,
    expires_at: inv.expiresAt,
    channel: inv.channel ?? "sms",
  });
  if (error) throw error;
  return inv;
}

export async function updateWorkerInvite(id: string, input: Partial<WorkerInviteInput>, supabase?: SupabaseClient): Promise<WorkerInvite | null> {
  const db = supabase ?? createClient();
  const updates: Record<string, unknown> = {};
  if (input.sentAt !== undefined) updates.sent_at = input.sentAt;
  if (input.acceptedAt !== undefined) updates.accepted_at = input.acceptedAt;
  const { data, error } = await db.from("worker_invites").update(updates).eq("id", id).select().single();
  if (error || !data) return null;
  return toWorkerInvite(data);
}

// ─── Helpers for onboarding / auth ────────────────────────────────────────

/** Get the company for the current auth user (via owner_users). Returns null if not found. */
export async function getCompanyForCurrentUser(supabase?: SupabaseClient): Promise<Company | null> {
  const db = supabase ?? createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const owner = await getOwnerUserById(user.id, db);
  if (!owner) return null;
  return getCompany(owner.companyId, db);
}

/** Subscription status for middleware/gating. active and trialing count as having an active subscription. */
export async function getSubscriptionStatusForUser(
  userId: string,
  supabase: SupabaseClient
): Promise<{ hasActiveSubscription: boolean; companyId: string | null; workerLimit: number }> {
  const { data: ownerRow } = await supabase
    .from("owner_users")
    .select("company_id")
    .eq("id", userId)
    .single();
  const companyId = ownerRow?.company_id ?? null;
  if (!companyId) {
    return { hasActiveSubscription: false, companyId: null, workerLimit: 5 };
  }
  const { data: companyRow } = await supabase
    .from("companies")
    .select("subscription_status, worker_limit")
    .eq("id", companyId)
    .single();
  const status = companyRow?.subscription_status ?? null;
  const workerLimit = companyRow?.worker_limit != null ? Number(companyRow.worker_limit) : 5;
  const hasActiveSubscription =
    status === "active" || status === "trialing";
  return { hasActiveSubscription, companyId, workerLimit };
}

// ─── Projects ───────────────────────────────────────────────────────────────

export async function getProjects(companyId?: string, supabase?: SupabaseClient): Promise<Project[]> {
  const db = supabase ?? createClient();
  let q = db.from("projects").select("*");
  if (companyId) q = q.eq("company_id", companyId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toProject);
}

export async function addProject(input: ProjectInput, supabase?: SupabaseClient): Promise<Project> {
  const db = supabase ?? createClient();
  const project: Project = { ...input, id: uid() };
  const { error } = await db.from("projects").insert({
    id: project.id,
    name: project.name,
    color: project.color,
    company_id: project.companyId,
  });
  if (error) throw error;
  return project;
}

export async function updateProject(id: string, input: Partial<ProjectInput>, supabase?: SupabaseClient): Promise<Project | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("projects")
    .update({
      ...(input.name != null && { name: input.name }),
      ...(input.color != null && { color: input.color }),
      ...(input.companyId != null && { company_id: input.companyId }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return toProject(data);
}

export async function deleteProject(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("projects").delete().eq("id", id);
  return !error;
}

// ─── JobTypes ───────────────────────────────────────────────────────────────

export async function getJobTypes(companyId?: string, supabase?: SupabaseClient): Promise<JobType[]> {
  const db = supabase ?? createClient();
  let q = db.from("job_types").select("*");
  if (companyId) q = q.eq("company_id", companyId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toJobType);
}

export async function addJobType(input: JobTypeInput, supabase?: SupabaseClient): Promise<JobType> {
  const db = supabase ?? createClient();
  const jobType: JobType = { ...input, id: uid() };
  const { error } = await db.from("job_types").insert({
    id: jobType.id,
    name: jobType.name,
    company_id: jobType.companyId,
  });
  if (error) throw error;
  return jobType;
}

export async function updateJobType(id: string, input: Partial<JobTypeInput>, supabase?: SupabaseClient): Promise<JobType | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db
    .from("job_types")
    .update({
      ...(input.name != null && { name: input.name }),
      ...(input.companyId != null && { company_id: input.companyId }),
    })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return toJobType(data);
}

export async function deleteJobType(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("job_types").delete().eq("id", id);
  return !error;
}

// ─── Jobs ───────────────────────────────────────────────────────────────────

export async function getJobs(companyId?: string, projectId?: string, supabase?: SupabaseClient): Promise<Job[]> {
  const db = supabase ?? createClient();
  let q = db.from("jobs").select("*");
  if (companyId) q = q.eq("company_id", companyId);
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toJob);
}

export async function getJobsForWorker(workerId: string, supabase?: SupabaseClient): Promise<Job[]> {
  const jobs = await getJobs(undefined, undefined, supabase);
  return jobs.filter((j) => j.workerIds?.includes(workerId));
}

/** Jobs assigned to the worker identified by invite token (for worker app; uses RPC so anon can read). */
export async function getJobsForWorkerByToken(token: string, supabase?: SupabaseClient): Promise<Job[]> {
  const db = supabase ?? createClient();
  const { data, error } = await db.rpc("get_jobs_for_worker_by_token", { p_token: token });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => toJob(r));
}

export async function getJob(id: string, supabase?: SupabaseClient): Promise<Job | null> {
  const db = supabase ?? createClient();
  const { data, error } = await db.from("jobs").select("*").eq("id", id).single();
  if (error || !data) return null;
  return toJob(data);
}

function jobToRow(input: JobInput & { id?: string }) {
  return {
    id: input.id ?? uid(),
    name: input.name,
    address: input.address,
    company_id: input.companyId,
    project_id: input.projectId ?? null,
    type_id: input.typeId ?? null,
    customer_name: input.customerName ?? null,
    revenue: input.revenue ?? null,
    date: input.date ?? null,
    time: input.time ?? null,
    start_date: input.startDate ?? null,
    end_date: input.endDate ?? null,
    hours_per_day: input.hoursPerDay ?? null,
    hours_expected: input.hoursExpected ?? null,
    is_adhoc: input.isAdhoc ?? false,
    worker_ids: input.workerIds ?? [],
    status: input.status ?? "scheduled",
    instructions: input.instructions ?? null,
    created_via_onboarding: input.createdViaOnboarding ?? false,
  };
}

export async function addJob(input: JobInput, supabase?: SupabaseClient): Promise<Job> {
  const db = supabase ?? createClient();
  const job: Job = { ...input, id: uid() };
  const row = jobToRow({ ...job });
  row.id = job.id;
  const { error } = await db.from("jobs").insert(row);
  if (error) throw error;
  return job;
}

export async function updateJob(id: string, input: Partial<JobInput>, supabase?: SupabaseClient): Promise<Job | null> {
  const db = supabase ?? createClient();
  const updates: Record<string, unknown> = {};
  if (input.name != null) updates.name = input.name;
  if (input.address != null) updates.address = input.address;
  if (input.companyId != null) updates.company_id = input.companyId;
  if (input.projectId != null) updates.project_id = input.projectId;
  if (input.typeId != null) updates.type_id = input.typeId;
  if (input.customerName != null) updates.customer_name = input.customerName;
  if (input.revenue != null) updates.revenue = input.revenue;
  if (input.date != null) updates.date = input.date;
  if (input.time != null) updates.time = input.time;
  if (input.startDate != null) updates.start_date = input.startDate;
  if (input.endDate != null) updates.end_date = input.endDate;
  if (input.hoursPerDay != null) updates.hours_per_day = input.hoursPerDay;
  if (input.hoursExpected != null) updates.hours_expected = input.hoursExpected;
  if (input.isAdhoc != null) updates.is_adhoc = input.isAdhoc;
  if (input.workerIds != null) updates.worker_ids = input.workerIds;
  if (input.status != null) updates.status = input.status;
  if (input.instructions !== undefined) updates.instructions = input.instructions;
  if ((input as { createdViaOnboarding?: boolean }).createdViaOnboarding !== undefined) {
    updates.created_via_onboarding = (input as { createdViaOnboarding?: boolean }).createdViaOnboarding;
  }
  const { data, error } = await db.from("jobs").update(updates).eq("id", id).select().single();
  if (error || !data) return null;
  return toJob(data);
}

export async function deleteJob(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("jobs").delete().eq("id", id);
  return !error;
}

// ─── TimeEntries ────────────────────────────────────────────────────────────

export async function getTimeEntries(workerId?: string, jobId?: string, supabase?: SupabaseClient): Promise<TimeEntry[]> {
  const db = supabase ?? createClient();
  let q = db.from("time_entries").select("*");
  if (workerId) q = q.eq("worker_id", workerId);
  if (jobId) q = q.eq("job_id", jobId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toTimeEntry);
}

/** Time entries for the worker identified by invite token (worker app with anon key; uses RPC). */
export async function getTimeEntriesForWorkerByToken(token: string, supabase?: SupabaseClient): Promise<TimeEntry[]> {
  const db = supabase ?? createClient();
  const { data, error } = await db.rpc("get_time_entries_for_worker_by_token", { p_token: token });
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => toTimeEntry(r));
}

export async function addTimeEntry(input: TimeEntryInput, supabase?: SupabaseClient): Promise<TimeEntry> {
  const db = supabase ?? createClient();
  const entry: TimeEntry = { ...input, id: uid() };
  const { error } = await db.from("time_entries").insert({
    id: entry.id,
    worker_id: entry.workerId,
    job_id: entry.jobId,
    start: entry.start,
    end: entry.end,
    breaks: entry.breaks ?? 0,
    category: entry.category ?? "billable",
    is_overtime: entry.isOvertime ?? false,
    notes: entry.notes ?? null,
  });
  if (error) throw error;
  return entry;
}

/** Add a time entry as a worker using invite token (uses RPC; bypasses RLS). */
export async function addTimeEntryForWorkerByToken(
  token: string,
  input: Omit<TimeEntryInput, "workerId">,
  supabase?: SupabaseClient
): Promise<TimeEntry> {
  const db = supabase ?? createClient();
  const { data, error } = await db.rpc("add_time_entry_for_worker_by_token", {
    p_token: token,
    p_job_id: input.jobId,
    p_start: input.start,
    p_end: input.end,
    p_breaks: input.breaks ?? 0,
    p_notes: input.notes ?? null,
    p_is_overtime: input.isOvertime ?? false,
    p_category: input.category ?? "billable",
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) throw new Error("No time entry returned");
  return toTimeEntry(row as Record<string, unknown>);
}

export async function updateTimeEntry(id: string, input: Partial<TimeEntryInput>, supabase?: SupabaseClient): Promise<TimeEntry | null> {
  const db = supabase ?? createClient();
  const updates: Record<string, unknown> = {};
  if (input.workerId != null) updates.worker_id = input.workerId;
  if (input.jobId != null) updates.job_id = input.jobId;
  if (input.start != null) updates.start = input.start;
  if (input.end != null) updates.end = input.end;
  if (input.breaks != null) updates.breaks = input.breaks;
  if (input.category != null) updates.category = input.category;
  if (input.isOvertime != null) updates.is_overtime = input.isOvertime;
  if (input.notes != null) updates.notes = input.notes;
  const { data, error } = await db.from("time_entries").update(updates).eq("id", id).select().single();
  if (error || !data) return null;
  return toTimeEntry(data);
}

export async function deleteTimeEntry(id: string, supabase?: SupabaseClient): Promise<boolean> {
  const db = supabase ?? createClient();
  const { error } = await db.from("time_entries").delete().eq("id", id);
  return !error;
}

// ─── Job reminder sends (dedupe for cron) ───────────────────────────────────

/** Returns true if a reminder was already sent for this job+worker. */
export async function jobReminderAlreadySent(
  jobId: string,
  workerId: string,
  supabase: SupabaseClient
): Promise<boolean> {
  const { data, error } = await supabase
    .from("job_reminder_sends")
    .select("id")
    .eq("job_id", jobId)
    .eq("worker_id", workerId)
    .limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

/** Records that a reminder was sent for this job+worker. */
export async function insertJobReminderSent(
  jobId: string,
  workerId: string,
  supabase: SupabaseClient
): Promise<void> {
  const { error } = await supabase.from("job_reminder_sends").insert({
    id: uid(),
    job_id: jobId,
    worker_id: workerId,
    sent_at: new Date().toISOString(),
  });
  if (error) throw error;
}
