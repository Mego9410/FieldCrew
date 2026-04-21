 "use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { TeamBasicsStep } from "@/components/onboarding/TeamBasicsStep";
import { WorkloadBasicsStep } from "@/components/onboarding/WorkloadBasicsStep";
import { InsightGeneratingLoader } from "@/components/onboarding/InsightGeneratingLoader";
import {
  SeedWorkersStep,
  createEmptyWorkerRow,
  type WorkerSeedRow,
} from "@/components/onboarding/SeedWorkersStep";
import {
  SeedJobsStep,
  createEmptyJobRow,
  type JobSeedRow,
  type AssignableWorker,
} from "@/components/onboarding/SeedJobsStep";
import { OnboardingReadyStep } from "@/components/onboarding/OnboardingReadyStep";
import { SavingsStep } from "@/components/onboarding/SavingsStep";
import { SuggestedPlanStep } from "@/components/onboarding/SuggestedPlanStep";
import { Button } from "@/components/ui/Button";
import { generateEstimatedSnapshot } from "@/lib/insights/generateEstimatedSnapshot";
import { routes } from "@/lib/routes";
import { isPlanId, suggestPlanIdForWorkers, type PlanId } from "@/lib/pricing-plans";
import type { Company, Worker } from "@/lib/entities";
import type { CompanyOnboardingProfile, EstimatedSnapshot, OnboardingInsightInputs } from "@/types/onboarding";

const LOADER_MS = 1500;
const TOTAL_STEPS = 7;

type TeamForm = Pick<
  OnboardingInsightInputs,
  "companyName" | "tradeType" | "fieldTechCount" | "officeStaffCount"
>;

type WorkloadForm = Pick<
  OnboardingInsightInputs,
  "jobsPerWeek" | "avgJobDurationBand" | "overrunFrequency" | "overtimeFrequency"
>;

function initialTeam(company: Company, profile: CompanyOnboardingProfile | null): TeamForm {
  if (profile) {
    return {
      companyName: profile.companyName,
      tradeType: profile.tradeType,
      fieldTechCount: profile.fieldTechCount,
      officeStaffCount: profile.officeStaffCount,
    };
  }
  return {
    companyName: company.name?.trim() ? company.name : "",
    tradeType: "hvac",
    fieldTechCount: Math.max(1, company.expectedTeamSize ?? 5),
    officeStaffCount: null,
  };
}

function initialWorkload(profile: CompanyOnboardingProfile | null): WorkloadForm {
  if (profile) {
    return {
      jobsPerWeek: profile.jobsPerWeek,
      avgJobDurationBand: profile.avgJobDurationBand,
      overrunFrequency: profile.overrunFrequency,
      overtimeFrequency: profile.overtimeFrequency ?? "rarely",
    };
  }
  return {
    jobsPerWeek: 15,
    avgJobDurationBand: "hours_2_4",
    overrunFrequency: "sometimes",
    overtimeFrequency: "rarely",
  };
}

export interface OnboardingWizardProps {
  initialCompany: Company;
  initialProfile?: CompanyOnboardingProfile | null;
  initialWorkers?: Worker[];
  isPreview?: boolean;
  showPaymentSuccess?: boolean;
}

export function OnboardingWizard({
  initialCompany,
  initialProfile = null,
  initialWorkers = [],
  isPreview = false,
  showPaymentSuccess = false,
}: OnboardingWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [team, setTeam] = useState<TeamForm>(() => initialTeam(initialCompany, initialProfile));
  const [workload, setWorkload] = useState<WorkloadForm>(() => initialWorkload(initialProfile));
  const [snapshot, setSnapshot] = useState<EstimatedSnapshot | null>(
    () => initialProfile?.estimatedSnapshot ?? null
  );
  const [teamErrors, setTeamErrors] = useState<Partial<Record<keyof TeamForm, string>>>({});
  const [workloadErrors, setWorkloadErrors] = useState<Partial<Record<keyof WorkloadForm, string>>>({});
  const [workerRows, setWorkerRows] = useState<WorkerSeedRow[]>([
    createEmptyWorkerRow(),
    createEmptyWorkerRow(),
  ]);
  const [jobRows, setJobRows] = useState<JobSeedRow[]>([createEmptyJobRow(), createEmptyJobRow()]);
  const [onboardingAddedWorkerIds, setOnboardingAddedWorkerIds] = useState<string[]>([]);
  const [jobsAddedCount, setJobsAddedCount] = useState(0);
  const [assignableWorkers, setAssignableWorkers] = useState<AssignableWorker[]>(
    () => initialWorkers.map((w) => ({ id: w.id, name: w.name }))
  );
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const mergeInputs = useCallback((): OnboardingInsightInputs => {
    return {
      companyName: team.companyName.trim(),
      tradeType: team.tradeType,
      fieldTechCount: team.fieldTechCount,
      officeStaffCount: team.officeStaffCount,
      jobsPerWeek: workload.jobsPerWeek,
      avgJobDurationBand: workload.avgJobDurationBand,
      overrunFrequency: workload.overrunFrequency,
      overtimeFrequency: workload.overtimeFrequency ?? "rarely",
    };
  }, [team, workload]);

  const validateTeam = useCallback((): boolean => {
    const e: Partial<Record<keyof TeamForm, string>> = {};
    if (!team.companyName.trim()) e.companyName = "Company name is required";
    if (!team.fieldTechCount || team.fieldTechCount < 1) e.fieldTechCount = "Add at least one field tech";
    if (!team.tradeType) e.tradeType = "Choose a trade";
    setTeamErrors(e);
    return Object.keys(e).length === 0;
  }, [team]);

  const validateWorkload = useCallback((): boolean => {
    const e: Partial<Record<keyof WorkloadForm, string>> = {};
    if (!workload.jobsPerWeek || workload.jobsPerWeek < 1) {
      e.jobsPerWeek = "Enter jobs per week";
    }
    setWorkloadErrors(e);
    return Object.keys(e).length === 0;
  }, [workload]);

  const runGenerateFlow = useCallback(
    async (snap: EstimatedSnapshot) => {
      setSnapshot(snap);
      setStep(3);
      await new Promise((r) => setTimeout(r, LOADER_MS));
      // After insight generation, move into worker details (requested flow).
      setStep(4);
    },
    []
  );

  const handleGenerateInsight = async () => {
    setApiError(null);
    if (!validateTeam() || !validateWorkload()) return;

    const inputs = mergeInputs();
    if (isPreview) {
      const snap = generateEstimatedSnapshot(inputs);
      void runGenerateFlow(snap);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/onboarding/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: inputs.companyName,
          tradeType: inputs.tradeType,
          fieldTechCount: inputs.fieldTechCount,
          officeStaffCount: inputs.officeStaffCount,
          jobsPerWeek: inputs.jobsPerWeek,
          avgJobDurationBand: inputs.avgJobDurationBand,
          overrunFrequency: inputs.overrunFrequency,
          overtimeFrequency: inputs.overtimeFrequency,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = data as { error?: string; details?: string };
        setApiError(err.details ? `${err.error ?? "Could not save your answers"}: ${err.details}` : (err.error ?? "Could not save your answers"));
        return;
      }
      const snap = (data as { estimatedSnapshot?: EstimatedSnapshot }).estimatedSnapshot;
      if (!snap) {
        setApiError("Invalid response from server");
        return;
      }
      await runGenerateFlow(snap);
    } finally {
      setBusy(false);
    }
  };

  const completeAndRoute = async (to: string) => {
    if (isPreview) {
      router.push(routes.public.login + "?next=" + encodeURIComponent(to));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/onboarding/complete", { method: "POST" });
      if (!res.ok) throw new Error("Complete failed");
      router.push(to);
      router.refresh();
    } catch {
      setApiError("Could not finish setup. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoToDashboard = async () => completeAndRoute(routes.owner.home);
  const handleInviteWorkersNow = async () => completeAndRoute(routes.owner.workers);

  const handleEditAnswers = () => {
    setStep(1);
    setApiError(null);
  };

  const workerCountForPlan = useMemo(() => {
    // Prefer the number of workers the user has added during this onboarding session.
    // If they skipped adding workers, fall back to the team size estimate from step 1.
    if (onboardingAddedWorkerIds.length > 0) return onboardingAddedWorkerIds.length;
    const fallback = (team.fieldTechCount ?? 0) + (team.officeStaffCount ?? 0);
    return Math.max(0, fallback);
  }, [onboardingAddedWorkerIds.length, team.fieldTechCount, team.officeStaffCount]);

  const suggestedPlanId = useMemo(
    () => suggestPlanIdForWorkers(workerCountForPlan),
    [workerCountForPlan]
  );
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(suggestedPlanId);

  useEffect(() => {
    setSelectedPlanId(suggestedPlanId);
  }, [suggestedPlanId]);

  useEffect(() => {
    const stepParam = searchParams.get("step");
    const parsed = stepParam ? Number(stepParam) : NaN;
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 8) {
      setStep(parsed);
    }
    const planParam = searchParams.get("plan")?.toLowerCase();
    if (planParam && isPlanId(planParam)) {
      setSelectedPlanId(planParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filledWorkerRows = useMemo(
    () =>
      workerRows.filter(
        (r) => r.firstName.trim() || r.lastName.trim() || r.mobileNumber.trim() || r.role.trim() || r.hourlyRate.trim()
      ),
    [workerRows]
  );

  const filledJobRows = useMemo(
    () =>
      jobRows.filter(
        (r) =>
          r.title.trim() ||
          r.customerOrSiteName.trim() ||
          r.jobType.trim() ||
          r.estimatedHours.trim() ||
          r.scheduledDate.trim() ||
          r.assignedWorkerIds.length > 0
      ),
    [jobRows]
  );

  const saveWorkers = async (rows: WorkerSeedRow[]) => {
    if (isPreview) {
      const pseudo = rows.map((r, i) => ({ id: `preview-${Date.now()}-${i}`, name: `${r.firstName} ${r.lastName}`.trim() }));
      setOnboardingAddedWorkerIds((prev) => {
        const next = new Set(prev);
        pseudo.forEach((w) => next.add(w.id));
        return Array.from(next);
      });
      setAssignableWorkers((prev) => [...prev, ...pseudo]);
      return;
    }
    const res = await fetch("/api/onboarding/seed-workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workers: rows.map((r) => ({
          firstName: r.firstName.trim(),
          lastName: r.lastName.trim() || null,
          mobileNumber: r.mobileNumber.trim() || null,
          role: r.role.trim() || null,
          hourlyRate: r.hourlyRate.trim() ? Number(r.hourlyRate) : null,
        })),
      }),
    });
    const data = await res.json().catch(() => ({} as Record<string, unknown>));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? "Could not save workers");
    const created = ((data as { workers?: { id: string; name: string }[] }).workers ?? []).map((w) => ({
      id: w.id,
      name: w.name,
    }));
    setOnboardingAddedWorkerIds((prev) => {
      const next = new Set(prev);
      created.forEach((w) => next.add(w.id));
      return Array.from(next);
    });
    setAssignableWorkers((prev) => {
      const next = new Map(prev.map((w) => [w.id, w] as const));
      created.forEach((w) => next.set(w.id, w));
      return Array.from(next.values());
    });
  };

  const saveJobs = async (rows: JobSeedRow[]) => {
    if (isPreview) {
      setJobsAddedCount((c) => c + rows.length);
      return;
    }
    const res = await fetch("/api/onboarding/seed-jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobs: rows.map((r) => ({
          title: r.title.trim(),
          customerOrSiteName: r.customerOrSiteName.trim() || null,
          jobType: r.jobType.trim() || null,
          estimatedHours: Number(r.estimatedHours),
          scheduledDate: r.scheduledDate || null,
          assignedWorkerIds: r.assignedWorkerIds,
        })),
      }),
    });
    const data = await res.json().catch(() => ({} as Record<string, unknown>));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? "Could not save jobs");
    const createdCount = (data as { createdCount?: number }).createdCount ?? 0;
    setJobsAddedCount((c) => c + createdCount);
  };

  const previewBanner = isPreview ? (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-800">
      You&apos;re viewing a preview.{" "}
      <Link
        href={routes.public.login + "?next=" + encodeURIComponent(routes.owner.onboarding)}
        className="font-medium underline underline-offset-2 hover:text-amber-900"
      >
        Sign in
      </Link>{" "}
      to save your progress.
    </div>
  ) : null;

  const paymentSuccessBanner = showPaymentSuccess ? (
    <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">
      Thanks for subscribing. Let&apos;s capture a quick picture of your operation — about a minute.
    </div>
  ) : null;

  if (step === 3 && snapshot) {
    return (
      <>
        {paymentSuccessBanner}
        {previewBanner}
        <div className="mx-auto max-w-3xl px-4 py-12">
          <InsightGeneratingLoader />
        </div>
      </>
    );
  }

  if (step === 4) {
    return (
      <>
        {paymentSuccessBanner}
        {previewBanner}
        <StepLayout
          step={3}
          totalSteps={TOTAL_STEPS}
          title="Add your first workers"
          description="Start with the people you want to track first. You can add the rest later."
          reassurance="Most teams start with 2–5 workers."
          onBack={() => setStep(2)}
          onNext={async () => {
            try {
              setBusy(true);
              setApiError(null);
              const invalid = filledWorkerRows.find(
                (r) => !r.firstName.trim() || !r.mobileNumber.trim() || !r.hourlyRate.trim()
              );
              if (invalid) {
                setApiError("Each worker needs first name, mobile number, and hourly rate.");
                return;
              }
              await saveWorkers(filledWorkerRows);
              setStep(5);
            } catch (e) {
              setApiError(e instanceof Error ? e.message : "Could not save workers");
            } finally {
              setBusy(false);
            }
          }}
          nextLabel="Continue"
          isLoading={busy}
        >
          {apiError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {apiError}
            </p>
          )}
          <SeedWorkersStep
            rows={workerRows}
            onChange={setWorkerRows}
            onAdd={() => setWorkerRows((prev) => [...prev, createEmptyWorkerRow()])}
          />
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  setBusy(true);
                  setApiError(null);
                  await saveWorkers([]);
                  setStep(5);
                } catch (e) {
                  setApiError(e instanceof Error ? e.message : "Could not skip workers");
                } finally {
                  setBusy(false);
                }
              }}
              disabled={busy}
            >
              Skip for now
            </Button>
          </div>
        </StepLayout>
      </>
    );
  }

  if (step === 5 && snapshot) {
    return (
      <>
        {paymentSuccessBanner}
        {previewBanner}
        <StepLayout
          step={4}
          totalSteps={TOTAL_STEPS}
          title="Your first savings estimate"
          description="Here’s the immediate value you can expect from job-linked labor tracking."
          onBack={() => setStep(4)}
        >
          {apiError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {apiError}
            </p>
          )}
          <SavingsStep
            snapshot={snapshot}
            onBack={() => setStep(4)}
            onEditAnswers={handleEditAnswers}
            onContinue={() => setStep(6)}
            isLoading={busy}
          />
        </StepLayout>
      </>
    );
  }

  if (step === 6 && snapshot) {
    return (
      <>
        {paymentSuccessBanner}
        {previewBanner}
        <StepLayout
          step={6}
          totalSteps={TOTAL_STEPS}
          title="Choose a plan"
          description="We’ll suggest the right plan for your team size."
          onBack={() => setStep(5)}
        >
          {apiError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {apiError}
            </p>
          )}
          <SuggestedPlanStep
            workerCount={workerCountForPlan}
            selectedPlanId={selectedPlanId}
            suggestedPlanId={suggestedPlanId}
            isLoading={busy}
            onChangeSelectedPlan={setSelectedPlanId}
            onContinue={async (planId) => {
              if (isPreview) {
                router.push(routes.public.signup + "?plan=" + encodeURIComponent(planId) + "&next=" + encodeURIComponent(routes.owner.onboarding));
                return;
              }
              setBusy(true);
              setApiError(null);
              try {
                const res = await fetch("/api/stripe/create-checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    planId,
                    cancelPath: `${routes.owner.onboarding}?step=6&plan=${encodeURIComponent(planId)}`,
                  }),
                  credentials: "include",
                });
                const data = await res.json().catch(() => ({} as Record<string, unknown>));
                if (!res.ok) {
                  throw new Error((data as { error?: string }).error ?? "Could not start checkout");
                }
                const url = (data as { url?: string }).url;
                if (!url) throw new Error("No checkout URL returned");
                window.location.href = url;
              } catch (e) {
                setApiError(e instanceof Error ? e.message : "Could not start checkout");
                setBusy(false);
              }
            }}
          />
        </StepLayout>
      </>
    );
  }

  if (step === 7) {
    return (
      <>
        {paymentSuccessBanner}
        {previewBanner}
        <StepLayout
          step={6}
          totalSteps={TOTAL_STEPS}
          title="Add your first jobs"
          description="Set up a few upcoming jobs so your team can start tracking real time immediately."
          onBack={() => setStep(6)}
          onNext={async () => {
            try {
              setBusy(true);
              setApiError(null);
              const invalid = filledJobRows.find((r) => !r.title.trim() || !r.estimatedHours.trim());
              if (invalid) {
                setApiError("Each job needs title and estimated hours.");
                return;
              }
              await saveJobs(filledJobRows);
              setStep(8);
            } catch (e) {
              setApiError(e instanceof Error ? e.message : "Could not save jobs");
            } finally {
              setBusy(false);
            }
          }}
          nextLabel="Finish setup"
          isLoading={busy}
        >
          {apiError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {apiError}
            </p>
          )}
          <SeedJobsStep
            rows={jobRows}
            workers={assignableWorkers}
            onChange={setJobRows}
            onAdd={() => setJobRows((prev) => [...prev, createEmptyJobRow()])}
          />
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  setBusy(true);
                  setApiError(null);
                  await saveJobs([]);
                  setStep(8);
                } catch (e) {
                  setApiError(e instanceof Error ? e.message : "Could not skip jobs");
                } finally {
                  setBusy(false);
                }
              }}
              disabled={busy}
            >
              Skip for now
            </Button>
          </div>
        </StepLayout>
      </>
    );
  }

  if (step === 8 && snapshot) {
    return (
      <>
        {paymentSuccessBanner}
        {previewBanner}
        <StepLayout
          step={7}
          totalSteps={TOTAL_STEPS}
          title="You&apos;re ready to start tracking"
          description="Your first labour snapshot is ready, and your workspace has been set up with the basics so your team can get moving."
        >
          <OnboardingReadyStep
            workersAdded={onboardingAddedWorkerIds.length}
            jobsAdded={jobsAddedCount}
            onGoToDashboard={() => void handleGoToDashboard()}
            onInviteWorkersNow={() => void handleInviteWorkersNow()}
            isLoading={busy}
          />
        </StepLayout>
      </>
    );
  }

  if (step === 1) {
    return (
      <>
        {paymentSuccessBanner}
        {previewBanner}
        <StepLayout
          step={1}
          totalSteps={TOTAL_STEPS}
          title="Tell us about your team"
          description="We'll use this to create your first labor snapshot."
          reassurance="This takes about 60 seconds. You can change this later."
          onNext={() => {
            setApiError(null);
            if (validateTeam()) setStep(2);
          }}
          nextLabel="Continue"
        >
          {apiError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {apiError}
            </p>
          )}
          <TeamBasicsStep value={team} onChange={setTeam} errors={teamErrors} />
        </StepLayout>
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        {paymentSuccessBanner}
        {previewBanner}
        <StepLayout
          step={2}
          totalSteps={TOTAL_STEPS}
          title="How does a normal week usually look?"
          description="Just rough numbers. We'll turn this into an estimated labor picture."
          reassurance="We'll use this to generate your first labor snapshot. You can change this later."
          onBack={() => setStep(1)}
          onNext={() => void handleGenerateInsight()}
          nextLabel="Generate my first insight"
          isLoading={busy}
        >
          {apiError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {apiError}
            </p>
          )}
          <WorkloadBasicsStep value={workload} onChange={setWorkload} errors={workloadErrors} />
        </StepLayout>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-fc-muted">Something went wrong. Please refresh.</p>
      <Button type="button" className="mt-4" onClick={() => setStep(1)}>
        Start over
      </Button>
    </div>
  );
}
