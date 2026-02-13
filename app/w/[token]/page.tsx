import Link from "next/link";
import { ClipboardList, Clock, DollarSign, Calendar, CheckCircle2 } from "lucide-react";
import { routes } from "@/lib/routes";

// Mock data — comprehensive worker dashboard data
const stats = {
  activeJobs: 3,
  completedThisWeek: 8,
  hoursThisWeek: 38,
  earningsThisWeek: "$1,520",
  completionRate: "94%",
  averageHoursPerDay: 5.4,
};

const upcomingJobs = [
  { id: "1", name: "Smith HVAC Install", dueDate: "Today, Feb 13", status: "in_progress", location: "123 Main St", hours: 6 },
  { id: "2", name: "Brown AC Maintenance", dueDate: "Tomorrow, Feb 14", status: "scheduled", location: "456 Oak Ave", hours: 2 },
  { id: "3", name: "Williams Duct Cleaning", dueDate: "Feb 18", status: "scheduled", location: "789 Pine Rd", hours: 4 },
  { id: "4", name: "Garcia Refrigerant Recharge", dueDate: "Feb 16", status: "scheduled", location: "147 Birch Way", hours: 2 },
];

const recentActivity = [
  { id: "1", job: "Jones Furnace Repair", action: "Completed", time: "2 hours ago", amount: "$420", hours: 3 },
  { id: "2", job: "Davis Thermostat Install", action: "Completed", time: "Yesterday", amount: "$180", hours: 1 },
  { id: "3", job: "Anderson Heat Pump Service", action: "Completed", time: "2 days ago", amount: "$360", hours: 3 },
  { id: "4", job: "White Filter Replacement", action: "Completed", time: "3 days ago", amount: "$120", hours: 1 },
];

export default async function WorkerDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-fc-brand">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-fc-muted">
          Your jobs, hours, and earnings at a glance.
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <ClipboardList className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-muted">Active jobs</p>
              <p className="text-2xl font-bold text-fc-brand">{stats.activeJobs}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-muted">Completed this week</p>
              <p className="text-2xl font-bold text-fc-brand">{stats.completedThisWeek}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Clock className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-muted">Hours this week</p>
              <p className="text-2xl font-bold text-fc-brand">{stats.hoursThisWeek}</p>
              <p className="text-xs text-fc-muted mt-0.5">{stats.averageHoursPerDay} hrs/day avg</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-muted">Earnings this week</p>
              <p className="text-2xl font-bold text-fc-brand">{stats.earningsThisWeek}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <CheckCircle2 className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-fc-muted">Completion rate</p>
              <p className="text-2xl font-bold text-fc-brand">{stats.completionRate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href={routes.worker.clock(token)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-fc-brand/90"
        >
          <Clock className="h-4 w-4" />
          Clock in / out
        </Link>
        <Link
          href={routes.worker.jobs(token)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-fc-border bg-white px-4 py-2.5 text-sm font-medium text-fc-brand transition-colors hover:bg-slate-50"
        >
          <ClipboardList className="h-4 w-4" />
          View all jobs
        </Link>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming jobs */}
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fc-brand">Upcoming jobs</h2>
            <Link
              href={routes.worker.jobs(token)}
              className="text-xs font-medium text-fc-accent hover:underline"
            >
              See all
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-fc-border p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <ClipboardList className="h-4 w-4 shrink-0 mt-0.5 text-fc-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-fc-brand truncate">{job.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-fc-muted">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{job.dueDate}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.hours} {job.hours === 1 ? "hr" : "hrs"}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    job.status === "in_progress"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {job.status === "in_progress" ? "In progress" : "Scheduled"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fc-brand">Recent activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-fc-border p-3"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-fc-brand truncate">{activity.job}</p>
                    <p className="mt-1 text-xs text-fc-muted">{activity.action} • {activity.time} • {activity.hours} {activity.hours === 1 ? "hr" : "hrs"}</p>
                  </div>
                </div>
                <span className="shrink-0 font-medium text-fc-brand">{activity.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
