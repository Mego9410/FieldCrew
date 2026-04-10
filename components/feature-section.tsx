"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { MockAppFrame } from "@/components/landing/PublicPagePrimitives"

export interface FeatureStepItem {
  step: string
  title?: string
  content: string
  /** Use with next/image when `slide` is not set */
  image?: string
  /** Right panel content (preferred for stat / text slides — no image host needed) */
  slide?: React.ReactNode
}

interface FeatureStepsProps {
  features: FeatureStepItem[]
  className?: string
  /** Section heading; omit to hide */
  title?: string
  headingId?: string
  headingClassName?: string
  /** Rendered above the heading (e.g. accent stripe) */
  beforeTitle?: React.ReactNode
  /** Intro under the heading */
  lead?: React.ReactNode
  /** Bottom of section */
  footer?: React.ReactNode
  autoPlayInterval?: number
  imageHeight?: string
  /** When false, shows a static summary panel and full-opacity steps (e.g. reduced motion) */
  autoPlay?: boolean
}

export function FeatureSteps({
  features,
  className,
  title,
  headingId,
  headingClassName,
  beforeTitle,
  lead,
  footer,
  autoPlayInterval = 3000,
  imageHeight = "h-[200px] md:h-[300px] lg:h-[400px]",
  autoPlay = true,
}: FeatureStepsProps) {
  const reduceMotion = useReducedMotion()
  const play = autoPlay && !reduceMotion
  const [currentFeature, setCurrentFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!play) return
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [play, progress, features.length, autoPlayInterval])

  return (
    <div className={cn("p-8 md:p-12", className)}>
      <div className="mx-auto w-full max-w-7xl">
        {beforeTitle}
        {title != null && title !== "" && (
          <h2
            id={headingId}
            className={cn(
              "mb-10 text-center text-3xl font-bold md:text-4xl lg:text-5xl",
              headingClassName,
            )}
          >
            {title}
          </h2>
        )}
        {lead}

        <div className="mt-10 flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-10">
          <div className="order-2 space-y-8 md:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8"
                initial={{ opacity: play ? 0.3 : 1 }}
                animate={{
                  opacity: play && index !== currentFeature ? 0.3 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 md:h-10 md:w-10",
                    play && index === currentFeature
                      ? "scale-110 border-fc-orange-500 bg-fc-orange-500 text-white"
                      : play
                        ? "border-slate-300 bg-muted text-muted-foreground"
                        : "border-fc-orange-500/40 bg-fc-surface-muted text-fc-brand",
                  )}
                >
                  {!play || index <= currentFeature ? (
                    <span className="text-lg font-bold">✓</span>
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-semibold text-fc-brand md:text-2xl">
                    {feature.title || feature.step}
                  </h3>
                  <p className="text-sm text-fc-muted md:text-lg">
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              "relative order-1 overflow-hidden rounded-lg md:order-2",
              imageHeight,
            )}
          >
            {!play ? (
              <div
                className="flex h-full min-h-[inherit] flex-col justify-center gap-4 rounded-lg border border-fc-border bg-white p-6 shadow-fc-sm"
                aria-label="Summary of labour profit losses"
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="border-b border-fc-border pb-4 last:border-0 last:pb-0"
                  >
                    <p className="font-display text-lg font-bold text-fc-brand">
                      {feature.title || feature.step}
                    </p>
                    <p className="mt-1 text-sm text-fc-muted">{feature.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {features.map(
                  (feature, index) =>
                    index === currentFeature && (
                      <motion.div
                        key={index}
                        className="absolute inset-0"
                        initial={{ y: 100, opacity: 0, rotateX: -20 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -100, opacity: 0, rotateX: 20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <MockAppFrame
                          title="FieldCrew"
                          subtitle={feature.title || feature.step}
                          className="h-full w-full"
                        >
                          <div className={cn("h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]")}>
                            {feature.slide != null ? (
                              <div className="h-full w-full">{feature.slide}</div>
                            ) : feature.image ? (
                              <div className="relative h-full w-full">
                                <Image
                                  src={feature.image}
                                  alt={feature.title || feature.step}
                                  className="h-full w-full object-cover transition-transform"
                                  width={1000}
                                  height={500}
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/50 to-transparent" />
                              </div>
                            ) : null}
                          </div>
                        </MockAppFrame>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {footer}
      </div>
    </div>
  )
}

const industryProblemStats = [
  {
    value: "$450M-$600M",
    label: "lost annually",
    emphasis: true,
  },
  {
    value: "Under-quoting + overtime",
    label: "major hidden profit drains",
    emphasis: false,
  },
  {
    value: "Busy companies still lose money",
    label: "when labor isn't tracked vs quote",
    emphasis: false,
  },
] as const

function StatSlide({
  value,
  label,
  emphasis,
}: {
  value: string
  label: string
  emphasis: boolean
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-fc-navy-900 via-slate-900 to-fc-navy-950 p-8 text-center">
      <p
        className={cn(
          "max-w-md font-display font-extrabold tracking-tight text-white",
          emphasis ? "text-3xl sm:text-4xl md:text-5xl" : "text-xl sm:text-2xl md:text-3xl",
        )}
      >
        {value}
      </p>
      <p className="mt-4 max-w-sm text-base text-slate-300 md:text-lg">{label}</p>
    </div>
  )
}

export function IndustryProblemFeatureSection({
  className,
}: {
  className?: string
}) {
  const features: FeatureStepItem[] = industryProblemStats.map((s) => ({
    step: s.label,
    title: s.value,
    content: s.label,
    slide: <StatSlide value={s.value} label={s.label} emphasis={s.emphasis} />,
  }))

  return (
    <section
      className={cn(
        "border-b border-fc-border bg-gradient-to-b from-slate-50 via-white to-slate-50/60 py-14 sm:py-20 lg:py-24",
        className,
      )}
      aria-labelledby="industry-problem-heading"
    >
      <FeatureSteps
        beforeTitle={
          <span className="fc-accent-stripe mx-auto mb-4 block" aria-hidden />
        }
        title="This Isn't a Small Problem"
        headingId="industry-problem-heading"
        headingClassName="font-display font-bold text-fc-brand fc-section-h2"
        lead={
          <p className="mx-auto max-w-3xl text-center text-lg text-fc-muted fc-body-air">
            Across the US, HVAC contractors lose between $450 million and $600
            million every year from under-quoted labor, jobs running over time,
            and overtime used to recover the schedule.
          </p>
        }
        features={features}
        autoPlayInterval={4000}
        className="px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12 lg:px-8"
        footer={
          <p className="mx-auto mt-10 max-w-3xl text-center text-lg text-fc-muted fc-body-air">
            The problem usually stays hidden because revenue still looks
            healthy.
          </p>
        }
      />
    </section>
  )
}
