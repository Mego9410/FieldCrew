import { ComparisonTable } from "./ComparisonTable";

export function Differentiation() {
  return (
    <section
      className="relative border-b border-fc-border bg-[#0a0f1a] py-20 sm:py-24 lg:py-32"
      aria-labelledby="differentiation-heading"
    >
      <div
        className="absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(249, 115, 22, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(15, 23, 42, 0.5) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="h-1 w-16 bg-fc-accent mx-auto mb-5" aria-hidden />
          <h2
            id="differentiation-heading"
            className="font-display font-bold text-white fc-section-h2"
          >
            Built for margin. Not admin.
          </h2>
        </div>
        <div className="mt-14">
          <ComparisonTable />
        </div>
      </div>
    </section>
  );
}
