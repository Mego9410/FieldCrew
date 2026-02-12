import Link from "next/link";
import { List, Star, Filter, BarChart3, PieChart } from "lucide-react";
import { routes } from "@/lib/routes";

const metricCards = [
  { title: "Total completed jobs", value: "4", filters: "1 Filter" },
  { title: "Total incomplete jobs", value: "6", filters: "No Filters" },
  { title: "Total overdue jobs", value: "1", filters: "No Filters" },
  { title: "Total jobs", value: "10", filters: "No Filters" },
];

export default function OwnerDashboardPage() {
  return (
    <div className="px-6 py-6">
      {/* Project / workspace header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-slate-500" />
            <h1 className="font-display text-xl font-bold text-slate-800">
              My workspace
            </h1>
            <button
              type="button"
              className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              aria-label="Star"
            >
              <Star className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Labour cost per job, payroll intelligence, and crew management.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          + Add widget
        </button>
      </div>

      {/* Metric cards row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map(({ title, value, filters }) => (
          <div
            key={title}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              {filters}
            </div>
          </div>
        ))}
      </div>

      {/* Chart widgets row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Jobs by status
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">2 Filters</span>
              <Link
                href={routes.owner.jobs}
                className="text-xs font-medium text-fc-accent hover:underline"
              >
                See all
              </Link>
            </div>
          </div>
          <div className="flex h-48 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-10 w-10" />
              <span className="text-sm">Bar chart placeholder</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Completion status
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">1 Filter</span>
              <Link
                href={routes.owner.jobs}
                className="text-xs font-medium text-fc-accent hover:underline"
              >
                See all
              </Link>
            </div>
          </div>
          <div className="flex h-48 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <div className="flex items-center gap-4">
              <PieChart className="h-10 w-10" />
              <span className="text-sm">Donut chart placeholder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second row of chart placeholders */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">
            Upcoming jobs by assignee
          </h2>
          <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <span className="text-sm">Chart placeholder</span>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">
            Job completion over time
          </h2>
          <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <span className="text-sm">Area chart placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
