import Link from "next/link";
import type { CompanyOnboardingProfile } from "@/types/onboarding";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export interface EstimatedFirstInsightDashboardProps {
  profile: CompanyOnboardingProfile;
  companyName: string;
  workerCount: number;
  jobCount: number;
}

export function EstimatedFirstInsightDashboard({
  profile,
  companyName,
  workerCount,
  jobCount,
}: EstimatedFirstInsightDashboardProps) {
  const snap = profile.estimatedSnapshot;
  const techs = snap.inputs.fieldTechCount;
  const jobs = snap.estimatedJobsPerWeek;

  return (
    <div className="min-h-full bg-fc-page">
      <div className="px-4 py-6 md:px-6">
        <div className="mb-8 rounded-2xl border border-fc-border bg-fc-surface p-6 shadow-fc-md md:flex md:items-start md:justify-between md:gap-8">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-semibold text-fc-brand">
              Your first labour snapshot is ready
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fc-muted">
              This view is estimated from your onboarding answers. It gives you a starting point before live
              job data comes in.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={routes.owner.jobs}
                className="inline-flex items-center justify-center rounded-xl bg-fc-accent px-4 py-2.5 text-sm font-medium text-white shadow-fc-sm transition-colors hover:bg-fc-accent-dark"
              >
                Start adding real jobs
              </Link>
              <Link
                href={routes.owner.onboardingEdit}
                className="inline-flex items-center justify-center rounded-xl border border-fc-border bg-fc-surface px-4 py-2.5 text-sm font-medium text-fc-brand shadow-fc-sm transition-colors hover:bg-fc-surface-muted"
              >
                Review estimate inputs
              </Link>
            </div>
          </div>
        </div>

        <h1 className="font-display text-xl font-semibold text-fc-brand">Dashboard</h1>
        <p className="mt-1 text-sm text-fc-muted">{companyName}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Estimated jobs this week"
            value={String(jobs)}
            sublabel="From your workload answers"
          />
          <MetricCard
            label="Estimated labour hours"
            value={`${snap.estimatedTotalLabourHours}`}
            sublabel="Includes typical overrun stretch"
          />
          <MetricCard
            label="Est. overtime / overrun pressure"
            value={`${snap.estimatedOverrunOvertimePressureHours} hrs`}
            sublabel="Combined pattern"
          />
          <MetricCard
            label="Estimated labour leakage"
            value={currency.format(snap.estimatedLeakageDollars)}
            sublabel="Loaded cost estimate"
            highlight
          />
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-fc-muted-strong">
          For a team of {techs} techs handling around {jobs} jobs a week, even small overruns can quietly
          create extra labour cost and overtime pressure — a useful baseline until real tracking kicks in.
        </p>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fc-muted">
            Where labour is likely slipping
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <FrictionCard title="Small overruns across many jobs" />
            <FrictionCard title="Overtime used to keep the schedule on track" />
            <FrictionCard title="Labour hours not yet tied directly to job profitability" />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fc-muted">
            Getting your first week live
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ProgressItem
              label="Workers added"
              done={workerCount > 0 || profile.onboardingSeedWorkersCompleted}
              detail={workerCount > 0 ? `${workerCount} in your workspace` : "No workers yet"}
            />
            <ProgressItem
              label="Jobs added"
              done={jobCount > 0 || profile.onboardingSeedJobsCompleted}
              detail={jobCount > 0 ? `${jobCount} upcoming jobs` : "No jobs yet"}
            />
            <ProgressItem
              label="Time tracking not started yet"
              done={false}
              detail="Start clocks on the first live shift"
            />
            <ProgressItem
              label="Send worker access links"
              done={false}
              detail="Invite links can be sent from Workers"
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-fc-muted">What to do next</h2>
          <ol className="mt-4 grid gap-4 md:grid-cols-3">
            <NextStep
              step={1}
              title="Add your first jobs"
              href={routes.owner.jobs}
              body="Create jobs so crew time has somewhere to land."
            />
            <NextStep
              step={2}
              title="Invite your workers"
              href={routes.owner.workers}
              body="Send invites from Workers when they’re ready to track time."
            />
            <NextStep
              step={3}
              title="Start replacing estimates with real tracked hours"
              href={routes.owner.timesheets}
              body="As hours roll in, this view gives way to live labour visibility."
            />
          </ol>
        </section>

        <section className="mt-10">
          <div className="rounded-2xl border border-fc-border bg-fc-surface-muted/80 px-6 py-5">
            <h2 className="font-display text-base font-semibold text-fc-brand">How this becomes exact</h2>
            <p className="mt-2 text-sm leading-relaxed text-fc-muted-strong">
              Once your team starts tracking real jobs, this dashboard switches from estimated patterns to
              exact labour visibility based on your own hours, jobs, and payroll-linked activity.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  sublabel: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-fc-surface px-5 py-4 shadow-fc-sm",
        highlight ? "border-fc-accent/50 ring-2 ring-fc-accent/25 shadow-fc-md" : "border-fc-border"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-fc-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums text-fc-brand">{value}</p>
      <p className="mt-1 text-xs text-fc-muted">{sublabel}</p>
    </div>
  );
}

function FrictionCard({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-fc-border bg-fc-surface px-4 py-4 text-sm font-medium text-fc-brand shadow-fc-sm">
      {title}
    </div>
  );
}

function NextStep({
  step,
  title,
  body,
  href,
}: {
  step: number;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <li className="rounded-2xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
      <span className="text-xs font-bold text-fc-accent">{step}</span>
      <h3 className="mt-2 font-display text-sm font-semibold text-fc-brand">
        <Link href={href} className="hover:text-fc-accent hover:underline">
          {title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-fc-muted">{body}</p>
    </li>
  );
}

function ProgressItem({
  label,
  detail,
  done,
}: {
  label: string;
  detail: string;
  done: boolean;
}) {
  return (
    <div className="rounded-2xl border border-fc-border bg-fc-surface p-4 shadow-fc-sm">
      <p className="text-sm font-semibold text-fc-brand">{label}</p>
      <p className="mt-1 text-sm text-fc-muted">{detail}</p>
      <p className={`mt-2 text-xs font-medium ${done ? "text-emerald-700" : "text-fc-muted"}`}>
        {done ? "Complete" : "Pending"}
      </p>
    </div>
  );
}
