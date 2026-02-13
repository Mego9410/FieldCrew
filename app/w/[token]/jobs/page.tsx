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
import { routes } from "@/lib/routes";

// Mock data — comprehensive worker jobs list
const jobs = [
  {
    id: "1",
    name: "Smith HVAC Install",
    status: "in_progress",
    dueDate: "Today, Feb 13",
    location: "123 Main St, City",
    description: "Install new HVAC system in residential property. Includes ductwork, unit installation, and thermostat setup.",
    estimatedHours: 6,
    actualHours: 4.5,
    priority: "high",
  },
  {
    id: "2",
    name: "Brown AC Maintenance",
    status: "scheduled",
    dueDate: "Tomorrow, Feb 14",
    location: "456 Oak Ave, City",
    description: "Routine maintenance check and filter replacement. Inspect coils and check refrigerant levels.",
    estimatedHours: 2,
    priority: "medium",
  },
  {
    id: "3",
    name: "Williams Duct Cleaning",
    status: "scheduled",
    dueDate: "Feb 18",
    location: "789 Pine Rd, City",
    description: "Full duct cleaning service for entire home. Includes sanitization and filter replacement.",
    estimatedHours: 4,
    priority: "medium",
  },
  {
    id: "4",
    name: "Garcia Refrigerant Recharge",
    status: "scheduled",
    dueDate: "Feb 16",
    location: "147 Birch Way, City",
    description: "Recharge AC system with R-410A refrigerant. Check for leaks and system efficiency.",
    estimatedHours: 2,
    priority: "low",
  },
  {
    id: "5",
    name: "Jones Furnace Repair",
    status: "completed",
    dueDate: "Feb 12",
    location: "321 Elm St, City",
    description: "Repair faulty furnace ignition system. Replaced igniter and cleaned burners.",
    estimatedHours: 3,
    actualHours: 3,
    priority: "high",
  },
  {
    id: "6",
    name: "Davis Thermostat Install",
    status: "completed",
    dueDate: "Feb 10",
    location: "654 Maple Dr, City",
    description: "Install smart thermostat with Wi-Fi connectivity. Configure scheduling and app setup.",
    estimatedHours: 1,
    actualHours: 1,
    priority: "low",
  },
  {
    id: "7",
    name: "Anderson Heat Pump Service",
    status: "completed",
    dueDate: "Feb 11",
    location: "987 Cedar Ln, City",
    description: "Annual service for heat pump system. Cleaned coils, checked refrigerant, tested operation.",
    estimatedHours: 3,
    actualHours: 3,
    priority: "medium",
  },
  {
    id: "8",
    name: "White Filter Replacement",
    status: "completed",
    dueDate: "Feb 9",
    location: "741 Ash Ave, City",
    description: "Replace air filters throughout home. Checked system operation.",
    estimatedHours: 1,
    actualHours: 0.5,
    priority: "low",
  },
];

const statusStyles: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  scheduled: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    icon: Clock,
  },
  in_progress: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    icon: Clock,
  },
  completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    icon: CheckCircle2,
  },
  overdue: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: AlertCircle,
  },
};

export default async function WorkerJobsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-fc-brand">My jobs</h1>
        <p className="mt-1 text-sm text-fc-muted">
          View and manage your assigned jobs.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search jobs…"
            className="w-full rounded-lg border border-fc-border bg-white py-2 pl-9 pr-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          />
        </div>
      </div>

      {/* Jobs list */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const statusStyle = statusStyles[job.status] || statusStyles.scheduled;
          const StatusIcon = statusStyle.icon;
          return (
            <div
              key={job.id}
              className="rounded-lg border border-fc-border bg-white p-5 shadow-sm hover:border-fc-accent/30 transition-colors"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fc-accent/10">
                    <ClipboardList className="h-5 w-5 text-fc-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-fc-brand">{job.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {job.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-fc-muted">{job.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-fc-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {job.dueDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {job.estimatedHours} {job.estimatedHours === 1 ? "hour" : "hours"} estimated
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                  {job.status === "in_progress" && (
                    <Link
                      href={routes.worker.clock(token)}
                      className="inline-flex items-center justify-center rounded-lg bg-fc-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-fc-brand/90"
                    >
                      Clock in
                    </Link>
                  )}
                  {job.status === "scheduled" && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg border border-fc-border bg-white px-4 py-2 text-sm font-medium text-fc-brand transition-colors hover:bg-slate-50"
                    >
                      Start job
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state (if no jobs) */}
      {jobs.length === 0 && (
        <div className="rounded-lg border border-fc-border bg-white p-12 text-center">
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
