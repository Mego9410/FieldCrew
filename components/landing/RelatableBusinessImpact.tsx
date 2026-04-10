"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { SectionBand, SectionHeader } from "@/components/landing/PublicPagePrimitives";

const tiers = [
  { step: 1, title: "5-10 techs", range: "$2,000-$5,000" },
  { step: 2, title: "10-25 techs", range: "$5,000-$10,000" },
  { step: 3, title: "25+ techs", range: "$10,000-$20,000+" },
];

const cardEase = [0.2, 0.8, 0.2, 1] as const;

function TierCard({
  t,
  i,
  reduceMotion,
}: {
  t: (typeof tiers)[number];
  i: number;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.article
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.2, once: true }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : 0.06 + i * 0.12,
        ease: cardEase,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -6, transition: { duration: 0.22, ease: cardEase } }
      }
      className={cn(
        "group relative flex min-h-[188px] min-w-0 flex-col justify-between overflow-visible rounded-2xl px-5 py-7 text-left shadow-fc-md ring-1 ring-slate-200/70 transition-shadow duration-300 sm:px-6 sm:py-8",
        "bg-gradient-to-br from-white via-white to-slate-50/90",
        "before:pointer-events-none before:absolute before:inset-y-5 before:left-0 before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-fc-accent before:via-amber-500 before:to-orange-600",
        "hover:shadow-fc-lg hover:ring-fc-orange-500/20",
        i === 1 &&
          "md:-translate-y-3 md:shadow-fc-lg md:ring-fc-orange-500/30 md:before:from-amber-500",
      )}
    >
      {/* Decorative glow — own layer so we don't clip text with overflow-hidden */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-fc-accent/[0.08] to-transparent blur-2xl"
        aria-hidden
      />
      <div className="relative z-[1] flex min-w-0 flex-1 flex-col pl-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-fc-accent sm:text-xs">
              {t.title}
            </p>
            <p className="mt-4 max-w-full hyphens-none break-normal font-display text-2xl font-extrabold leading-snug tracking-tight text-fc-brand sm:text-3xl md:text-xl lg:text-2xl xl:text-3xl">
              <span className="tabular-nums">{t.range}</span>{" "}
              <span className="whitespace-nowrap">/month</span>
            </p>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fc-accent/15 to-amber-500/10 font-display text-sm font-extrabold text-fc-accent ring-1 ring-fc-accent/20"
            aria-hidden
          >
            {t.step}
          </span>
        </div>
        <p className="mt-3 text-xs font-medium leading-snug text-fc-muted/90">
          Estimated hidden labor leak
        </p>
      </div>
      <div
        className="relative z-[1] mx-1 mt-5 h-px shrink-0 bg-gradient-to-r from-fc-accent/25 via-fc-border/70 to-fc-border/30 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
    </motion.article>
  );
}

export function RelatableBusinessImpact() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionBand
      variant="muted"
      className="py-16 sm:py-24 lg:py-28"
      labelledBy="relatable-impact-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-28 top-[-3rem] h-72 w-72 rounded-full bg-fc-accent/[0.06] blur-3xl" />
        <div className="absolute -right-24 bottom-[-4rem] h-72 w-72 rounded-full bg-slate-400/[0.06] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
          <SectionHeader
            titleId="relatable-impact-heading"
            title="What This Looks Like In A Real Business"
            description="For many HVAC companies, the leak scales with team size — and stays hidden in the noise."
            align="center"
            className="mx-auto max-w-4xl"
          />
        </ScrollReveal>

        {/* Progressive scale — timeline-adjacent rhythm without replacing copy */}
        <div
          className="mx-auto mt-10 hidden max-w-3xl items-center justify-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-fc-muted sm:flex md:mt-12"
          aria-hidden
        >
          <span className="rounded-full bg-slate-200/80 px-3 py-1 text-fc-muted-strong">
            Smaller crews
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-fc-accent/40 to-transparent sm:w-12" />
          <span className="rounded-full bg-slate-200/80 px-3 py-1 text-fc-muted-strong">
            Growing
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-fc-accent/40 to-transparent sm:w-12" />
          <span className="rounded-full bg-slate-200/80 px-3 py-1 text-fc-muted-strong">
            At scale
          </span>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col items-stretch gap-2 sm:mt-12 md:mt-14 md:flex-row md:items-center md:justify-center md:gap-1 lg:gap-2">
          {tiers.map((t, i) => (
            <div key={t.title} className="contents md:flex md:items-stretch">
              <div className="min-w-0 flex-1 md:max-w-[min(100%,23rem)] lg:max-w-[25rem]">
                <TierCard t={t} i={i} reduceMotion={reduceMotion} />
              </div>
              {i < tiers.length - 1 ? (
                <>
                  <div
                    className="flex justify-center py-1 text-fc-accent/35 md:hidden"
                    aria-hidden
                  >
                    <ChevronDown className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div
                    className="hidden shrink-0 items-center self-center px-0.5 text-fc-accent/30 md:flex lg:px-1"
                    aria-hidden
                  >
                    <ChevronRight className="h-9 w-9 lg:h-10 lg:w-10" strokeWidth={1.75} />
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center text-base leading-relaxed text-fc-muted fc-body-air sm:mt-16">
          And most owners never see the full number because the money
          disappears across dozens of jobs.
        </p>
      </div>
    </SectionBand>
  );
}
