import Link from "next/link";
import {
  Search,
  Calendar,
  MapPin,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { getJobsForWorker } from "@/lib/data";
import { WorkerJobActions } from "./WorkerJobActions";
import { routes } from "@/lib/routes";
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
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return "—";
}

function getEstimatedHours(job: Job): number {
  if (job.hoursExpected != null) return job.hoursExpected;
  if (job.hoursPerDay != null) return job.hoursPerDay;
  return 0;
}

const statusStyles: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  scheduled: {
    bg: "bg-fc-neutral-bg",
    text: "text-fc-neutral",
    icon: Clock,
  },
  in_progress: {
    bg: "bg-fc-warning-bg",
    text: "text-fc-warning",
    icon: Clock,
  },
  completed: {
    bg: "bg-fc-success-bg",
    text: "text-fc-success",
    icon: CheckCircle2,
  },
  overdue: {
    bg: "bg-fc-danger-bg",
    text: "text-fc-danger",
    icon: AlertCircle,
  },
};

export default async function WorkerJobsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const jobs = await getJobsForWorker(token ?? "");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-fc-brand">My jobs</h1>
        <p className="mt-1 text-sm text-fc-muted">
          View and manage your assigned jobs. Start a job and clock in to log time with breaks and notes.
        </p>
      </div>

      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search jobs…"
            className="w-full border border-fc-border bg-fc-surface py-2 pl-9 pr-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => {
          const status = job.status ?? "scheduled";
          const statusStyle = statusStyles[status] ?? statusStyles.scheduled;
          const StatusIcon = statusStyle.icon;
          const estimatedHours = getEstimatedHours(job);
          return (
            <div
              key={job.id}
              className="border border-fc-border bg-fc-surface p-5 transition-colors hover:border-fc-accent"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 gap-4">
                  <ClipboardList className="h-5 w-5 shrink-0 text-fc-muted" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={routes.worker.job(token, job.id)}
                        className="font-semibold text-fc-brand hover:text-fc-accent hover:underline"
                      >
                        {job.name}
                      </Link>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.replace("_", " ")}
                      </span>
                    </div>
                    {(job.customerName || job.address) && (
                      <p className="mt-1 text-sm text-fc-muted">
                        {job.customerName ? `${job.customerName} · ` : ""}
                        {job.address}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-fc-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDueDate(job)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.address}
                      </span>
                      {estimatedHours > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {estimatedHours} {estimatedHours === 1 ? "hour" : "hours"} estimated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                  <WorkerJobActions job={job} token={token} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {jobs.length === 0 && (
        <div className="border border-fc-border bg-fc-surface p-12 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-fc-muted" />
          <h3 className="mt-4 text-sm font-semibold text-fc-brand">No jobs assigned</h3>
          <p className="mt-2 text-sm text-fc-muted">
            You don&apos;t have any jobs assigned yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
