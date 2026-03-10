/**
 * Legend-style motion system
 * Durations: short 0.3s, medium 0.6s, large 1.2s
 * Easing: cubic-bezier(.16, 1, .3, 1)
 */

export const LEGEND_EASE = [0.16, 1, 0.3, 1] as const;
export const LEGEND_EASE_STR = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DURATION = {
  short: 0.3,
  medium: 0.6,
  large: 1.2,
} as const;

export const sectionRevealDefaults = {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: LEGEND_EASE,
  stagger: 0.12,
};

export const cardRevealDefaults = {
  scale: 0.95,
  opacity: 0,
  duration: 0.7,
  ease: LEGEND_EASE,
  rotation: 0.5,
};

export const parallaxSpeed = 0.4;
