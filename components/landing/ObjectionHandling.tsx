"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import type { ComponentType } from "react";

type Objection = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

const objections: Objection[] = [
  {
    icon: AlertTriangle,
    title: "We already know when jobs go long.",
    body: "FieldCrew doesn't just confirm that jobs run over. It shows which jobs, how often, and how much money it's costing.",
  },
  {
    icon: Sparkles,
    title: "We don't want another complicated system.",
    body: "FieldCrew should feel lightweight and easy to start. The value is visibility first, not a giant software rollout.",
  },
  {
    icon: Clock,
    title: "Our jobs vary too much.",
    body: "That's exactly why variance matters. FieldCrew helps you spot repeat patterns even when no two jobs are identical.",
  },
];

export function ObjectionHandling() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="border-b border-fc-border bg-white py-14 sm:py-20 lg:py-24"
      aria-labelledby="objection-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <h2
            id="objection-heading"
            className="font-display font-bold text-fc-brand fc-section-h2"
          >
            You Already Know Jobs Run Over. But Do You Know What It's Costing You?
          </h2>
        </ScrollReveal>

        <motion.div
          className="mt-14 grid gap-6 lg:grid-cols-3"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {objections.map((o) => {
            const Icon = o.icon;
            return (
              <div
                key={o.title}
                className="rounded-[var(--fc-radius)] border border-fc-border bg-fc-surface-muted px-6 py-7 shadow-fc-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-fc-accent/10 text-fc-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-fc-brand">
                      {o.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-fc-muted fc-body-air">{o.body}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

