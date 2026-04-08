"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  Link2,
  BarChart3,
  FileSpreadsheet,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";
import { PricingSection4 } from "@/components/landing/PricingSection4";
import { isPlanId, type PlanId } from "@/lib/pricing-plans";
import { cn } from "@/lib/utils";

type ProofCard = {
  icon: LucideIcon;
  title: string;
  paragraphs: string[];
};

const CORE_WORKFLOW_CARDS: ProofCard[] = [
  {
    icon: ClipboardCheck,
    title: "Every hour is tied to a job — automatically",
    paragraphs: [
      "If a worker clocks in, they have to select a job.",
      "No “loose hours”, no guessing where time went.",
    ],
  },
  {
    icon: Link2,
    title: "Your team actually uses it (no app, no passwords)",
    paragraphs: ["Clock in from a text. No downloads, no logins, no friction."],
  },
  {
    icon: BarChart3,
    title: "See which jobs are making money — and which aren’t",
    paragraphs: [
      "Labor hours and cost, broken down per job.",
      "No spreadsheets, no digging.",
    ],
  },
];

const WEEKLY_CONTROL_CARDS: ProofCard[] = [
  {
    icon: FileSpreadsheet,
    title: "Payroll that actually matches what happened in the field",
    paragraphs: [
      "Export clean, job-linked labor data.",
      "No fixing timesheets at the end of the week.",
    ],
  },
  {
    icon: Mail,
    title: "A weekly report you’ll actually read",
    paragraphs: [
      "“Last week’s labor by job.”",
      "Simple, clear, and immediately useful.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "Catch problems before they hit payroll",
    paragraphs: [
      "Flags overlapping shifts, long days, and missing clock-outs before they cost you money.",
    ],
  },
];

function PrimaryProofCard({ icon: Icon, title, paragraphs }: ProofCard) {
  return (
    <li>
      <div
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-fc-border bg-white p-8 shadow-fc-sm transition-all duration-300 ease-out sm:p-9",
          "hover:-translate-y-1.5 hover:border-fc-accent/45 hover:shadow-fc-md",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-fc-accent/55 before:to-transparent",
        )}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-fc-accent/[0.09] blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-80"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-fc-accent/[0.04] group-hover:ring-fc-accent/10 transition-[box-shadow] duration-300"
          aria-hidden
        />
        <span
          className={cn(
            "relative z-[1] inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fc-accent text-white shadow-md ring-1 ring-black/[0.06] transition-all duration-300",
            "group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-fc-accent/20 group-hover:ring-fc-accent/30",
          )}
          aria-hidden
        >
          <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
        </span>
        <h4 className="relative z-[1] mt-6 font-display text-xl font-bold leading-snug tracking-tight text-fc-brand sm:text-2xl">
          {title}
        </h4>
        <div className="relative z-[1] mt-4 space-y-2 text-sm leading-snug text-fc-muted sm:text-[0.9375rem] sm:leading-relaxed">
          {paragraphs.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </div>
    </li>
  );
}

function SecondaryProofCard({ icon: Icon, title, paragraphs }: ProofCard) {
  return (
    <li>
      <div
        className={cn(
          "group flex h-full flex-col rounded-xl border border-fc-border/90 bg-fc-surface-muted/35 p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-300 ease-out sm:p-6",
          "hover:-translate-y-0.5 hover:border-fc-accent/30 hover:bg-fc-surface-muted/55 hover:shadow-fc-sm",
        )}
      >
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fc-accent text-white shadow-sm ring-1 ring-black/[0.05] transition-all duration-300",
            "group-hover:scale-[1.04] group-hover:shadow-md group-hover:ring-fc-accent/25",
          )}
          aria-hidden
        >
          <Icon className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5" strokeWidth={2} aria-hidden />
        </span>
        <h4 className="mt-4 font-display text-base font-bold leading-snug text-fc-brand sm:text-lg">
          {title}
        </h4>
        <div className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-fc-muted">
          {paragraphs.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </div>
    </li>
  );
}

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string>("STARTER9");
  const autoStarted = useRef(false);

  const handleSelectPlan = useCallback(async (planId: PlanId) => {
    setError(null);
    setLoadingPlan(planId);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        const next = `/subscribe?plan=${planId}`;
        window.location.href = `${routes.public.signup}?plan=${planId}&next=${encodeURIComponent(next)}`;
        return;
      }
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, promoCode }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          res.status === 401
            ? "Please sign in to continue to checkout."
            : (data.error ?? "Something went wrong");
        setError(message);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Failed to start checkout");
    } finally {
      setLoadingPlan(null);
    }
  }, [promoCode]);

  useEffect(() => {
    const plan = searchParams.get("plan")?.toLowerCase();
    if (autoStarted.current || !plan || !isPlanId(plan)) return;

    let cancelled = false;
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (cancelled || !session) return;
        autoStarted.current = true;
        handleSelectPlan(plan);
      });
    return () => {
      cancelled = true;
    };
  }, [searchParams, handleSelectPlan]);

  return (
    <>
      <PricingSection4
        variant="subscribe"
        loadingPlanId={loadingPlan}
        onSelectPlan={handleSelectPlan}
        error={error}
        promoCode={promoCode}
        onPromoCodeChange={setPromoCode}
        onPromoCodeClear={() => setPromoCode("")}
      />

      <section
        id="features"
        className="border-t border-fc-border bg-white py-14 sm:py-20"
        aria-labelledby="pricing-included-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="fc-accent-stripe mx-auto mb-3 block" aria-hidden />
            <h2
              id="pricing-included-heading"
              className="mt-6 font-display text-2xl font-bold tracking-tight text-fc-brand sm:mt-8 sm:text-3xl lg:text-4xl"
            >
              Built to work in real HVAC teams — not just look good on paper
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-fc-muted sm:text-lg">
              No complex setup. No behaviour change battles. Just a system your
              team will actually use.
            </p>
          </div>

          <div className="mt-14 sm:mt-16">
            <h3
              id="core-workflow-label"
              className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-fc-accent"
            >
              Core workflow
            </h3>
            <ul
              className="mt-5 grid grid-cols-1 gap-6 md:mt-6 md:grid-cols-3 md:gap-7 lg:gap-8"
              aria-labelledby="core-workflow-label"
            >
              {CORE_WORKFLOW_CARDS.map((card) => (
                <PrimaryProofCard key={card.title} {...card} />
              ))}
            </ul>
          </div>

          <div className="mt-16 sm:mt-20 lg:mt-24">
            <h3
              id="weekly-control-label"
              className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-fc-accent/90"
            >
              Weekly control
            </h3>
            <ul
              className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5"
              aria-labelledby="weekly-control-label"
            >
              {WEEKLY_CONTROL_CARDS.map((card) => (
                <SecondaryProofCard key={card.title} {...card} />
              ))}
            </ul>
          </div>

          <div className="mx-auto mt-16 max-w-3xl sm:mt-20 lg:mt-24">
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-fc-accent/20 bg-gradient-to-b from-fc-accent/[0.07] via-fc-surface-muted/60 to-fc-surface-muted/90 px-6 py-9 text-center shadow-fc-sm sm:px-10 sm:py-10",
                "ring-1 ring-fc-accent/10",
              )}
            >
              <div
                className="pointer-events-none absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-fc-accent/10 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-fc-accent/15 blur-2xl"
                aria-hidden
              />
              <div className="relative">
                <h3 className="font-display text-xl font-bold tracking-tight text-fc-brand sm:text-2xl">
                  This isn&apos;t time tracking. It&apos;s job-based labor
                  clarity.
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fc-muted sm:text-lg">
                  Most tools track hours. FieldCrew shows you what those hours
                  actually mean for your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
