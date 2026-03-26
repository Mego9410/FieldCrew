"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Clock3, FileClock, CalendarRange } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { routes } from "@/lib/routes";

type Card = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
};

const whyCards: Card[] = [
  {
    icon: ClipboardList,
    title: "Everything lives in your head (or scattered notes)",
    text: "You know which jobs ran long, but there is no system tracking it.",
  },
  {
    icon: Clock3,
    title: "There is no time to review jobs properly",
    text: "By the time the week ends, you are already onto the next one.",
  },
  {
    icon: FileClock,
    title: "Payroll just is what it is",
    text: "You pay it, but do not always know which jobs caused it.",
  },
];

const workflowCards: Card[] = [
  {
    icon: CalendarRange,
    title: "See where your time actually went this week",
    text: "No spreadsheets. No chasing people for answers.",
  },
  {
    icon: CalendarRange,
    title: "Understand which jobs are running over",
    text: "So you stop guessing what is causing it.",
  },
  {
    icon: CalendarRange,
    title: "Make small changes that actually recover money",
    text: "Adjust quotes, timing, or workload based on real data.",
  },
];

function RevealCard({
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
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SmallTeamsSolutionsContent() {
  return (
    <main id="main" className="border-b border-fc-border bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-fc-accent">
            Solutions · Small teams
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-bold leading-tight text-fc-brand sm:text-4xl lg:text-5xl">
            For small teams that know they are losing money - but do not have time to track it
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-700">
            FieldCrew gives you a simple weekly view of where labour time is actually going without
            spreadsheets, extra admin, or slowing your team down.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={routes.public.sampleReport}
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-fc-accent-dark"
            >
              See a real example report
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

      <section className="border-b border-slate-200 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            Why most small teams never fix this problem
          </h2>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {whyCards.map((card, i) => (
              <RevealCard
                key={card.title}
                index={i}
                className="group rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_34px_-22px_rgba(15,23,42,0.5)]"
              >
                <card.icon className="h-5 w-5 text-fc-accent" />
                <h3 className="mt-3 font-display text-lg font-semibold text-fc-brand">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-700">{card.text}</p>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
              What this actually looks like in a small team
            </h2>
            <div className="mt-4 space-y-4 text-slate-700">
              <p>You do not need a big system to have this problem.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>A few jobs run over.</li>
                <li>A couple of late finishes.</li>
                <li>One or two days of overtime.</li>
              </ul>
              <p>
                And suddenly your week costs more than it should, and you do not know exactly why.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="rounded-2xl border border-slate-300 bg-slate-100 p-5 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.5)]"
          >
            {[
              { label: "Job 1", value: "+30 min" },
              { label: "Job 2", value: "+45 min" },
              { label: "Job 3", value: "+1 hr" },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
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
              <p className="text-xs uppercase tracking-wider text-orange-800">Weekly total</p>
              <p className="mt-1 font-display text-xl font-bold text-orange-700">+4.5 hours lost</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-xl font-bold text-fc-brand">
            Even small teams lose real money
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <RevealCard index={0} className="rounded-xl border border-slate-300 bg-slate-100 p-5">
              <p className="text-sm font-semibold text-fc-brand">5 techs</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">
                ~
                <CountUp value={15000} prefix="$" trigger={true} />
                /year lost
              </p>
            </RevealCard>
            <RevealCard index={1} className="rounded-xl border border-slate-300 bg-slate-100 p-5">
              <p className="text-sm font-semibold text-fc-brand">8 techs</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">~$20k-$25k/year lost</p>
            </RevealCard>
          </div>
          <p className="mt-4 text-slate-600">
            Not from big mistakes - just small overruns adding up.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            What changes when you can finally see it clearly
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {workflowCards.map((card, i) => (
              <RevealCard
                key={card.title}
                index={i}
                className="group rounded-2xl border border-slate-300 bg-slate-100 p-5 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_34px_-22px_rgba(15,23,42,0.5)]"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700">
                  <CalendarRange className="h-3.5 w-3.5" />
                  Week view
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-fc-brand">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-700">{card.text}</p>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-300 bg-slate-100 px-6 py-8 text-center shadow-[0_16px_30px_-24px_rgba(15,23,42,0.5)] sm:px-10">
          <h2 className="font-display text-2xl font-bold text-fc-brand sm:text-3xl">
            Get clarity on your week - without adding more work
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-700">
            See exactly where your labour time is going and what it is costing you.
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
        </div>
      </section>
    </main>
  );
}
