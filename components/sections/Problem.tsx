"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useMouseTilt } from "@/components/animations/useMouseTilt";

const painRows = [
  {
    youThink: "Payroll is the problem.",
    reality: "Hours are uncoded, overtime spikes unseen, job costs are guesswork.",
    result: "Margin leaks every month. You find out at month-end.",
  },
  {
    youThink: "We just need better time tracking.",
    reality: "Generic time apps don't tie hours to jobs or revenue.",
    result: "Payroll runs clean. Profitability stays invisible.",
  },
  {
    youThink: "Our margins are fine.",
    reality: "Without job-level labour data, you're assuming — not measuring.",
    result: "Underpriced jobs and overruns eat profit. You don't see which ones.",
  },
];

const cardReveal = {
  hidden: { opacity: 0, scale: 0.95, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0 },
};
const transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const };

function PainCard({
  title,
  accent = false,
  children,
  delay,
  inView,
}: {
  title: string;
  accent?: boolean;
  children: React.ReactNode;
  delay: number;
  inView: boolean;
}) {
  const tiltRef = useMouseTilt<HTMLDivElement>({ maxTilt: 6, scale: 1.02 });

  return (
    <motion.div
      ref={tiltRef}
      className={`group relative rounded-[20px] border bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-[30px] transition-shadow duration-300 hover:shadow-[0_24px_96px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] ${
        accent
          ? "border-[rgba(91,124,255,0.25)] sm:border-l-4 sm:border-l-[#5b7cff]"
          : "border-[rgba(255,255,255,0.08)]"
      }`}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardReveal}
      transition={{ ...transition, delay }}
      whileHover={{ y: -6 }}
    >
      {accent && (
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#5b7cff]/10 blur-3xl"
          aria-hidden
        />
      )}
      <h3
        className={`font-legend-display text-xs font-bold uppercase tracking-wider ${
          accent ? "text-[#5b7cff]" : "text-[#a1a1aa]"
        }`}
      >
        {title}
      </h3>
      {accent && (
        <span className="mt-3 block h-0.5 w-12 bg-[#5b7cff]" aria-hidden />
      )}
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

export function Problem() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="pain"
      ref={ref}
      className="relative overflow-x-hidden overflow-y-visible border-y border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] py-[var(--legend-section-py)] md:py-32"
      aria-labelledby="pain-heading"
    >
      {/* Subtle gradient atmosphere — hero-style */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(91,124,255,0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(157,108,255,0.05) 0%, transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 block font-legend-body text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
            02
          </span>
          <h2
            id="pain-heading"
            className="font-legend-display text-4xl font-semibold tracking-tight text-white md:text-5xl"
          >
            Payroll isn&apos;t your problem. Uncontrolled labour is.
          </h2>
        </motion.div>

        <motion.div
          className="mt-16 grid min-w-0 grid-cols-1 gap-6 overflow-visible sm:grid-cols-3 sm:gap-8"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <PainCard title="You think" delay={0.1} inView={inView}>
            <ul className="space-y-4 text-left font-legend-body text-base text-white opacity-90">
              {painRows.map((row, i) => (
                <li key={i} className="font-medium leading-relaxed">
                  {row.youThink}
                </li>
              ))}
            </ul>
          </PainCard>
          <PainCard title="Reality" accent delay={0.22} inView={inView}>
            <ul className="space-y-4 text-left font-legend-body text-base text-[#a1a1aa] leading-relaxed opacity-90">
              {painRows.map((row, i) => (
                <li key={i}>{row.reality}</li>
              ))}
            </ul>
          </PainCard>
          <PainCard title="Result" delay={0.34} inView={inView}>
            <ul className="space-y-4 text-left font-legend-body text-base text-white opacity-90">
              {painRows.map((row, i) => (
                <li key={i} className="font-medium leading-relaxed">
                  {row.result}
                </li>
              ))}
            </ul>
          </PainCard>
        </motion.div>
      </div>
    </section>
  );
}
