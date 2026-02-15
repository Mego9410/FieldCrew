"use client";

import { use } from "react";
import Link from "next/link";
import { ClipboardList, Clock, DollarSign, Calendar, CheckCircle2 } from "lucide-react";
import { routes } from "@/lib/routes";
import { useJobsForWorker, useTimeEntries, useJobs, useWorker } from "@/lib/hooks/useData";
import type { Job } from "@/lib/entities";

function formatDueDate(job: Job): string {
  if (job.date) {
    const d = new Date(job.date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (job.startDate) {
    const d = new Date(job.startDate);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return "—";
}

function getEstimatedHours(job: Job): number {
  if (job.hoursExpected != null) return job.hoursExpected;
  if (job.hoursPerDay != null) return job.hoursPerDay;
  return 0;
}

function hoursBetween(start: string, end: string, breakMins: number): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const mins = (e - s) / (1000 * 60) - breakMins;
  return Math.max(0, mins) / 60;
}

function relativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMins < 60) return diffMins <= 1 ? "Just now" : `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function WorkerDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const workerId = token;

  const { items: jobs } = useJobsForWorker(workerId);
  const { items: entries } = useTimeEntries(workerId);
  const { item: worker } = useWorker(workerId);
  const { items: allJobs } = useJobs();

  const activeJobs = jobs.filter((j) => (j.status ?? "scheduled") === "in_progress").length;
  const completedJobs = jobs.filter((j) => (j.status ?? "scheduled") === "completed").length;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEntries = entries.filter((e) => new Date(e.end).getTime() >= weekStart.getTime());
  const hoursThisWeek = weekEntries.reduce(
    (sum, e) => sum + hoursBetween(e.start, e.end, e.breaks ?? 0),
    0
  );
  const earningsThisWeek =
    worker != null ? Math.round(hoursThisWeek * worker.hourlyRate) : 0;
  const completedThisWeek = weekEntries.length;
  const avgHoursPerDay = now.getDay() === 0 ? 0 : (hoursThisWeek / now.getDay()).toFixed(1);
  const completionRate =
    jobs.length > 0 ? `${Math.round((completedJobs / jobs.length) * 100)}%` : "—";

  const upcomingJobs = jobs.slice(0, 4).map((job) => ({
    id: job.id,
    name: job.name,
    dueDate: formatDueDate(job),
    status: job.status ?? "scheduled",
    location: job.address,
    hours: getEstimatedHours(job),
  }));

  const recentActivity = [...entries]
    .sort((a, b) => new Date(b.end).getTime() - new Date(a.end).getTime())
    .slice(0, 5)
    .map((e) => {
      const job = allJobs.find((j) => j.id === e.jobId);
      const hrs = hoursBetween(e.start, e.end, e.breaks ?? 0);
      const amount = worker ? Math.round(hrs * worker.hourlyRate) : 0;
      return {
        id: e.id,
        job: job?.name ?? "Unknown job",
        action: "Completed",
        time: relativeTime(e.end),
        amount: `$${amount}`,
        hours: hrs,
      };
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-fc-brand">Dashboard</h1>
        <p className="mt-1 text-sm text-fc-muted">
          Your jobs, hours, and earnings at a glance.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-fc-border bg-fc-surface p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">Active jobs</p>
          <p className="mt-1 text-2xl font-bold text-fc-brand">{activeJobs}</p>
        </div>
        <div className="border border-fc-border bg-fc-surface p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">Completed this week</p>
          <p className="mt-1 text-2xl font-bold text-fc-brand">{completedThisWeek}</p>
        </div>
        <div className="border border-fc-border bg-fc-surface p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">Hours this week</p>
          <p className="mt-1 text-2xl font-bold text-fc-brand">{hoursThisWeek.toFixed(1)}</p>
          <p className="text-xs text-fc-muted mt-0.5">{avgHoursPerDay} hrs/day avg</p>
        </div>
        <div className="border border-fc-border bg-fc-surface p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">Earnings this week</p>
          <p className="mt-1 text-2xl font-bold text-fc-brand">${earningsThisWeek}</p>
        </div>
        <div className="border border-fc-border bg-fc-surface p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">Completion rate</p>
          <p className="mt-1 text-2xl font-bold text-fc-brand">{completionRate}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href={routes.worker.clock(token)}
          className="inline-flex items-center justify-center gap-2 bg-fc-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-fc-accent-dark"
        >
          <Clock className="h-4 w-4" />
          Clock in / out
        </Link>
        <Link
          href={routes.worker.jobs(token)}
          className="inline-flex items-center justify-center gap-2 border border-fc-border bg-fc-surface px-4 py-2.5 text-sm font-semibold text-fc-brand transition-colors hover:bg-fc-surface-muted"
        >
          <ClipboardList className="h-4 w-4" />
          View all jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-fc-border bg-fc-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-fc-muted">Upcoming jobs</h2>
            <Link
              href={routes.worker.jobs(token)}
              className="text-xs font-medium text-fc-accent hover:underline"
            >
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingJobs.length === 0 ? (
              <p className="text-sm text-fc-muted">No upcoming jobs assigned.</p>
            ) : (
              upcomingJobs.map((job) => (
                <Link
                  key={job.id}
                  href={routes.worker.job(token, job.id)}
                  className="flex items-start justify-between gap-3 border border-fc-border p-3 transition-colors hover:bg-fc-surface-muted hover:border-fc-accent"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-fc-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-fc-brand truncate hover:underline">{job.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-fc-muted">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{job.dueDate}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>
                          {job.hours} {job.hours === 1 ? "hr" : "hrs"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-xs font-semibold ${
                      job.status === "in_progress"
                        ? "bg-fc-warning-bg text-fc-warning"
                        : "bg-fc-neutral-bg text-fc-neutral"
                    }`}
                  >
                    {job.status === "in_progress" ? "In progress" : "Scheduled"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="border border-fc-border bg-fc-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-fc-muted">Recent activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-fc-muted">No recent sessions.</p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between gap-3 border border-fc-border p-3"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fc-success" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-fc-brand truncate">{activity.job}</p>
                      <p className="mt-1 text-xs text-fc-muted">
                        {activity.action} • {activity.time} • {activity.hours}{" "}
                        {activity.hours === 1 ? "hr" : "hrs"}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-medium text-fc-brand">{activity.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
