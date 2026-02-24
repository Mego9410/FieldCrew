import Link from "next/link";
import {
  ChevronLeft,
  ClipboardList,
  MapPin,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { routes } from "@/lib/routes";
import { getJob, getJobsForWorker } from "@/lib/data";
import { WorkerJobActions } from "../WorkerJobActions";
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

const statusStyles: Record<string, { bg: string; text: string }> = {
  scheduled: { bg: "bg-fc-neutral-bg", text: "text-fc-neutral" },
  in_progress: { bg: "bg-fc-warning-bg", text: "text-fc-warning" },
  completed: { bg: "bg-fc-success-bg", text: "text-fc-success" },
  overdue: { bg: "bg-fc-danger-bg", text: "text-fc-danger" },
};

export default async function WorkerJobDetailPage({
  params,
}: {
  params: Promise<{ token: string; jobId: string }>;
}) {
  const { token, jobId } = await params;
  const [job, myJobs] = await Promise.all([getJob(jobId), getJobsForWorker(token)]);
  const isAssigned = myJobs.some((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href={routes.worker.jobs(token)}
          className="inline-flex items-center gap-1 text-sm font-medium text-fc-accent hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to jobs
        </Link>
        <div className="mt-8 border border-fc-border bg-fc-surface p-12 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-fc-muted" />
          <h2 className="mt-4 text-lg font-semibold text-fc-brand">Job not found</h2>
          <p className="mt-2 text-sm text-fc-muted">
            This job may have been removed or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  if (!isAssigned) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href={routes.worker.jobs(token)}
          className="inline-flex items-center gap-1 text-sm font-medium text-fc-accent hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to jobs
        </Link>
        <div className="mt-8 border border-fc-border bg-fc-surface p-12 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-fc-muted" />
          <h2 className="mt-4 text-lg font-semibold text-fc-brand">Not assigned to this job</h2>
          <p className="mt-2 text-sm text-fc-muted">
            You don&apos;t have access to this job.
          </p>
        </div>
      </div>
    );
  }

  const status = job.status ?? "scheduled";
  const statusStyle = statusStyles[status] ?? statusStyles.scheduled;
  const estimatedHours = getEstimatedHours(job);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href={routes.worker.jobs(token)}
        className="inline-flex items-center gap-1 text-sm font-medium text-fc-accent hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="mt-6 border border-fc-border bg-fc-surface overflow-hidden">
        <div className="border-b border-fc-border bg-fc-surface-muted px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div>
                <h1 className="font-display text-xl font-bold text-fc-brand">{job.name}</h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-fc-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.address}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold capitalize ${statusStyle.bg} ${statusStyle.text}`}
            >
              {status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-fc-muted">Details</h2>
            <dl className="space-y-3 text-sm">
              {job.customerName && (
                <div>
                  <dt className="flex items-center gap-1.5 text-fc-muted">
                    <User className="h-3.5 w-3.5" /> Customer
                  </dt>
                  <dd className="font-medium text-fc-brand">{job.customerName}</dd>
                </div>
              )}
              <div>
                <dt className="flex items-center gap-1.5 text-fc-muted">
                  <Calendar className="h-3.5 w-3.5" /> Due
                </dt>
                <dd className="font-medium text-fc-brand">{formatDueDate(job)}</dd>
              </div>
              {estimatedHours > 0 && (
                <div>
                  <dt className="flex items-center gap-1.5 text-fc-muted">
                    <Clock className="h-3.5 w-3.5" /> Estimated hours
                  </dt>
                  <dd className="font-medium text-fc-brand">
                    {estimatedHours} {estimatedHours === 1 ? "hour" : "hours"}
                  </dd>
                </div>
              )}
              {job.instructions?.trim() && (
                <div>
                  <dt className="flex items-center gap-1.5 text-fc-muted">
                    <ClipboardList className="h-3.5 w-3.5" /> Instructions
                  </dt>
                  <dd className="font-medium text-fc-brand whitespace-pre-wrap mt-1">{job.instructions}</dd>
                </div>
              )}
            </dl>
          </section>

          <div className="border-t border-fc-border pt-6">
            <WorkerJobActions job={job} token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
