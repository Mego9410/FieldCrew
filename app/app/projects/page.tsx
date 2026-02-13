"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { routes } from "@/lib/routes";
import { getProjects, getJobs } from "@/lib/mock-storage";
import { ProjectForm } from "@/components/forms";

export default function ProjectsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const projects = getProjects();
  const jobs = getJobs();

  const handleSuccess = useCallback(() => {
    setShowAddModal(false);
    setRefreshKey((k) => k + 1);
  }, []);

  const getJobCount = (projectId: string) =>
    jobs.filter((j) => j.projectId === projectId).length;

  return (
    <div className="px-6 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Projects</h1>
          <p className="mt-1 text-sm text-fc-muted">
            Group jobs into projects. Assign multi-day work or add ad-hoc tasks with different workers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-fc-brand/90"
        >
          <Plus className="h-4 w-4" />
          New project
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" key={refreshKey}>
        {projects.map((project) => (
          <Link
            key={project.id}
            href={routes.owner.projectJobs(project.id)}
            className="flex items-center gap-3 rounded-lg border border-fc-border bg-white p-4 shadow-sm transition-colors hover:border-fc-accent/30 hover:bg-slate-50/50"
          >
            <span
              className={`h-10 w-10 shrink-0 rounded-lg ${project.color}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-fc-brand truncate">{project.name}</p>
              <p className="text-sm text-fc-muted">
                {getJobCount(project.id)} {getJobCount(project.id) === 1 ? "job" : "jobs"}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-fc-muted" />
          </Link>
        ))}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-project-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border border-fc-border bg-white p-6 shadow-lg">
            <h2 id="add-project-title" className="mb-4 font-display text-lg font-bold text-fc-brand">
              New project
            </h2>
            <ProjectForm onSuccess={handleSuccess} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
