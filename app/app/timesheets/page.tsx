import {
  Search,
  Filter,
  Calendar,
  User,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";

// Mock data — comprehensive timesheet listings
const timesheets = [
  { id: "1", worker: "J. Martinez", period: "Feb 3 – 9", hours: "38", status: "pending", earnings: "$1,520", jobs: 5 },
  { id: "2", worker: "M. Chen", period: "Feb 3 – 9", hours: "32", status: "approved", earnings: "$1,280", jobs: 4 },
  { id: "3", worker: "R. Davis", period: "Feb 3 – 9", hours: "28", status: "pending", earnings: "$1,120", jobs: 3 },
  { id: "4", worker: "T. Wilson", period: "Feb 3 – 9", hours: "24", status: "approved", earnings: "$960", jobs: 2 },
  { id: "5", worker: "S. Patel", period: "Feb 3 – 9", hours: "20", status: "pending", earnings: "$800", jobs: 2 },
  { id: "6", worker: "A. Johnson", period: "Feb 3 – 9", hours: "30", status: "approved", earnings: "$1,200", jobs: 4 },
  { id: "7", worker: "L. Rodriguez", period: "Feb 3 – 9", hours: "26", status: "pending", earnings: "$1,040", jobs: 3 },
  { id: "8", worker: "K. Thompson", period: "Feb 3 – 9", hours: "40", status: "approved", earnings: "$1,600", jobs: 6 },
  { id: "9", worker: "J. Martinez", period: "Jan 27 – Feb 2", hours: "40", status: "approved", earnings: "$1,600", jobs: 6 },
  { id: "10", worker: "M. Chen", period: "Jan 27 – Feb 2", hours: "35", status: "approved", earnings: "$1,400", jobs: 5 },
];

export default function TimesheetsPage() {
  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">Timesheets</h1>
        <p className="mt-1 text-sm text-fc-muted">
          View and approve timesheets by period.
        </p>
      </div>

      {/* Period selector */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-lg border border-fc-border bg-white">
          <button
            type="button"
            className="rounded-l-lg p-2.5 text-fc-muted hover:bg-slate-50 hover:text-fc-brand"
            aria-label="Previous period"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="flex items-center gap-2 border-x border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand">
            <Calendar className="h-4 w-4 text-fc-muted" />
            Feb 3 – 9, 2025
          </span>
          <button
            type="button"
            className="rounded-r-lg p-2.5 text-fc-muted hover:bg-slate-50 hover:text-fc-brand"
            aria-label="Next period"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search by worker…"
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

      {/* Timesheets list */}
      <div className="rounded-lg border border-fc-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-fc-border bg-slate-50/80">
                <th className="px-4 py-3 font-semibold text-fc-brand">Worker</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Period</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Hours</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Jobs</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Earnings</th>
                <th className="px-4 py-3 font-semibold text-fc-brand">Status</th>
                <th className="px-4 py-3 font-semibold text-fc-brand text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts) => (
                <tr
                  key={ts.id}
                  className="border-b border-fc-border last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-medium text-fc-brand">
                      <User className="h-4 w-4 text-fc-muted" />
                      {ts.worker}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fc-muted">{ts.period}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 font-medium text-fc-brand">
                      <Clock className="h-3.5 w-3.5" />
                      {ts.hours} hrs
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fc-muted">
                    {ts.jobs} {ts.jobs === 1 ? "job" : "jobs"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 font-medium text-fc-brand">
                      <DollarSign className="h-3.5 w-3.5" />
                      {ts.earnings}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        ts.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ts.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ts.status === "pending" && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-fc-border bg-white px-2.5 py-1.5 text-xs font-medium text-fc-brand hover:bg-slate-50"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                      </div>
                    )}
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
