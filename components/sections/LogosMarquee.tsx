"use client";

import { motion } from "framer-motion";

const LOGOS = [
  "Stripe",
  "Linear",
  "Vercel",
  "Notion",
  "Figma",
  "Coinbase",
  "OpenSea",
  "Uniswap",
  "Aave",
  "Compound",
];

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 gap-16 pr-16">
      {LOGOS.map((name) => (
        <span
          key={name}
          className="font-legend-display text-lg font-semibold tracking-tight text-[#a1a1aa] opacity-60 whitespace-nowrap"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

export function LogosMarquee() {
  return (
    <section
      className="relative border-y border-[rgba(255,255,255,0.06)] bg-[#0a0a0a] py-16"
      aria-label="Trusted by"
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex w-max"
          animate={{ x: "-50%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <MarqueeTrack />
          <MarqueeTrack />
        </motion.div>
      </div>
    </section>
  );
}
