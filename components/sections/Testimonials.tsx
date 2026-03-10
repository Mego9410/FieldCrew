"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "Finally a terminal that doesn't get in the way. Execution is instant, and the analytics actually help me make decisions.",
    author: "Alex Chen",
    role: "Head of Trading, Meridian Capital",
    gradient: "from-[#5b7cff] to-[#9d6cff]",
  },
  {
    quote:
      "We moved our entire desk to Legend. The unified workflow and institutional security were the deciding factors.",
    author: "Sarah Mitchell",
    role: "COO, Northgate Advisors",
    gradient: "from-[#2de2e6] to-[#6c5bff]",
  },
  {
    quote:
      "Best trading experience we've had. The team ships features we actually ask for. Rare in this space.",
    author: "James Okonkwo",
    role: "Founder, Lagos Digital",
    gradient: "from-[#9d6cff] to-[#2de2e6]",
  },
];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="bg-[#0a0a0a] py-[var(--legend-section-py)] md:py-32"
      aria-label="Testimonials"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.h2
          className="font-legend-display text-4xl font-semibold tracking-tight text-white md:text-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Trusted by leading teams
        </motion.h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.author}
              className="group relative overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-[30px] transition-all duration-300 ease-[var(--legend-ease)] hover:-translate-y-1.5 hover:border-white/12"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${t.gradient} opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-30`}
              />
              <p className="relative font-legend-body text-lg leading-relaxed text-[#e4e4e7] opacity-90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6">
                <p className="font-legend-display font-semibold text-white">
                  {t.author}
                </p>
                <p className="text-sm text-[#a1a1aa]">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
