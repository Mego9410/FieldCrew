"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, User, Users, ClipboardList, Clock, ChevronRight } from "lucide-react";
import { routes } from "@/lib/routes";
import {
  CompanyForm,
  OwnerUserForm,
  WorkerForm,
  JobForm,
  TimeEntryForm,
  ProjectForm,
} from "@/components/forms";
import {
  getCompanies,
  getOwnerUsers,
  getWorkers,
  getJobs,
  getTimeEntries,
  getProjects,
} from "@/lib/mock-storage";
import { Folder } from "lucide-react";

const tabs = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "owner", label: "Owner user", icon: User },
  { id: "project", label: "Project", icon: Folder },
  { id: "worker", label: "Worker", icon: Users },
  { id: "job", label: "Job", icon: ClipboardList },
  { id: "timeentry", label: "Time entry", icon: Clock },
] as const;

export default function DataPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("company");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => setRefreshKey((k) => k + 1);

  const companies = getCompanies();
  const ownerUsers = getOwnerUsers();
  const projects = getProjects();
  const workers = getWorkers();
  const jobs = getJobs();
  const timeEntries = getTimeEntries();

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">Entity setup</h1>
        <p className="mt-1 text-sm text-fc-muted">
          Define entities and fields. Data is stored in mock local storage.
        </p>
        <Link
          href={routes.owner.home}
          className="mt-2 inline-flex items-center gap-1 text-sm text-fc-accent hover:underline"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tabs */}
        <nav
          className="flex shrink-0 flex-col gap-1 rounded-lg border border-fc-border bg-white p-1 shadow-sm lg:w-48"
          aria-label="Entity types"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-fc-accent/10 text-fc-accent"
                  : "text-fc-brand hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Form + list */}
        <div className="min-w-0 flex-1 space-y-6">
          <div className="rounded-lg border border-fc-border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-fc-muted">
              Create {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            {activeTab === "company" && <CompanyForm onSuccess={handleSuccess} />}
            {activeTab === "owner" && <OwnerUserForm onSuccess={handleSuccess} />}
            {activeTab === "project" && <ProjectForm onSuccess={handleSuccess} />}
            {activeTab === "worker" && <WorkerForm onSuccess={handleSuccess} />}
            {activeTab === "job" && <JobForm onSuccess={handleSuccess} />}
            {activeTab === "timeentry" && <TimeEntryForm onSuccess={handleSuccess} />}
          </div>

          {/* Current data summary */}
          <div className="rounded-lg border border-fc-border bg-white p-6 shadow-sm" key={refreshKey}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-fc-muted">
              Stored data
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-fc-muted">Companies</dt>
                <dd className="mt-0.5 text-fc-brand">{companies.length}</dd>
              </div>
              <div>
                <dt className="font-medium text-fc-muted">Owner users</dt>
                <dd className="mt-0.5 text-fc-brand">{ownerUsers.length}</dd>
              </div>
              <div>
                <dt className="font-medium text-fc-muted">Projects</dt>
                <dd className="mt-0.5 text-fc-brand">{projects.length}</dd>
              </div>
              <div>
                <dt className="font-medium text-fc-muted">Workers</dt>
                <dd className="mt-0.5 text-fc-brand">{workers.length}</dd>
              </div>
              <div>
                <dt className="font-medium text-fc-muted">Jobs</dt>
                <dd className="mt-0.5 text-fc-brand">{jobs.length}</dd>
              </div>
              <div>
                <dt className="font-medium text-fc-muted">Time entries</dt>
                <dd className="mt-0.5 text-fc-brand">{timeEntries.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
