"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { OperationSnapshot } from "@/components/onboarding/OperationSnapshot";
import type { OperationSnapshotData } from "@/components/onboarding/OperationSnapshot";
import { CrewBuilder } from "@/components/onboarding/CrewBuilder";
import { WorkerPreview } from "@/components/onboarding/WorkerPreview";
import { InviteCrew } from "@/components/onboarding/InviteCrew";
import { PayRules } from "@/components/onboarding/PayRules";
import { Button } from "@/components/ui/Button";
import type { Company, CompanySettings } from "@/lib/entities";
import type { Worker } from "@/lib/entities";
import { routes } from "@/lib/routes";
import { Rocket } from "lucide-react";

const TOTAL_STEPS = 5;

interface OnboardingWizardProps {
  initialCompany: Company;
  initialWorkers: Worker[];
}

export function OnboardingWizard({ initialCompany, initialWorkers }: OnboardingWizardProps) {
  const router = useRouter();
  const savedStep = initialCompany.settings?.onboardingStep ?? 0;
  const [step, setStep] = useState(Math.min(savedStep + 1, 6));
  const [company, setCompany] = useState(initialCompany);
  const [workers, setWorkers] = useState(initialWorkers);
  const [saving, setSaving] = useState(false);
  const [step1Data, setStep1Data] = useState<OperationSnapshotData>({
    companyName: company.name,
    workType: (company.workType as OperationSnapshotData["workType"]) ?? "mixed",
    expectedTeamSize: company.expectedTeamSize ?? 5,
    currentTrackingMethod: (company.currentTrackingMethod as OperationSnapshotData["currentTrackingMethod"]) ?? "none",
  });
  const [payRulesData, setPayRulesData] = useState<Partial<CompanySettings>>(company.settings ?? {});

  const refetchWorkers = useCallback(async () => {
    const res = await fetch("/api/onboarding/workers");
    if (res.ok) {
      const data = await res.json();
      setWorkers(data.workers ?? []);
    }
  }, []);

  const saveStep = useCallback(
    async (payload: Record<string, unknown>, stepOverride?: number) => {
      const stepToSave = stepOverride ?? step;
      setSaving(true);
      try {
        const res = await fetch("/api/onboarding/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: stepToSave, payload }),
        });
        if (!res.ok) throw new Error("Save failed");
        const data = await res.json();
        if (data.company) setCompany(data.company);
      } finally {
        setSaving(false);
      }
    },
    [step]
  );

  const handleStep1Next = async (data: { companyName: string; workType: string; expectedTeamSize: number; currentTrackingMethod: string }) => {
    await saveStep({
      companyName: data.companyName,
      workType: data.workType,
      expectedTeamSize: data.expectedTeamSize,
      currentTrackingMethod: data.currentTrackingMethod,
    });
    setStep(2);
  };

  const handleStep5Next = async (settings: Record<string, unknown>) => {
    await saveStep({ settings });
    setStep(6);
  };

  const handleInviteChoice = async (choice: string) => {
    if (choice === "send_later" || choice === "self_onboard") {
      await saveStep({}, 4);
      setStep(5);
    }
  };

  const handleSendInvitesNow = async (): Promise<{ sent: number }> => {
    const toSend = workers.filter((w) => w.inviteStatus !== "sent" && w.inviteStatus !== "accepted");
    if (toSend.length === 0) return { sent: 0 };
    await fetch("/api/invite/createTokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerIds: toSend.map((w) => w.id) }),
    });
    let sent = 0;
    for (const w of toSend) {
      const res = await fetch("/api/invite/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId: w.id }),
      });
      if (res.ok) sent++;
    }
    await refetchWorkers();
    return { sent };
  };

  const handleLaunch = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding/complete", { method: "POST" });
      if (!res.ok) throw new Error("Complete failed");
      router.push(routes.owner.home);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  if (step === 6) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl border border-fc-accent bg-fc-accent/5 p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-fc-brand">
            Launch Command Dashboard
          </h1>
          <p className="mt-2 text-fc-muted">
            You’re set. Your crew list will appear on the dashboard — invite links can be sent anytime from Workers.
          </p>
          <Button
            className="mt-6"
            onClick={handleLaunch}
            disabled={saving}
          >
            <Rocket className="mr-2 h-4 w-4" />
            {saving ? "Launching…" : "Go to dashboard"}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <StepLayout
        step={1}
        totalSteps={TOTAL_STEPS}
        title="Operation Snapshot"
        description="Quick profile so we can tailor your setup."
        onNext={async () => {
          await handleStep1Next(step1Data);
        }}
        nextLabel="Next"
        isLoading={saving}
      >
        <OperationSnapshot
          initial={step1Data}
          onChange={setStep1Data}
        />
      </StepLayout>
    );
  }

  if (step === 2) {
    return (
      <StepLayout
        step={2}
        totalSteps={TOTAL_STEPS}
        title="Build Your Active Crew"
        description="Add workers and pay rules. You can edit or remove anyone before sending invites."
        onBack={() => setStep(1)}
        onNext={async () => {
          await saveStep({}, 2);
          setStep(3);
        }}
        nextLabel="Next"
        isLoading={saving}
      >
        <CrewBuilder
          companyId={company.id}
          expectedTeamSize={company.expectedTeamSize ?? 5}
          workers={workers}
          onWorkersChange={refetchWorkers}
        />
      </StepLayout>
    );
  }

  if (step === 3) {
    return (
      <StepLayout
        step={3}
        totalSteps={TOTAL_STEPS}
        title="Worker Experience Preview"
        description="See what your crew will use in the field."
        onBack={() => setStep(2)}
        onNext={async () => {
          await saveStep({}, 3);
          setStep(4);
        }}
        nextLabel="Next"
        isLoading={saving}
      >
        <WorkerPreview />
      </StepLayout>
    );
  }

  if (step === 4) {
    return (
      <StepLayout
        step={4}
        totalSteps={TOTAL_STEPS}
        title="Turn Your Crew Live"
        description="Send SMS invites or do it later from the dashboard."
        onBack={() => setStep(3)}
        onNext={async () => {
          await saveStep({}, 4);
          setStep(5);
        }}
        nextLabel="Continue to pay rules"
      >
        <InviteCrew
          workers={workers}
          onChoice={handleInviteChoice}
          onSendNow={handleSendInvitesNow}
          onContinue={() => setStep(5)}
        />
      </StepLayout>
    );
  }

  if (step === 5) {
    return (
      <StepLayout
        step={5}
        totalSteps={TOTAL_STEPS}
        title="Pay Rules & Tracking Preferences"
        description="Set overtime thresholds and what you require on clock-in/out."
        onBack={() => setStep(4)}
        onNext={async () => {
          await handleStep5Next(payRulesData);
        }}
        nextLabel="Launch dashboard"
        isLoading={saving}
      >
        <PayRules
          initial={company.settings}
          onChange={setPayRulesData}
        />
      </StepLayout>
    );
  }

  return null;
}
