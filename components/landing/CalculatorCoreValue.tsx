"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

function LossPreviewCard() {
  return (
    <div className="overflow-hidden rounded-[var(--fc-radius)] border border-fc-navy-800 bg-white shadow-fc-sm">
      <div className="bg-fc-surface-muted px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-fc-muted">
          Estimated monthly loss
        </p>
      </div>
      <div className="px-5 py-6">
        <p className="fc-display-number text-4xl font-extrabold text-fc-brand tabular-nums">
          $4,280
        </p>
        <div className="mt-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold text-fc-muted">
              Loss from under-quoting
            </p>
            <p className="font-display text-xl font-extrabold text-fc-orange-500 tabular-nums">
              $3,100
            </p>
          </div>
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold text-fc-muted">
              Loss from overtime spillover
            </p>
            <p className="font-display text-xl font-extrabold text-fc-orange-500 tabular-nums">
              $1,180
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-fc-border bg-fc-surface-muted/40 px-4 py-3">
          <p className="text-xs font-semibold text-fc-brand">
            What you'll enter:
          </p>
          <ul className="mt-2 space-y-2 text-sm text-fc-muted">
            <li>Number of techs</li>
            <li>Average hourly labor cost</li>
            <li>Jobs per week</li>
            <li>Overtime hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function CalculatorCoreValue() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="pricing"
      className="border-b border-fc-border bg-white py-14 sm:py-20 lg:py-24"
      aria-labelledby="calculator-core-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="calculator-core-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            In 60 Seconds, See Your Number
          </h2>
        </ScrollReveal>

        <motion.div
          className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-center"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Left: value + CTA */}
          <div className="space-y-6">
            <p className="text-lg text-fc-muted fc-body-air">
              Answer a few simple questions and FieldCrew will estimate how
              much profit may be leaking from under-quoted labor and overtime.
            </p>

            <div className="rounded-[var(--fc-radius)] border-2 border-fc-accent/30 bg-fc-surface-muted/30 px-6 py-6">
              <p className="font-display text-sm font-bold uppercase tracking-wider text-fc-muted">
                Quick estimate inputs
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Number of techs",
                  "Avg hourly labor cost",
                  "Jobs per week",
                  "Overtime hours",
                ].map((label) => (
                  <div
                    key={label}
                    className="rounded-lg border border-fc-border bg-white px-4 py-3"
                  >
                    <p className="text-xs font-semibold text-fc-muted">
                      {label}
                    </p>
                    <div className="mt-2 h-6 w-full rounded border border-fc-border bg-slate-50/70" />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-fc-muted">
                Enter your numbers on the calculator page.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3">
              <MagneticButton
                href="/profit-leak"
                variant="primary"
                className="w-full sm:w-auto"
              >
                Calculate My Profit Leak
              </MagneticButton>
              <p className="text-sm text-fc-muted">
                No demo required. No complicated setup.
              </p>
            </div>

            <p className="text-sm text-fc-muted">
              Want context first?{" "}
              <Link
                href="/sample-report"
                className="font-semibold text-fc-accent underline decoration-fc-accent underline-offset-4 hover:no-underline focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-white rounded"
              >
                See a sample report
              </Link>
              .
            </p>
          </div>

          {/* Right: preview card */}
          <div className="relative">
            <div className="absolute -inset-2 -z-10 rounded-[var(--fc-radius)] bg-fc-accent/10 blur-2xl" />
            <LossPreviewCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

