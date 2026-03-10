"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useParallax } from "@/components/animations/useParallax";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const CHART_DATA = [
  { name: "Jan", uv: 4000, pv: 2400 },
  { name: "Feb", uv: 3000, pv: 3398 },
  { name: "Mar", uv: 5000, pv: 4300 },
  { name: "Apr", uv: 4780, pv: 4908 },
  { name: "May", uv: 5890, pv: 5800 },
  { name: "Jun", uv: 6390, pv: 6800 },
  { name: "Jul", uv: 7490, pv: 7300 },
  { name: "Aug", uv: 8490, pv: 8100 },
  { name: "Sep", uv: 9290, pv: 9200 },
  { name: "Oct", uv: 10100, pv: 9900 },
];

export function Demo() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const parallaxRef = useParallax<HTMLDivElement>(0.25);

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a0a0a] py-[var(--legend-section-py)] md:py-32"
      aria-label="Product demo"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-legend-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Real-time analytics
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-legend-body text-lg text-[#a1a1aa] opacity-80">
            Watch your portfolio and market moves in one place.
          </p>
        </motion.div>

        <motion.div
          ref={parallaxRef}
          className="mx-auto mt-16 max-w-5xl"
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-[30px] md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-legend-body text-sm font-medium text-[#a1a1aa]">
                Performance
              </span>
              <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                Live
              </span>
            </div>
            <div className="h-[280px] w-full md:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5b7cff" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#9d6cff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#a1a1aa" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pv"
                    stroke="#5b7cff"
                    strokeWidth={2}
                    fill="url(#chartGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
