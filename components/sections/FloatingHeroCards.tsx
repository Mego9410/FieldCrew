"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useMouseTilt } from "@/components/animations/useMouseTilt";
import { DollarSign, Clock, TrendingDown } from "lucide-react";

const glassCardClass =
  "rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-[30px] p-5 will-change-transform";

function FloatingCard({
  children,
  className = "",
  yOffset = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}) {
  const cardRef = useMouseTilt<HTMLDivElement>({ maxTilt: 10, scale: 1.03 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], [0, yOffset * 80]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.35], [1, 0.3]);

  return (
    <motion.div
      ref={cardRef}
      className={`${glassCardClass} ${className}`}
      initial={false}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingHeroCards() {
  return (
    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
      <FloatingCard yOffset={0.5} className="min-w-[220px]">
        <div className="mb-3 flex items-center gap-2 text-[#a1a1aa]">
          <DollarSign className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Recoverable</span>
        </div>
        <div className="font-legend-display text-2xl font-semibold tracking-tight text-white">
          $6,420
        </div>
        <div className="mt-1 text-sm text-[#a1a1aa]">/month identified</div>
        <div className="mt-3 h-8 w-full rounded-lg bg-white/5 px-2 flex items-center">
          <span className="text-xs text-emerald-400">FieldCrew found</span>
        </div>
      </FloatingCard>

      <FloatingCard yOffset={-0.3} className="min-w-[240px]">
        <div className="mb-3 flex items-center gap-2 text-[#a1a1aa]">
          <Clock className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Overtime</span>
        </div>
        <div className="flex gap-4">
          <div>
            <div className="font-legend-display text-xl font-semibold text-white">18%</div>
            <div className="text-xs text-[#a1a1aa]">reduction opportunity</div>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#5b7cff] to-[#9d6cff]"
            initial={{ width: "0%" }}
            animate={{ width: "68%" }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </FloatingCard>

      <FloatingCard yOffset={0.2} className="min-w-[200px]">
        <div className="mb-3 flex items-center gap-2 text-[#a1a1aa]">
          <TrendingDown className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Jobs</span>
        </div>
        <div className="font-legend-display text-3xl font-bold tracking-tight text-white">
          9
        </div>
        <div className="mt-1 text-sm text-[#a1a1aa]">underpriced</div>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="h-6 flex-1 rounded bg-white/10"
              initial={{ height: 8 }}
              animate={{ height: [8, 12 + i * 4, 12 + i * 4] }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
      </FloatingCard>
    </div>
  );
}
