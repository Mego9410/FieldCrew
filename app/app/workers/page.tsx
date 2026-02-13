"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  User,
  List,
  LayoutGrid,
} from "lucide-react";
import { getWorkers } from "@/lib/mock-storage";
import { WorkerForm } from "@/components/forms";

export default function WorkersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  const workers = getWorkers();
  const filtered = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.phone.includes(search)
  );

  const handleWorkerSuccess = useCallback(() => {
    setShowAddModal(false);
    setRefreshKey((k) => k + 1);
  }, []);
  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Workers</h1>
          <p className="mt-1 text-sm text-fc-muted">
            Manage crew members and worker access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-fc-brand/90"
        >
          <Plus className="h-4 w-4" />
          Invite worker
        </button>
      </div>

      {/* Search + view toggle */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search workers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-fc-border bg-white py-2 pl-9 pr-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          />
        </div>
        <div className="flex rounded-lg border border-fc-border bg-white p-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="List view"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-fc-accent/10 text-fc-accent"
                : "text-fc-muted hover:bg-slate-50 hover:text-fc-brand"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            title="Card view"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              viewMode === "cards"
                ? "bg-fc-accent/10 text-fc-accent"
                : "text-fc-muted hover:bg-slate-50 hover:text-fc-brand"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Workers list view */}
      {viewMode === "list" && (
        <div className="rounded-lg border border-fc-border bg-white shadow-sm overflow-hidden" key={refreshKey}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-fc-border bg-slate-50/80">
                  <th className="px-4 py-3 font-semibold text-fc-brand">Worker</th>
                  <th className="px-4 py-3 font-semibold text-fc-brand">Phone</th>
                  <th className="px-4 py-3 font-semibold text-fc-brand">Hourly rate</th>
                  <th className="w-10 px-2 py-3" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {filtered.map((worker) => (
                  <tr
                    key={worker.id}
                    className="border-b border-fc-border last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fc-accent/10 text-fc-accent font-semibold text-sm">
                          {worker.name.charAt(0)}
                        </div>
                        <span className="font-medium text-fc-brand">{worker.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-fc-muted">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {worker.phone}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-fc-muted">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        ${worker.hourlyRate}/hr
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
      )}

      {/* Workers card view */}
      {viewMode === "cards" && (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" key={refreshKey}>
        {filtered.map((worker) => (
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
                    {worker.phone}
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
            <div className="mt-4 space-y-2 border-t border-fc-border pt-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-fc-muted">
                  <User className="h-3.5 w-3.5" />
                  ${worker.hourlyRate}/hr
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add worker modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-worker-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-fc-border bg-white p-6 shadow-lg">
            <h2 id="add-worker-title" className="mb-4 font-display text-lg font-bold text-fc-brand">
              Add worker
            </h2>
            <WorkerForm onSuccess={handleWorkerSuccess} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
