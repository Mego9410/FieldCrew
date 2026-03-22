/**
 * Safe string for unknown caught values. Avoids "[object Event]" / "[object Object]"
 * when promises or handlers reject with non-Error values.
 */
const OPAQUE_STRINGS = new Set([
  "[object Event]",
  "[object Object]",
  "[object DOMException]",
]);

export function toErrorMessage(e: unknown): string {
  if (typeof e === "string") {
    return OPAQUE_STRINGS.has(e) ? "Something went wrong" : e;
  }
  if (e instanceof Error) {
    const m = e.message;
    return OPAQUE_STRINGS.has(m) ? "Something went wrong" : m;
  }
  if (typeof Event !== "undefined" && e instanceof Event) {
    return "Something went wrong";
  }
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as { message: unknown }).message;
    if (typeof m === "string" && m.length > 0) {
      return OPAQUE_STRINGS.has(m) ? "Something went wrong" : m;
    }
  }
  const s = String(e);
  return OPAQUE_STRINGS.has(s) ? "Something went wrong" : s;
}
