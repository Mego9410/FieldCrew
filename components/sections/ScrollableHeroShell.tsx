"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Hero } from "@/components/sections/Hero";

export function ScrollableHeroShell() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const panelScaleX = useTransform(
    scrollYProgress,
    [0, 0.7],
    reduceMotion ? [1, 1] : [0.8, 1.15],
  );

  const sideOffset = useTransform(
    scrollYProgress,
    [0, 0.7],
    reduceMotion ? [0, 0] : [0, 40],
  );

  const gutterOpacity = useTransform(
    scrollYProgress,
    [0, 0.7],
    reduceMotion ? [1, 1] : [1, 0.4],
  );

  return (
    <section ref={sectionRef} className="relative">
      {/* Background frame that expands with scroll */}
      <div className="pointer-events-none absolute inset-0 z-0 flex justify-center">
        <motion.div
          style={{ scaleX: panelScaleX }}
          className="relative h-[520px] w-full max-w-[1280px] origin-center"
        >
          <div
            className="absolute inset-0 rounded-none md:rounded-none"
            style={{
              background:
                "radial-gradient(circle at 50% 20%, rgba(37,99,235,0.4) 0%, rgba(15,23,42,0.9) 65%)",
            }}
          />
        </motion.div>
      </div>

      {/* Dark side gutters that ease away */}
      {!reduceMotion && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/4 bg-[#050505]"
            style={{ x: useTransform(sideOffset, (v) => -v), opacity: gutterOpacity }}
          />
          <motion.div
            className="pointer-events-none absolute inset-y-0 right-0 z-0 w-1/4 bg-[#050505]"
            style={{ x: sideOffset, opacity: gutterOpacity }}
          />
        </>
      )}

      {/* Existing hero content sits on top */}
      <div className="relative z-10">
        <Hero />
      </div>
    </section>
  );
}

