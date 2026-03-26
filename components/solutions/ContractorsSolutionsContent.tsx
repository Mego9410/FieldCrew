"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarClock,
  Clock3,
  DollarSign,
  Briefcase,
  Settings,
  FileSpreadsheet,
} from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { routes } from "@/lib/routes";

type CardItem = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
};

const outcomes: CardItem[] = [
  {
    icon: Clock3,
    title: "Jobs regularly take longer than planned",
    text: "What was scheduled as a 2-hour job turns into 3-4, and no one flags it.",
  },
  {
    icon: CalendarClock,
    title: "The schedule gets rebuilt in real-time",
    text: "One job runs long, everything shifts, and the whole day gets reactive.",
  },
  {
    icon: DollarSign,
    title: "Payroll does not match what you expected",
    text: "Hours get logged, but it is unclear which jobs actually caused them.",
  },
];

const roleFit: CardItem[] = [
  {
    icon: Briefcase,
    title: "Owners: See where profit is actually leaking",
    text: "Weekly visibility into which jobs, teams, and patterns are costing you money.",
  },
  {
    icon: Settings,
    title: "Operations leads: Understand what is breaking the schedule",
    text: "See which jobs and patterns are causing delays and overtime.",
  },
  {
    icon: FileSpreadsheet,
    title: "Office / payroll: Finally connect hours to jobs",
    text: "Clear link between time worked and where it was spent.",
  },
];

const annualImpact = [
  { label: "Small team", value: "~$15k/year lost" },
  { label: "Mid team", value: "~$30k-$70k/year lost" },
  { label: "Larger team", value: "$80k+" },
];

function Stagger({
  index,
  className,
  children,
}: {
  index: number;
  className: string;
  children: React.ReactNode;
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

export function ContractorsSolutionsContent() {
  return (
    <main id="main" className="border-b border-fc-border bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-fc-accent">
            Solutions · Contractors
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-bold leading-tight text-fc-brand sm:text-4xl lg:text-5xl">
            Built for ops teams dealing with jobs running over and schedules falling apart
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-700">
            FieldCrew connects what happens in the field to what shows up in payroll so you can see
            exactly where time is going, where jobs are slipping, and what is causing it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={routes.public.sampleReport}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-fc-accent-dark"
            >
              See a real labour report
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-fc-brand hover:bg-slate-100"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            What actually goes wrong in day-to-day operations
          </h2>
          <p className="mt-2 text-slate-600">
            And why it is hard to fix without real data.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {outcomes.map((card, i) => (
              <Stagger
                key={card.title}
                index={i}
                className="group rounded-2xl border border-slate-300 bg-slate-100 p-5 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.5)] transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_34px_-22px_rgba(15,23,42,0.55)]"
              >
                <card.icon className="h-5 w-5 text-fc-accent" />
                <h3 className="mt-3 font-display text-lg font-semibold text-fc-brand">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-700">{card.text}</p>
              </Stagger>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
              How a normal week turns into overtime
            </h2>
            <div className="mt-4 space-y-4 text-slate-700">
              <p>Monday starts on schedule.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>A job runs 30 minutes over.</li>
                <li>Next job starts late.</li>
                <li>Tech finishes after hours.</li>
              </ul>
              <p>By Wednesday:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Multiple jobs are behind.</li>
                <li>Dispatch is constantly adjusting.</li>
                <li>Overtime starts creeping in.</li>
              </ul>
              <p>By Friday: You are paying for a week that did not go to plan.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-5 shadow-[0_18px_36px_-24px_rgba(15,23,42,0.5)]"
          >
            <div className="grid grid-cols-5 gap-2">
              {[
                { day: "Mon", add: "+30 min" },
                { day: "Tue", add: "+45 min" },
                { day: "Wed", add: "+1.5 hrs" },
                { day: "Thu", add: "" },
                { day: "Fri", add: "" },
              ].map((item, i) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-center"
                >
                  <p className="text-xs font-semibold text-fc-brand">{item.day}</p>
                  <p className="mt-2 text-[11px] font-medium text-orange-700">{item.add || "-"}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.36, duration: 0.35 }}
              className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3"
            >
              <p className="text-xs uppercase tracking-wider text-orange-800">Weekly total</p>
              <p className="mt-1 font-display text-xl font-bold text-orange-700">+8.2 overtime hours</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-xl font-bold text-fc-brand">
            What this looks like in real numbers
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {annualImpact.map((item, i) => (
              <Stagger
                key={item.label}
                index={i}
                className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-4"
              >
                <p className="text-sm font-semibold text-fc-brand">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-slate-800">{item.value}</p>
              </Stagger>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            What each role actually gets from this
          </h2>
          <div className="mt-6 grid gap-0 overflow-hidden rounded-2xl border border-slate-300 bg-slate-100 md:grid-cols-3">
            {roleFit.map((item, i) => (
              <Stagger
                key={item.title}
                index={i}
                className={`p-5 ${i < roleFit.length - 1 ? "border-b border-slate-300 md:border-b-0 md:border-r" : ""}`}
              >
                <item.icon className="h-5 w-5 text-fc-accent" />
                <h3 className="mt-3 font-display text-lg font-semibold text-fc-brand">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-700">{item.text}</p>
              </Stagger>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-300 bg-slate-100 px-6 py-8 text-center shadow-[0_18px_34px_-24px_rgba(15,23,42,0.5)] sm:px-10">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            Stop guessing where the time went
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-700">
            See exactly how labour hours turn into cost and what is causing it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={routes.public.sampleReport}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-fc-accent-dark"
            >
              View sample report
            </Link>
            <Link
              href={routes.public.signup}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-fc-brand hover:bg-slate-100"
            >
              Get started
            </Link>
          </div>
          <div className="mt-5 text-sm text-slate-600">
            Weekly overtime tracked:{" "}
            <span className="font-semibold text-fc-brand">
              <CountUp value={8.2} decimals={1} trigger={true} suffix=" hrs" />
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
