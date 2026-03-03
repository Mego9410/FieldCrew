"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

type MagneticButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
};

const strength = 0.2;
const radius = 48;

export function MagneticButton({
  children,
  href,
  variant = "primary",
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / rect.width;
    const dy = (e.clientY - centerY) / rect.height;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const factor = Math.min(dist * strength, 1);
    setPosition({
      x: dx * radius * factor,
      y: dy * radius * factor,
    });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const base =
    "inline-flex min-h-[56px] min-w-[56px] cursor-pointer items-center justify-center rounded-[var(--fc-radius-lg)] px-8 py-4 text-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fc-accent focus:ring-offset-2 focus:ring-offset-fc-navy-950";
  const variants =
    variant === "primary"
      ? "bg-fc-accent text-white shadow-fc-md hover:bg-fc-accent-dark focus:ring-fc-accent"
      : "border-2 border-fc-steel-500 bg-transparent text-slate-200 hover:border-white hover:bg-white/5 hover:text-white focus:ring-fc-accent";

  return (
    <Link
      ref={ref}
      href={href}
      className={`${base} ${variants} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span
        animate={{ x: reduceMotion ? 0 : position.x, y: reduceMotion ? 0 : position.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
