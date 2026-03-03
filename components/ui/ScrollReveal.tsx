"use client";

import { motion, useReducedMotion } from "framer-motion";

const defaultTransition = {
  type: "tween" as const,
  duration: 0.35,
  ease: [0.2, 0.8, 0.2, 1] as const,
};

const defaultVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof typeof motion;
  /** Stagger delay for children (seconds). Default 0.08 */
  staggerDelay?: number;
  /** Whether this is a stagger container (children animate in sequence) */
  stagger?: boolean;
  /** Override transition */
  transition?: typeof defaultTransition;
  /** Amount of element that must be in view (0-1). Default 0.15 */
  amount?: number;
  /** Once revealed, don't animate again. Default true */
  once?: boolean;
};

export function ScrollReveal({
  children,
  className,
  as = "div",
  staggerDelay = 0.08,
  stagger = false,
  transition = defaultTransition,
  amount = 0.15,
  once = true,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  const variants = stagger
    ? {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : staggerDelay,
            staggerDirection: 1,
          },
        },
      }
    : {
        hidden: reduceMotion ? { opacity: 1 } : defaultVariants.hidden,
        visible: reduceMotion ? { opacity: 1 } : defaultVariants.visible,
      };

  const childVariants =
    stagger && !reduceMotion
      ? { hidden: defaultVariants.hidden, visible: defaultVariants.visible }
      : undefined;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount, once }}
      variants={variants}
      transition={reduceMotion ? { duration: 0 } : transition}
    >
      {stagger && childVariants
        ? (Array.isArray(children) ? children : [children]).map((child, i) => (
            <motion.div key={i} variants={childVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </Component>
  );
}
