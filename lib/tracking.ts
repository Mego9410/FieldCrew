/**
 * Marketing/CTA analytics tracking. Uses PostHog/GA if configured; otherwise console fallback.
 */

export function track(
  eventName: string,
  props?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined") return;

  if (typeof (window as unknown as { posthog?: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog !== "undefined") {
    (window as unknown as { posthog: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog.capture(eventName, props as Record<string, unknown>);
    return;
  }

  if (typeof (window as unknown as { gtag?: (a: string, b: string, c: Record<string, unknown>) => void }).gtag === "function") {
    (window as unknown as { gtag: (a: string, b: string, c: Record<string, unknown>) => void }).gtag("event", eventName, props as Record<string, unknown>);
    return;
  }

  console.log("[track]", eventName, props);
}
