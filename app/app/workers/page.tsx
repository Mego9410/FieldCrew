"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  User,
  List,
  LayoutGrid,
  ExternalLink,
} from "lucide-react";
import { useWorkers } from "@/lib/hooks/useData";
import { WorkerForm } from "@/components/forms";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

export default function WorkersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const { items: workers, loading, refetch } = useWorkers();

  const filtered = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.phone.includes(search)
  );

  const handleWorkerSuccess = useCallback(() => {
    setShowAddModal(false);
    refetch();
  }, [refetch]);

  if (loading && workers.length === 0) {
    return (
      <div className="px-6 py-6">
        <div className="mb-6">
          <h1 className="font-display text-xl font-bold text-fc-brand">Workers</h1>
          <p className="mt-1 text-sm text-fc-muted">
            Manage crew members and worker access.
          </p>
        </div>
        <Card variant="default" className="py-12 text-center">
          <User className="mx-auto h-10 w-10 text-fc-muted" />
          <p className="mt-3 text-sm font-medium text-fc-brand">Loading workers…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Workers</h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            Manage crew members and worker access.
          </p>
        </div>
        <Button type="button" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Invite worker
        </Button>
      </div>

      <div className="mb-6 border border-fc-border bg-fc-surface-muted px-4 py-3 text-sm text-fc-brand">
        <strong>Test worker:</strong> Use &quot;Test Worker&quot; to try the worker app. Open as worker below, then in <strong>Jobs</strong> assign &quot;Test Worker&quot; to any job so it appears in their worker view and they can clock in/out.
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          Crew list
        </h2>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
          <input
            type="search"
            placeholder="Search workers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-fc-border bg-fc-surface py-2 pl-8 pr-3 text-sm text-fc-brand placeholder:text-fc-muted focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          />
        </div>
        <div className="flex border border-fc-border bg-fc-surface">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="List view"
            className={`px-3 py-2 text-sm font-semibold transition-colors ${
              viewMode === "list"
                ? "bg-fc-accent text-white"
                : "text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            title="Card view"
            className={`px-3 py-2 text-sm font-semibold transition-colors ${
              viewMode === "cards"
                ? "bg-fc-accent text-white"
                : "text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === "list" && (
        <Card variant="default" className="overflow-hidden p-0 border border-fc-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Worker</TableHead>
                  <TableHead className="px-4">Phone</TableHead>
                  <TableHead className="px-4">Hourly rate</TableHead>
                  <TableHead className="px-4">Worker app</TableHead>
                  <th className="w-10 px-2 py-3" aria-hidden />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((worker) => (
                  <TableRow key={worker.id} className="*:px-4">
                    <TableCell>
                      <Link
                        href={routes.owner.worker(worker.id)}
                        className="flex items-center gap-3 hover:opacity-90"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fc-accent/10 text-fc-accent font-semibold text-sm">
                          {worker.name.charAt(0)}
                        </div>
                        <span className="font-medium text-fc-brand">{worker.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-fc-muted">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {worker.phone}
                      </span>
                    </TableCell>
                    <TableCell className="text-fc-muted">
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        ${worker.hourlyRate}/hr
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={routes.worker.home(worker.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-fc border border-fc-border bg-fc-surface px-2.5 py-1.5 text-xs font-medium text-fc-brand transition-all duration-fc hover:border-fc-accent/50 hover:bg-fc-surface-muted"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open as worker
                      </Link>
                    </TableCell>
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
      )}

      {viewMode === "cards" && (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((worker) => (
          <Link
            key={worker.id}
            href={routes.owner.worker(worker.id)}
            className="block border border-fc-border bg-fc-surface p-4 transition-colors hover:border-fc-accent"
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
              <span
                className="rounded p-1.5 text-fc-muted shrink-0 pointer-events-none"
                aria-hidden
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 border-t border-fc-border pt-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-fc-muted">
                  <User className="h-3.5 w-3.5" />
                  ${worker.hourlyRate}/hr
                </span>
              </div>
              <a
                href={routes.worker.home(worker.id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 border border-fc-border bg-fc-surface py-2 text-xs font-semibold text-fc-brand hover:bg-fc-surface-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open as worker
              </a>
            </div>
          </Link>
        ))}
      </div>
      )}

      </section>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-worker-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-auto border border-fc-border bg-fc-surface p-6">
            <h2 id="add-worker-title" className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              Add worker
            </h2>
            <WorkerForm onSuccess={handleWorkerSuccess} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
