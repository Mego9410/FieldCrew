/**
 * Clipboard writes can reject in surprising ways (permissions, insecure context, unfocused document),
 * sometimes with non-Error values. This helper guarantees we never throw to the caller.
 */
export async function safeClipboardWriteText(text: string): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false;
    if (typeof navigator === "undefined") return false;
    if (!("clipboard" in navigator)) return false;
    if (typeof document !== "undefined" && typeof document.hasFocus === "function") {
      if (!document.hasFocus()) return false;
    }
    if (typeof window.isSecureContext === "boolean" && !window.isSecureContext) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clipboard = (navigator as any).clipboard as { writeText?: (t: string) => Promise<void> } | undefined;
    if (!clipboard?.writeText) return false;

    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

