"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

import plansImage from "../../Assets/Smiling_Man_With_Tool_Belt_Holding_Toolbox_original_3818113.jpg"

type PlansScrollPromptProps = {
  /** DOM id of the hero wrapper to observe */
  heroId?: string
  /** DOM id of pricing section; when visible, prompt hides */
  pricingId?: string
  /** Where the CTA should go */
  href?: string
  /** Storage key for dismissal */
  storageKey?: string
  className?: string
}

function safeGetLocalStorage(key: string) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export function PlansScrollPrompt({
  heroId = "homepage-hero",
  pricingId = "pricing",
  href = "/#pricing",
  storageKey = "fc_plans_prompt_dismissed_v1",
  className,
}: PlansScrollPromptProps) {
  const [ready, setReady] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(true)
  const [heroInView, setHeroInView] = React.useState(true)
  const [pricingInView, setPricingInView] = React.useState(false)

  React.useEffect(() => {
    setReady(true)
    setDismissed(safeGetLocalStorage(storageKey) === "1")
  }, [storageKey])

  React.useEffect(() => {
    if (!ready) return

    const heroEl = document.getElementById(heroId)
    const pricingEl = document.getElementById(pricingId)

    if (!heroEl) {
      // If the page structure changes, default to never showing rather than popping unexpectedly.
      setHeroInView(true)
      return
    }

    const heroObs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setHeroInView(entry?.isIntersecting ?? true)
      },
      {
        threshold: 0.05,
      },
    )

    heroObs.observe(heroEl)

    let pricingObs: IntersectionObserver | null = null
    if (pricingEl) {
      pricingObs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          setPricingInView(entry?.isIntersecting ?? false)
        },
        { threshold: 0.15 },
      )
      pricingObs.observe(pricingEl)
    }

    return () => {
      heroObs.disconnect()
      pricingObs?.disconnect()
    }
  }, [heroId, pricingId, ready])

  const open = ready && !dismissed && !heroInView && !pricingInView

  return (
    <div
      className={cn(
        // Desktop: side card, vertically centered. Mobile: fall back to bottom toast.
        "fixed bottom-5 right-5 z-50 select-none",
        "w-[min(288px,calc(100vw-40px))]",
        "sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2",
        // Make it a tall, portrait card on desktop (matches screenshot aspect).
        "sm:w-[208px] md:w-[224px] lg:w-[240px]",
        // ~20% taller than 9/16 at same width.
        "sm:aspect-[15/32] sm:max-h-[94vh]",
        // Desktop: dock to right edge.
        "sm:right-0 sm:bottom-auto sm:mr-0",
        "motion-reduce:transition-none",
        className,
      )}
      role="region"
      aria-label="Pricing prompt"
    >
      <div
        className={cn(
          "h-full overflow-hidden border border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/70 shadow-2xl backdrop-blur-md",
          // Docked panel: square on right edge, rounded on left.
          "rounded-2xl sm:rounded-l-2xl sm:rounded-r-none",
          "transition-transform duration-300 ease-out motion-reduce:duration-0",
          open ? "translate-x-0" : "translate-x-[120%]",
        )}
      >
        <div className="flex h-full min-h-0 flex-col p-4">
          <div className="relative overflow-hidden rounded-xl border border-white/10">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={plansImage}
                alt="HVAC technician with tools"
                fill
                priority={false}
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 280px, 360px"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="inline-flex items-center rounded-full border border-white/15 bg-slate-950/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-100 backdrop-blur">
                  Plans & pricing
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-base font-bold tracking-tight text-white">
                Ready to see the plans?
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Pick the right team size and get started in minutes.
              </p>
            </div>
          <button
            type="button"
            onClick={() => {
              setDismissed(true)
              safeSetLocalStorage(storageKey, "1")
            }}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fc-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            aria-label="Dismiss pricing prompt"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-fc-orange-400" aria-hidden />
                <span>First month <span className="font-semibold text-white">$9</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-fc-orange-400" aria-hidden />
                <span>Cancel anytime — no long-term contracts</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-center gap-2">
              <Link
                href={href}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-fc-orange-500 to-amber-500 px-4 text-sm font-bold text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-fc-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                View plans
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDismissed(true)
                  safeSetLocalStorage(storageKey, "1")
                }}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fc-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

