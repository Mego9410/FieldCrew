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
  useCompanies,
  useOwnerUsers,
  useWorkers,
  useJobs,
  useTimeEntries,
  useProjects,
} from "@/lib/hooks/useData";
import { Folder } from "lucide-react";
import { Card } from "@/components/ui/Card";

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

  const { items: companies, refetch: refetchCompanies } = useCompanies();
  const { items: ownerUsers, refetch: refetchOwnerUsers } = useOwnerUsers();
  const { items: projects, refetch: refetchProjects } = useProjects();
  const { items: workers, refetch: refetchWorkers } = useWorkers();
  const { items: jobs, refetch: refetchJobs } = useJobs();
  const { items: timeEntries, refetch: refetchTimeEntries } = useTimeEntries();

  const handleSuccess = () => {
    refetchCompanies();
    refetchOwnerUsers();
    refetchProjects();
    refetchWorkers();
    refetchJobs();
    refetchTimeEntries();
  };

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">Entity setup</h1>
        <p className="mt-0.5 text-sm text-fc-muted">
          Define entities and fields. Data is stored in Supabase.
        </p>
        <Link
          href={routes.owner.home}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-fc-accent hover:underline"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav
          className="flex shrink-0 flex-col gap-0 border border-fc-border bg-fc-surface lg:w-48"
          aria-label="Entity types"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 border-l-4 px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                activeTab === id
                  ? "border-l-fc-accent bg-fc-surface-muted text-fc-brand"
                  : "border-l-transparent text-fc-muted hover:bg-fc-surface-muted hover:text-fc-brand"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-8">
          <section>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              Create {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
          <Card variant="default" className="p-5">
            {activeTab === "company" && <CompanyForm onSuccess={handleSuccess} />}
            {activeTab === "owner" && <OwnerUserForm onSuccess={handleSuccess} />}
            {activeTab === "project" && <ProjectForm onSuccess={handleSuccess} />}
            {activeTab === "worker" && <WorkerForm onSuccess={handleSuccess} />}
            {activeTab === "job" && <JobForm onSuccess={handleSuccess} />}
            {activeTab === "timeentry" && <TimeEntryForm onSuccess={handleSuccess} />}
          </Card>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              Stored data
            </h2>
          <Card variant="muted" className="p-5">
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
          </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
