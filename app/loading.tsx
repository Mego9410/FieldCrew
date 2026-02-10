export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-fc-border border-t-fc-accent" aria-hidden />
    </div>
  );
}
