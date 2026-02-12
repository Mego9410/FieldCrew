import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  User,
  Clock,
} from "lucide-react";
import { routes } from "@/lib/routes";

// Placeholder data — replace with real data later
const workers = [
  { id: "1", name: "J. Martinez", email: "j.martinez@example.com", role: "Technician", hoursThisWeek: "32" },
  { id: "2", name: "M. Chen", email: "m.chen@example.com", role: "Technician", hoursThisWeek: "28" },
  { id: "3", name: "R. Davis", email: "r.davis@example.com", role: "Technician", hoursThisWeek: "24" },
];

export default function WorkersPage() {
  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Workers</h1>
          <p className="mt-1 text-sm text-fc-muted">
            Manage crew members and worker access.
          </p>
        </div>
        <Link
          href={routes.owner.workers}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-fc-brand/90"
        >
          <Plus className="h-4 w-4" />
          Invite worker
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search workers…"
            className="w-full rounded-lg border border-fc-border bg-white py-2 pl-9 pr-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          />
        </div>
      </div>

      {/* Workers grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="rounded-lg border border-fc-border bg-white p-4 shadow-sm hover:border-fc-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fc-accent/10 text-fc-accent font-semibold">
                  {worker.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-fc-brand truncate">{worker.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-fc-muted truncate">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {worker.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded p-1.5 text-fc-muted hover:bg-slate-100 hover:text-fc-brand shrink-0"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-fc-border pt-3 text-sm">
              <span className="flex items-center gap-1.5 text-fc-muted">
                <User className="h-3.5 w-3.5" />
                {worker.role}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-fc-brand">
                <Clock className="h-3.5 w-3.5" />
                {worker.hoursThisWeek} hrs this week
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
