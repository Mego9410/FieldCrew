"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRightLeft, Clock3, DollarSign } from "lucide-react";
import { HeroViewSwitcher } from "@/components/landing/HeroViewSwitcher";
import { CountUp } from "@/components/ui/CountUp";
import { routes } from "@/lib/routes";

type InfoCard = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
};

const problemCards: InfoCard[] = [
  {
    icon: Clock3,
    title: "Jobs that were meant to be 4 hours... turning into 6+",
    text: "The estimate looked right. The job did not.",
  },
  {
    icon: AlertTriangle,
    title: "Overtime used to fix a schedule that's already behind",
    text: "You're not planning overtime - you're reacting to it.",
  },
  {
    icon: DollarSign,
    title: "Payroll full of hours you can't tie to any job",
    text: "Time gets logged, but no one knows where it actually went.",
  },
];

const workflowCards: InfoCard[] = [
  {
    icon: ArrowRightLeft,
    title: "See exactly which jobs are running over and by how much",
    text: "No guessing. No it felt like a long job.",
  },
  {
    icon: ArrowRightLeft,
    title: "Spot the techs, job types, and estimates causing the overruns",
    text: "Not all jobs leak. This shows you which ones do.",
  },
  {
    icon: ArrowRightLeft,
    title: "Fix the root cause, not just the symptom",
    text: "Adjust quotes, scheduling, or staffing using real data.",
  },
];

const costCards = [
  { techs: "5 techs", loss: 15000 },
  { techs: "10 techs", loss: 30000 },
  { techs: "15 techs", loss: 44000 },
  { techs: "30 techs", loss: 89000 },
];

function StaggerCard({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HvacSolutionsContent() {
  return (
    <main id="main" className="border-b border-fc-border bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-fc-accent">
              Solutions · HVAC
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-fc-brand sm:text-4xl lg:text-5xl">
              Built for HVAC teams that are busy... but still losing money on jobs
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-700">
              FieldCrew shows you exactly where labor hours slip, where overtime gets created, and
              which jobs are quietly killing your margin.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={routes.public.sampleReport}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-fc-accent-dark"
              >
                See a real labor profit report
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-fc-brand hover:bg-slate-100"
              >
                How it works
              </Link>
            </div>
          </div>

          <motion.div
            className="relative rounded-3xl border border-slate-300/80 bg-slate-100/70 p-3 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="pointer-events-none absolute -right-2 top-4 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700 shadow-sm">
              + overtime
            </div>
            <div className="pointer-events-none absolute -left-2 bottom-6 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-700 shadow-sm">
              + 1.3 hrs
            </div>
            <motion.div
              className="pointer-events-none absolute right-8 top-8 h-2.5 w-2.5 rounded-full bg-fc-accent"
              animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.25, 1] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            />
            <HeroViewSwitcher />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            Where HVAC companies actually lose money every week
          </h2>
          <p className="mt-2 text-slate-600">
            Not in theory - in the jobs you&apos;re running right now.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {problemCards.map((card, i) => (
              <StaggerCard
                key={card.title}
                index={i}
                className="group rounded-2xl border border-slate-300 bg-slate-100 p-5 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.5)] transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_34px_-22px_rgba(15,23,42,0.55)]"
              >
                <card.icon className="h-5 w-5 text-fc-accent" />
                <h3 className="mt-3 font-display text-lg font-semibold text-fc-brand">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-700">{card.text}</p>
              </StaggerCard>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
              The pattern most HVAC owners miss
            </h2>
            <div className="mt-4 space-y-4 text-slate-700">
              <p>You are not losing money on one bad job.</p>
              <p>You are losing it across dozens of slightly over jobs:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>20-30 minutes over on installs.</li>
                <li>Service calls running longer than quoted.</li>
                <li>Jobs finishing late, pushing the next job, triggering overtime.</li>
              </ul>
              <p>
                Individually, they do not look like a problem. Together, they destroy your margin.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-5 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.5)]"
          >
            {[
              { label: "Job 1", value: "+25 min" },
              { label: "Job 2", value: "+40 min" },
              { label: "Job 3", value: "+30 min" },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm"
              >
                <span className="font-medium text-fc-brand">{row.label}</span>
                <span className="font-semibold text-orange-700">{row.value}</span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.35 }}
              className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3"
            >
              <p className="text-xs uppercase tracking-wider text-orange-800">Combined</p>
              <p className="mt-1 font-display text-xl font-bold text-orange-700">+6.5 hours this week</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            What this is actually costing you
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {costCards.map((card, i) => (
              <StaggerCard
                key={card.techs}
                index={i}
                className="group rounded-2xl border border-slate-300 bg-slate-100 p-5 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.5)] transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_34px_-22px_rgba(15,23,42,0.55)]"
              >
                <p className="text-sm font-semibold text-fc-brand">{card.techs}</p>
                <p className="mt-2 font-display text-3xl font-bold text-fc-brand">
                  ~
                  <CountUp value={card.loss} prefix="$" trigger={true} />
                  /year lost
                </p>
                <div className="mt-3 h-1.5 w-20 rounded-full bg-fc-accent/85" />
              </StaggerCard>
            ))}
          </div>
          <p className="mt-4 text-slate-600">
            Most of this comes from small overruns and overtime, not big mistakes.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            What changes once you can actually see the problem
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {workflowCards.map((card, i) => (
              <StaggerCard
                key={card.title}
                index={i}
                className="group rounded-2xl border border-slate-300 bg-slate-100 p-5 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.5)] transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_34px_-22px_rgba(15,23,42,0.55)]"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  Before -&gt; After
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-fc-brand">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-700">{card.text}</p>
              </StaggerCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-300 bg-slate-100 px-6 py-8 text-center shadow-[0_18px_34px_-24px_rgba(15,23,42,0.5)] sm:px-10">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            See where your labor profit is leaking
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-700">
            Get a real example of how HVAC companies are losing margin and how FieldCrew finds it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={routes.public.sampleReport}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-fc-accent-dark"
            >
              See a sample report
            </Link>
            <Link
              href={routes.owner.subscribe}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-fc-brand hover:bg-slate-100"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
