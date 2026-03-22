"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TimelineEntry {
  title: string;
  content: ReactNode;
}

type TimelineProps = {
  data: TimelineEntry[];
  /** Optional Aceternity-style intro (title + blurb). Omit when the page already has a section heading. */
  intro?: { title: string; description: string };
  className?: string;
};

/**
 * Scroll-linked vertical timeline (Aceternity pattern).
 * Installed via `npx shadcn add https://21st.dev/r/aceternity/timeline` — adapted for FieldCrew tokens + optional intro.
 */
export function Timeline({ data, intro, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, Math.max(height, 0)]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className={cn("w-full font-body", className)}>
      {intro ? (
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 md:px-8 lg:px-10">
          <h2 className="mb-4 max-w-4xl font-display text-xl font-bold text-fc-brand md:text-4xl">
            {intro.title}
          </h2>
          <p className="max-w-lg text-sm text-fc-muted md:text-base fc-body-air">
            {intro.description}
          </p>
        </div>
      ) : null}

      <div ref={ref} className="relative mx-auto max-w-7xl pb-12 md:pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start gap-6 pt-10 md:gap-10 md:pt-16 lg:pt-20"
          >
            <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:top-40 md:w-full md:max-w-sm md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border border-fc-border bg-white shadow-fc-sm md:left-3">
                <span className="h-3.5 w-3.5 rounded-full bg-fc-accent ring-2 ring-white" />
              </div>
              <h3 className="hidden font-display font-bold text-fc-muted-strong md:block md:pl-20 md:text-3xl lg:text-5xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full min-w-0 pl-20 pr-2 md:pl-4 md:pr-0">
              <h3 className="mb-4 block text-left font-display text-2xl font-bold text-fc-brand md:hidden">
                {item.title}
              </h3>
              <div className="text-sm leading-relaxed text-fc-muted fc-body-air [&_p]:mb-3 [&_p:last-child]:mb-0">
                {item.content}
              </div>
            </div>
          </div>
        ))}

        <div
          style={{ height: height > 0 ? height : undefined }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden rounded-full bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-fc-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)]"
          aria-hidden
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-fc-accent via-fc-orange-500 to-transparent"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
          />
        </div>
      </div>
    </div>
  );
}
