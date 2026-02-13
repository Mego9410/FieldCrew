"use client";

import { useState } from "react";
import { addProject, updateProject, getCompanies } from "@/lib/mock-storage";
import type { Project, ProjectInput } from "@/lib/entities";
import { FormField, FormInput } from "./FormField";

const COLOR_OPTIONS = [
  { value: "bg-teal-400", label: "Teal" },
  { value: "bg-violet-400", label: "Violet" },
  { value: "bg-amber-400", label: "Amber" },
  { value: "bg-rose-400", label: "Rose" },
  { value: "bg-blue-400", label: "Blue" },
  { value: "bg-emerald-400", label: "Emerald" },
];

interface ProjectFormProps {
  project?: Project | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const companies = getCompanies();
  const companyId = companies[0]?.id ?? project?.companyId ?? "";

  const [name, setName] = useState(project?.name ?? "");
  const [color, setColor] = useState(project?.color ?? "bg-teal-400");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    if (!companyId) {
      setError("No company configured.");
      return;
    }

    const input: ProjectInput = {
      name: name.trim(),
      color,
      companyId,
    };

    if (project) {
      updateProject(project.id, input);
    } else {
      addProject(input);
    }

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Project name" id="project-name" required>
        <FormInput
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. ASMobbin Campaign"
          autoFocus
        />
      </FormField>
      <FormField label="Color" id="project-color">
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setColor(opt.value)}
              className={`h-8 w-8 rounded-full border-2 transition-colors ${
                color === opt.value
                  ? `border-fc-accent ${opt.value} ring-2 ring-fc-accent/30`
                  : `border-fc-border ${opt.value} hover:border-fc-accent/50`
              }`}
              title={opt.label}
              aria-label={opt.label}
            />
          ))}
        </div>
      </FormField>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
        >
          {project ? "Update" : "Create"} project
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-fc-border px-4 py-2.5 text-sm font-medium text-fc-brand hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
