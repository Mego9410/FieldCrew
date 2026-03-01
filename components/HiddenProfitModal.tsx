"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  calculateLeakage,
  DEFAULT_LEAKAGE_INPUTS,
  type LeakageInputs,
  type LeakageOutputs,
} from "@/lib/leakageCalculator";
import { track } from "@/lib/tracking";
import { SampleProfitReport } from "./SampleProfitReport";

const INPUT_LABELS: Record<keyof LeakageInputs, string> = {
  techs: "Number of field techs",
  hourlyWage: "Avg hourly wage ($/hr)",
  billableRate: "Avg billable rate ($/hr)",
  otHoursPerTechPerWeek: "Avg overtime hours per tech / week",
  untrackedHoursPerTechPerWeek: "Untracked hours per tech / week",
  jobOverrunRate: "Job overrun rate (% of jobs)",
  avgOverrunHours: "Avg overrun hours per overrun job",
  jobsPerTechPerWeek: "Jobs per tech per week",
};

interface HiddenProfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditUrl?: string;
}

export function HiddenProfitModal({
  isOpen,
  onClose,
  auditUrl = "/book",
}: HiddenProfitModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [inputs, setInputs] = useState<LeakageInputs>(DEFAULT_LEAKAGE_INPUTS);
  const [outputs, setOutputs] = useState<LeakageOutputs | null>(null);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCheckbox, setLeadCheckbox] = useState(false);
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  const runCalculation = useCallback(() => {
    const result = calculateLeakage(inputs);
    setOutputs(result);
    track("hidden_profit_calculated", {
      total: result.totalRecoverableProfit,
      techs: inputs.techs,
    });
    return result;
  }, [inputs]);

  useEffect(() => {
    if (!isOpen) return;
    runCalculation();
  }, [isOpen, runCalculation]);

  useEffect(() => {
    if (!isOpen) return;
    previousActiveRef.current = document.activeElement as HTMLElement | null;
    const focusable =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const el = modalRef.current;
    if (!el) return;
    const focusableElements = el.querySelectorAll<HTMLElement>(focusable);
    const first = focusableElements[0];
    if (first) first.focus();
    return () => {
      if (previousActiveRef.current?.focus) previousActiveRef.current.focus();
    };
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleInputChange = (key: keyof LeakageInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = leadEmail.trim();
    if (!email) return;
    setLeadStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "hidden_profit",
          inputs,
          outputs: outputs ?? undefined,
          isHvacOwnerManager: leadCheckbox,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit");
      }
      track("hidden_profit_lead_submitted", { email });
      setLeadStatus("success");
    } catch {
      setLeadStatus("error");
    }
  };

  const handleSeeReport = () => {
    if (!outputs) runCalculation();
    setOutputs((prev) => prev ?? calculateLeakage(inputs));
    setStep(2);
    track("hidden_profit_report_viewed");
  };

  const handlePrint = () => {
    track("hidden_profit_download_clicked");
    window.print();
  };

  const handleAuditClick = () => {
    track("hidden_profit_audit_clicked");
  };

  if (!isOpen) return null;

  const currentOutputs = outputs ?? calculateLeakage(inputs);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hidden-profit-modal-title"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="my-8 w-full max-w-2xl rounded-lg border border-slate-200/60 bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200/60 px-4 py-3 flex items-center justify-between">
          <h1 id="hidden-profit-modal-title" className="font-display text-lg font-bold text-fc-brand">
            {step === 1 ? "How Much Labour Profit Are You Losing?" : "Sample Monthly Labour Profit Report"}
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-fc-brand focus:outline-none focus:ring-2 focus:ring-fc-accent"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-4 print:max-h-none print:overflow-visible">
          {step === 1 ? (
            <>
              <p className="text-sm text-slate-600">
                Estimate hidden labour leakage from overtime, untracked time, and job overruns.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["techs", 1, 200],
                    ["hourlyWage", 10, 150],
                    ["billableRate", 50, 400],
                    ["otHoursPerTechPerWeek", 0, 30],
                    ["untrackedHoursPerTechPerWeek", 0, 10],
                    ["jobOverrunRate", 0, 100],
                    ["avgOverrunHours", 0, 10],
                    ["jobsPerTechPerWeek", 1, 100],
                  ] as const
                ).map(([key, min, max]) => (
                  <label key={key} className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      {INPUT_LABELS[key]}
                    </span>
                    <input
                      type="number"
                      min={min}
                      max={max}
                      step={key === "jobOverrunRate" ? 1 : key === "hourlyWage" || key === "billableRate" ? 1 : 0.1}
                      value={inputs[key]}
                      onChange={(e) => {
                        const v = e.target.valueAsNumber;
                        if (!Number.isNaN(v)) handleInputChange(key, v);
                      }}
                      className="mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                    />
                  </label>
                ))}
              </div>

              <p className="mt-4 text-xs text-slate-500">
                OT premium = 0.5 × wage (time-and-a-half). 4.33 weeks per month.
              </p>

              <div className="mt-6 rounded-md border border-slate-200/60 bg-slate-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Estimated monthly labour leakage
                </p>
                <p className="mt-1 text-2xl font-bold text-fc-brand">
                  {currentOutputs.formatted.totalRecoverableProfit}
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded border border-slate-200/60 bg-white p-3 text-sm">
                    <span className="text-slate-500">Overtime premium</span>
                    <p className="font-semibold text-fc-brand">{currentOutputs.formatted.overtimePremiumWaste}</p>
                  </div>
                  <div className="rounded border border-slate-200/60 bg-white p-3 text-sm">
                    <span className="text-slate-500">Untracked time</span>
                    <p className="font-semibold text-fc-brand">{currentOutputs.formatted.untrackedTimeRevenue}</p>
                  </div>
                  <div className="rounded border border-slate-200/60 bg-white p-3 text-sm">
                    <span className="text-slate-500">Job overrun waste</span>
                    <p className="font-semibold text-fc-brand">{currentOutputs.formatted.jobOverrunWaste}</p>
                  </div>
                </div>
              </div>

              {showLeadCapture ? (
                <div className="mt-6 rounded-md border border-slate-200/60 bg-white p-4">
                  <h3 className="text-sm font-semibold text-fc-brand">Email me this report</h3>
                  {leadStatus === "success" ? (
                    <p className="mt-2 text-sm text-green-700">Thanks. We’ll send the report to this address.</p>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="mt-3 space-y-3">
                      <input
                        type="email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                      />
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={leadCheckbox}
                          onChange={(e) => setLeadCheckbox(e.target.checked)}
                          className="rounded border-slate-300 text-fc-accent focus:ring-fc-accent"
                        />
                        I’m an HVAC owner/manager
                      </label>
                      {leadStatus === "error" && (
                        <p className="text-sm text-red-600">Something went wrong. Try again.</p>
                      )}
                      <button
                        type="submit"
                        disabled={leadStatus === "loading"}
                        className="rounded-md bg-fc-accent px-4 py-2 text-sm font-semibold text-white hover:bg-fc-accent-dark disabled:opacity-50"
                      >
                        {leadStatus === "loading" ? "Sending…" : "Submit"}
                      </button>
                    </form>
                  )}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSeeReport}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-fc-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-fc-accent-dark focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
                >
                  See a Real Example Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadCapture(true)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-fc-brand hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
                >
                  Email me this report
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2"
                >
                  Not now
                </button>
              </div>
            </>
          ) : (
            <>
              <SampleProfitReport
                userEstimate={currentOutputs}
                auditUrl={auditUrl}
                onAuditClick={handleAuditClick}
                onDownloadClick={handlePrint}
              />
              <div className="mt-4 print:hidden">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-slate-600 underline hover:text-fc-brand"
                >
                  ← Back to calculator
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
