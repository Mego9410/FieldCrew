"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";

export function InstrumentFinalCta() {
  return (
    <section className="relative overflow-hidden bg-fc-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 text-white fc-blueprint-grid" aria-hidden style={{ opacity: 0.06 }} />
      <div
        className="pointer-events-none absolute inset-y-0 w-[40%]"
        aria-hidden
        style={{
          background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.08), transparent)",
          animation: "fc-cta-sweep 8s linear infinite",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8">
        <div className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          <span className="h-px w-6 bg-fc-orange-500" aria-hidden />
          THE BOTTOM LINE
        </div>
        <h2 className="mt-5 font-display text-[clamp(2.4rem,4vw+1rem,3.9rem)] font-extrabold tracking-[-0.03em] leading-[1.05] text-white">
          Find out what your business is
          <span className="block text-fc-orange-500"> actually losing</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[34rem] text-[19px] leading-7 text-slate-300">
          It&apos;s probably more than you think — and it almost always starts with quoted-vs-actual labor time. See
          your number in about a minute.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="#calculator"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-fc-orange-500 px-6 text-[15px] font-bold text-fc-navy-950 transition hover:bg-fc-orange-600 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950"
          >
            See my monthly leak <ArrowRight className="ml-2 h-[18px] w-[18px]" aria-hidden />
          </Link>
          <Link
            href={routes.owner.subscribe}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/25 bg-transparent px-6 text-[15px] font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950"
          >
            Start for $9
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fc-cta-sweep {
          0% {
            left: -40%;
          }
          100% {
            left: 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes fc-cta-sweep {
            0% {
              left: -40%;
            }
            100% {
              left: -40%;
            }
          }
        }
      `}</style>
    </section>
  );
}

