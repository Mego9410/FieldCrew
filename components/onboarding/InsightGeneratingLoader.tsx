"use client";

import { motion } from "framer-motion";

const LINES = [
  "Calculating weekly labour hours",
  "Estimating overrun pressure",
  "Building first recovery opportunities",
];

export function InsightGeneratingLoader() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-fc-border bg-fc-surface px-6 py-12 shadow-fc-md">
      <h1 className="font-display text-2xl font-bold tracking-tight text-fc-brand sm:text-3xl">
        Building your first labour snapshot
      </h1>
      <p className="mt-2 text-fc-muted">
        We&apos;re using your inputs to estimate where labour time is likely slipping.
      </p>
      <ul className="mt-10 space-y-4">
        {LINES.map((line, i) => (
          <motion.li
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.2, duration: 0.35 }}
            className="flex items-center gap-3 text-sm font-medium text-fc-muted-strong"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-fc-accent"
              aria-hidden
            />
            {line}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
