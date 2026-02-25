"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { routes } from "@/lib/routes";
import { useProjects, useJobs } from "@/lib/hooks/useData";
import { ProjectForm } from "@/components/forms";
import { Button } from "@/components/ui/Button";

export default function ProjectsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { items: projects, refetch } = useProjects();
  const { items: jobs } = useJobs();

  const handleSuccess = useCallback(() => {
    setShowAddModal(false);
    refetch();
  }, [refetch]);

  const getJobCount = (projectId: string) =>
    jobs.filter((j) => j.projectId === projectId).length;

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">Projects</h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            Group jobs into projects. Assign multi-day work or add ad-hoc tasks with different workers.
          </p>
        </div>
        <Button type="button" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
          All projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={routes.owner.projectJobs(project.id)}
              className="flex items-center gap-3 border border-fc-border bg-fc-surface p-4 transition-colors hover:border-fc-accent"
            >
              <span
                className={`h-10 w-10 shrink-0 ${project.color}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-fc-brand truncate">{project.name}</p>
                <p className="text-sm text-fc-muted">
                  {getJobCount(project.id)} {getJobCount(project.id) === 1 ? "job" : "jobs"}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-fc-muted" />
            </Link>
          ))}
        </div>
      </section>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-project-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-auto border border-fc-border bg-fc-surface p-6">
            <h2 id="add-project-title" className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              New project
            </h2>
            <ProjectForm onSuccess={handleSuccess} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
