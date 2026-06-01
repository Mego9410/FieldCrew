"use client";

import Link from "next/link";
import { Check, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

const PLANS = [
  {
    name: "Starter",
    work: "For solo + small crews",
    price: 49,
    hot: false,
    features: ["Up to 5 technicians", "Quoted vs actual tracking", "Labor cost per job", "QuickBooks-ready exports", "Email support"],
  },
  {
    name: "Growth",
    work: "For growing shops",
    price: 89,
    hot: true,
    features: [
      "Up to 15 technicians",
      "Everything in Starter",
      "Overrun + overtime alerts",
      "Weekly profit pulse",
      "Margin status dashboard",
      "Priority support",
    ],
  },
  {
    name: "Pro",
    work: "For multi-crew operations",
    price: 149,
    hot: false,
    features: ["Unlimited technicians", "Everything in Growth", "Project + multi-job rollups", "Advanced reporting", "Dedicated onboarding"],
  },
] as const;

export function InstrumentPricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-fc-navy-950 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.18) 0%, transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 text-white fc-blueprint-grid" aria-hidden style={{ opacity: 0.06 }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-12">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-fc-orange-500/50 bg-fc-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-fc-orange-500">
            <Tag className="h-3.5 w-3.5" aria-hidden />
            First month $9
          </span>
          <h2 className="mt-5 font-display text-[clamp(2.1rem,3vw+1rem,3.3rem)] font-extrabold tracking-[-0.03em] leading-[1.06] text-white">
            Get your first month for $9
          </h2>
          <p className="mt-5 text-[19px] leading-7 text-slate-400">
            Find your leak before you pay full price. Cancel anytime — most owners recover the subscription in the
            first week.
          </p>
        </header>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.3fr_0.85fr] lg:items-center">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[var(--fc-radius-lg)] border px-8 py-8",
                "bg-fc-navy-900/55 backdrop-blur-sm",
                p.hot ? "border-fc-orange-500/70 shadow-[0_0_0_1px_rgba(249,115,22,0.3),var(--fc-shadow-panel-lg)]" : "border-white/15",
              )}
            >
              {p.hot ? (
                <>
                  <div
                    className="absolute left-0 right-0 top-0 h-[3px]"
                    style={{ background: "linear-gradient(90deg, var(--fc-accent), #fbbf24)" }}
                    aria-hidden
                  />
                  <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fc-orange-500">
                    ★ Most companies choose this
                  </div>
                </>
              ) : null}

              <div className="font-display text-[22px] font-bold tracking-[-0.02em] text-white">{p.name}</div>
              <div className="mt-1 text-sm text-slate-400">{p.work}</div>

              <div className="mt-6 font-display text-[52px] font-extrabold tracking-[-0.04em] text-white tabular-nums">
                ${p.price}
                <span className="ml-1 text-[17px] font-medium tracking-normal text-slate-400">/mo</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-fc-orange-500">
                $9 first month <span className="font-medium text-slate-400">then ${p.price}/mo</span>
              </div>

              <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm text-slate-200">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 leading-6">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-fc-orange-500" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={routes.owner.subscribe}
                className={cn(
                  "mt-8 inline-flex min-h-[50px] w-full items-center justify-center rounded-full text-[15px] font-bold transition focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950",
                  p.hot
                    ? "bg-fc-orange-500 text-fc-navy-950 hover:bg-fc-orange-600"
                    : "border border-white/20 bg-white/5 text-white hover:bg-white/10",
                )}
              >
                {p.hot ? "Start Growth for $9" : `Choose ${p.name}`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

