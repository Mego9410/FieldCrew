/**
 * Floating vector shapes for the hero — breaks the straight layout.
 * All decorative, aria-hidden. No animation (reduced-motion safe).
 */
export function HeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Large soft circle — top right */}
      <svg
        className="absolute -right-24 -top-24 h-96 w-96 opacity-[0.08] lg:h-[28rem] lg:w-[28rem]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="180" fill="currentColor" className="text-fc-accent" />
      </svg>
      {/* Diagonal line — left side */}
      <svg
        className="absolute -bottom-8 left-0 w-64 opacity-20 sm:w-80"
        viewBox="0 0 320 8"
        fill="none"
      >
        <line
          x1="0"
          y1="4"
          x2="320"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-fc-accent"
        />
      </svg>
      {/* Rotated bracket / corner shape — bottom left */}
      <svg
        className="absolute -left-4 bottom-12 h-24 w-24 -rotate-12 opacity-[0.12]"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path
          d="M10 10 L10 70 L70 70"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-fc-accent"
        />
      </svg>
      {/* Small grid burst — top left */}
      <svg
        className="absolute left-8 top-20 h-20 w-20 rotate-45 opacity-[0.06]"
        viewBox="0 0 40 40"
        fill="none"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h-${i}`}
            x1={i * 10}
            y1={0}
            x2={i * 10}
            y2={40}
            stroke="currentColor"
            strokeWidth="1"
            className="text-fc-brand"
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`v-${i}`}
            x1={0}
            y1={i * 10}
            x2={40}
            y2={i * 10}
            stroke="currentColor"
            strokeWidth="1"
            className="text-fc-brand"
          />
        ))}
      </svg>
      {/* Curved arc — right side, behind content */}
      <svg
        className="absolute -right-32 top-1/2 hidden h-64 w-64 -translate-y-1/2 opacity-[0.05] lg:block"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M 100 20 A 80 80 0 0 1 180 100"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-fc-accent"
        />
      </svg>
    </div>
  );
}
