"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const METRICS = [
  { value: "99.99%", label: "Uptime" },
  { value: "< 50ms", label: "Latency" },
  { value: "$2.4T+", label: "Volume traded" },
  { value: "150+", label: "Countries" },
];

function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  return (
    <motion.span
      className="font-legend-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {value}
    </motion.span>
  );
}

export function Metrics() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="border-y border-[rgba(255,255,255,0.06)] bg-[#111111] py-[var(--legend-section-py)] md:py-32"
      aria-label="Key metrics"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-8">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <AnimatedNumber value={m.value} inView={inView} />
              <p className="mt-2 font-legend-body text-sm font-medium text-[#a1a1aa]">
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
