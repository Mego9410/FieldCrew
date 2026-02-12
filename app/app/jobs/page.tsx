import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  User,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { routes } from "@/lib/routes";

// Placeholder data — replace with real data later
const jobs = [
  { id: "1", name: "Smith HVAC Install", status: "in_progress", assignee: "J. Martinez", dueDate: "Feb 14", labourCost: "—" },
  { id: "2", name: "Jones Furnace Repair", status: "completed", assignee: "M. Chen", dueDate: "Feb 12", labourCost: "$420" },
  { id: "3", name: "Williams Duct Cleaning", status: "scheduled", assignee: "R. Davis", dueDate: "Feb 18", labourCost: "—" },
  { id: "4", name: "Brown AC Maintenance", status: "in_progress", assignee: "J. Martinez", dueDate: "Feb 15", labourCost: "—" },
  { id: "5", name: "Davis Thermostat Install", status: "completed", assignee: "M. Chen", dueDate: "Feb 10", labourCost: "$180" },
];

const statusStyles: Record<string, string> = {
  scheduled: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  overdue: "bg-red-100 text-red-800",
};

export default function JobsPage() {
  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Jobs</h1>
          <p className="mt-1 text-sm text-fc-muted">
            Manage jobs and see labour cost per job.
          </p>
        </div>
        <Link
          href={routes.owner.jobs}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-fc-brand/90"
        >
          <Plus className="h-4 w-4" />
          New job
        </Link>
      </div>

      {/* Filters & search */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search jobs…"
            className="w-full rounded-lg border border-fc-border bg-white py-2 pl-9 pr-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-slate-50"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Jobs table */}
      <div className="rounded-lg border border-fc-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-fc-border bg-slate-50/80">
                <th className="px-4 py-3 font-semibold text-fc-brand">Job</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Status</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Assignee</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Due</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Labour cost</th>
                <th className="w-10 px-2 py-3" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-fc-border last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 shrink-0 text-fc-muted" />
                      <span className="font-medium text-fc-brand">{job.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[job.status] ?? "bg-slate-100 text-slate-700"}`}
                    >
                      {job.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fc-muted">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {job.assignee}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fc-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {job.dueDate}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-fc-brand">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      {job.labourCost}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      className="rounded p-1.5 text-fc-muted hover:bg-slate-100 hover:text-fc-brand"
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
    </div>
  );
}
