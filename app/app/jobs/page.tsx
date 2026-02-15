"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ClipboardList,
  User,
} from "lucide-react";
import { useJobs, useWorkers, useTimeEntries } from "@/lib/hooks/useData";
import { routes } from "@/lib/routes";
import { JobForm } from "@/components/forms";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

// Derive display data from entities
function useJobsDisplay() {
  const { items: jobs, refetch: refetchJobs } = useJobs();
  const { items: workers } = useWorkers();
  const { items: entries } = useTimeEntries();

  const refetch = useCallback(() => {
    refetchJobs();
  }, [refetchJobs]);

  return { display: jobs.map((job) => {
    const jobEntries = entries.filter((e) => e.jobId === job.id);
    const assigneeIds = job.workerIds?.length ? job.workerIds : [...new Set(jobEntries.map((e) => e.workerId))];
    const assigneeNames = assigneeIds
      .map((id) => workers.find((w) => w.id === id)?.name)
      .filter(Boolean);
    const assignee = assigneeNames.length ? assigneeNames.join(", ") : "—";

    // Estimated: hours expected × assigned workers' hourly rates
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

    // Actual: from time entries (worker-submitted hours)
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
  }), refetch };
}

const statusVariants = {
  scheduled: "neutral" as const,
  in_progress: "warning" as const,
  completed: "success" as const,
  overdue: "danger" as const,
};

export default function JobsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const { display: jobsDisplay, refetch } = useJobsDisplay();
  const filtered = jobsDisplay.filter(
    (j) =>
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleJobSuccess = useCallback(() => {
    setShowAddModal(false);
    refetch();
  }, [refetch]);

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Jobs</h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            Manage jobs and see labour cost per job.
          </p>
        </div>
        <Button type="button" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          New job
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Job list
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
        <Card variant="default" className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Job</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="px-4">Assignee</TableHead>
                <TableHead className="px-4">Due</TableHead>
                <TableHead className="px-4">Estimated</TableHead>
                <TableHead className="px-4">Actual</TableHead>
                <th className="w-10 px-2 py-3" aria-hidden />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((job) => (
                <TableRow key={job.id} className="*:px-4">
                  <TableCell>
                    <Link
                      href={routes.owner.job(job.id)}
                      className="flex items-center gap-2 group"
                    >
                      <ClipboardList className="h-4 w-4 shrink-0 text-fc-muted transition-colors duration-fc group-hover:text-fc-accent" />
                      <div>
                        <span className="font-medium text-fc-brand group-hover:text-fc-accent group-hover:underline">
                          {job.name}
                        </span>
                        <p className="text-xs text-fc-muted mt-0.5">{job.address}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[job.status as keyof typeof statusVariants] ?? "neutral"}>
                      {job.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-fc-muted">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {job.assignee}
                    </span>
                  </TableCell>
                  <TableCell className="text-fc-muted">{job.dueDate}</TableCell>
                  <TableCell className="text-fc-muted">{job.estimatedDisplay}</TableCell>
                  <TableCell className="font-medium text-fc-brand">{job.actualDisplay}</TableCell>
                  <TableCell className="px-2">
                    <button
                      type="button"
                      className="rounded p-1.5 text-fc-muted transition-colors duration-fc hover:bg-fc-surface-muted hover:text-fc-brand"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
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
              New job
            </h2>
            <JobForm onSuccess={handleJobSuccess} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
