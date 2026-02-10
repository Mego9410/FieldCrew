/**
 * Curved section divider — breaks the straight horizontal section edges.
 */
export function SectionDivider() {
  return (
    <div className="relative h-12 w-full overflow-hidden sm:h-16" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 40 Q300 0 600 40 T1200 40 V80 H0 Z"
          fill="currentColor"
          className="text-white"
        />
      </svg>
    </div>
  );
}
