"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { updateJob } from "@/lib/data";
import type { Job } from "@/lib/entities";

interface WorkerJobActionsProps {
  job: Job;
  token: string;
}

export function WorkerJobActions({ job, token }: WorkerJobActionsProps) {
  const router = useRouter();

  const handleStartJob = async () => {
    await updateJob(job.id, { status: "in_progress" });
    router.push(routes.worker.clock(token, job.id));
  };

  if (job.status === "in_progress") {
    return (
      <Link
        href={routes.worker.clock(token, job.id)}
        className="inline-flex items-center justify-center bg-fc-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-fc-accent-dark"
      >
        Clock in
      </Link>
    );
  }

  if (job.status === "scheduled") {
    return (
      <button
        type="button"
        onClick={handleStartJob}
        className="inline-flex items-center justify-center border border-fc-border bg-fc-surface px-4 py-2 text-sm font-semibold text-fc-brand transition-colors hover:bg-fc-surface-muted"
      >
        Start job
      </button>
    );
  }

  return null;
}
