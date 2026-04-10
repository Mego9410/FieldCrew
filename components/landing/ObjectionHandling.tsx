"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import type { ComponentType } from "react";
import { BentoCard, RailHeader, SectionBand } from "@/components/landing/PublicPagePrimitives";

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
    <SectionBand
      variant="white"
      className="py-14 sm:py-20 lg:py-24"
      labelledBy="objection-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <RailHeader
            eyebrow="Common objections"
            titleId="objection-heading"
            title="You Already Know Jobs Run Over. But Do You Know What It&apos;s Costing You?"
            description="FieldCrew turns gut-feel into a weekly number you can act on."
          />
        </ScrollReveal>

        <motion.div
          className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-3"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2, once: true }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {objections.map((o, idx) => {
            const Icon = o.icon;
            return (
              <BentoCard
                key={o.title}
                className={idx === 0 ? "h-full lg:col-span-2" : "h-full"}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-fc-accent/10 text-fc-accent ring-1 ring-fc-accent/20">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold leading-snug text-fc-brand">
                      {o.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-fc-muted">{o.body}</p>
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </motion.div>
      </div>
    </SectionBand>
  );
}

