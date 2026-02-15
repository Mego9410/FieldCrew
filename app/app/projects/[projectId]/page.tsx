"use client";

import { useState, useCallback, use } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ClipboardList,
  User,
  ChevronLeft,
} from "lucide-react";
import { routes } from "@/lib/routes";
import { useJobs, useWorkers, useTimeEntries, useProjects } from "@/lib/hooks/useData";
import { JobForm } from "@/components/forms";
import { Button } from "@/components/ui/Button";

function useJobsDisplay(projectId: string) {
  const { items: jobs, refetch: refetchJobs } = useJobs(undefined, projectId);
  const { items: workers } = useWorkers();
  const { items: entries } = useTimeEntries();

  return { display: jobs.map((job) => {
    const jobEntries = entries.filter((e) => e.jobId === job.id);
    const assigneeIds = job.workerIds?.length ? job.workerIds : [...new Set(jobEntries.map((e) => e.workerId))];
    const assigneeNames = assigneeIds
      .map((id) => workers.find((w) => w.id === id)?.name)
      .filter(Boolean);
    const assignee = assigneeNames.length ? assigneeNames.join(", ") : "—";

    const assignedWorkers = assigneeIds.map((id) => workers.find((w) => w.id === id)).filter(Boolean) as { hourlyRate: number }[];
    const isMultiDay = job.startDate && job.endDate && job.hoursPerDay != null;
    const hrsExpected = isMultiDay
      ? (() => {
          const start = new Date(job.startDate!).getTime();
          const end = new Date(job.endDate!).getTime();
          const days = Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)) + 1);
          return (job.hoursPerDay ?? 0) * days;
        })()
      : (job.hoursExpected ?? 0);
    const estimatedCost = assignedWorkers.length && hrsExpected > 0
      ? Math.round(hrsExpected * assignedWorkers.reduce((sum, w) => sum + w.hourlyRate, 0))
      : null;
    const estimatedDisplay = hrsExpected > 0
      ? `${hrsExpected} hrs / ${estimatedCost != null ? `$${estimatedCost}` : "—"}`
      : "—";

    const { actualHours, actualCost } = jobEntries.reduce(
      (acc, e) => {
        const w = workers.find((x) => x.id === e.workerId);
        if (!w) return acc;
        const start = new Date(e.start).getTime();
        const end = new Date(e.end).getTime();
        const hrs = (end - start) / 3600000 - ((e.breaks ?? 0) / 60);
        return {
          actualHours: acc.actualHours + hrs,
          actualCost: acc.actualCost + hrs * w.hourlyRate,
        };
      },
      { actualHours: 0, actualCost: 0 }
    );
    const actualDisplay = jobEntries.length > 0
      ? `${actualHours.toFixed(1)} hrs / $${Math.round(actualCost)}`
      : "—";

    const dueDate = job.startDate
      ? job.endDate && job.startDate !== job.endDate
        ? `${new Date(job.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(job.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : new Date(job.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : job.date
        ? new Date(job.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "—";

    return {
      ...job,
      assignee,
      estimatedDisplay,
      actualDisplay,
      dueDate,
      status: jobEntries.length ? "in_progress" : "scheduled",
    };
  }), refetchJobs };
}

const statusStyles: Record<string, string> = {
  scheduled: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  overdue: "bg-red-100 text-red-800",
};

export default function ProjectJobsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");

  const { items: projects } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  const { display: jobsDisplay, refetchJobs } = useJobsDisplay(projectId);
  const filtered = jobsDisplay.filter(
    (j) =>
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleJobSuccess = useCallback(() => {
    setShowAddModal(false);
    refetchJobs();
  }, [refetchJobs]);

  if (!project) {
    return (
      <div className="px-6 py-6">
        <p className="text-fc-muted">Project not found.</p>
        <Link href={routes.owner.projects} className="mt-2 text-sm text-fc-accent hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={routes.owner.projects}
            className="mb-2 inline-flex items-center gap-1 text-sm text-fc-muted hover:text-fc-brand"
          >
            <ChevronLeft className="h-4 w-4" />
            Projects
          </Link>
          <div className="flex items-center gap-3">
            <span className={`h-10 w-10 shrink-0 rounded-lg ${project.color}`} aria-hidden />
            <div>
              <h1 className="font-display text-xl font-bold text-fc-brand">{project.name}</h1>
              <p className="mt-1 text-sm text-fc-muted">
                Jobs in this project. Add multi-day work or ad-hoc tasks with different workers.
              </p>
            </div>
          </div>
        </div>
        <Button type="button" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Add job
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Jobs in project
        </h2>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-fc-border bg-fc-surface py-2 pl-8 pr-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          />
        </div>
        <Button type="button" variant="secondary">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="border border-fc-border bg-fc-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-fc-border bg-fc-surface-muted">
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Job</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Status</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Assignee</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Due</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Estimated</th>
                <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-fc-muted">Actual</th>
                <th className="w-10 px-2 py-2" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-fc-border last:border-0 hover:bg-fc-surface-muted"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 shrink-0 text-fc-muted" />
                      <div>
                        <span className="font-semibold text-fc-brand">{job.name}</span>
                        <p className="text-xs text-fc-muted mt-0.5">{job.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[job.status] ?? "bg-fc-neutral-bg text-fc-neutral"}`}
                    >
                      {job.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-fc-muted">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {job.assignee}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-fc-muted">{job.dueDate}</td>
                  <td className="px-3 py-2 text-fc-muted">{job.estimatedDisplay}</td>
                  <td className="px-3 py-2 font-semibold text-fc-brand">{job.actualDisplay}</td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      className="p-1.5 text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </section>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-job-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-auto border border-fc-border bg-fc-surface p-6">
            <h2 id="add-job-title" className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              Add job to {project.name}
            </h2>
            <JobForm
              projectId={projectId}
              onSuccess={handleJobSuccess}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
