/**
 * Worker magic link token resolution (prototype: mock).
 * Valid token → workerId for use in worker app; invalid → show invalid-token screen.
 */

export type ResolveWorkerTokenResult =
  | { valid: true; workerId: string }
  | { valid: false };

/**
 * Resolves a worker magic link token.
 * Mock: accept any non-empty token except the literal "invalid" (for testing invalid screen).
 * When valid, workerId is the token so existing code using token as workerId continues to work.
 */
export async function resolveWorkerToken(
  token: string
): Promise<ResolveWorkerTokenResult> {
  const trimmed = token?.trim() ?? "";
  if (trimmed.length === 0 || trimmed === "invalid") {
    return { valid: false };
  }
  return { valid: true, workerId: trimmed };
}
