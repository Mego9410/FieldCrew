import { describe, it, expect } from "vitest";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

describe("rateLimit", () => {
  it("allows requests under the limit and blocks once exceeded", () => {
    const key = `test:${Math.random()}`;
    const opts = { limit: 3, windowMs: 60_000 };

    expect(rateLimit(key, opts).allowed).toBe(true);
    expect(rateLimit(key, opts).allowed).toBe(true);
    expect(rateLimit(key, opts).allowed).toBe(true);

    const blocked = rateLimit(key, opts);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window elapses", () => {
    const key = `test:${Math.random()}`;
    const opts = { limit: 1, windowMs: 1 };
    expect(rateLimit(key, opts).allowed).toBe(true);
    // Different key is independent.
    expect(rateLimit(`${key}:other`, opts).allowed).toBe(true);
  });

  it("isolates counts per key", () => {
    const a = `a:${Math.random()}`;
    const b = `b:${Math.random()}`;
    const opts = { limit: 1, windowMs: 60_000 };
    expect(rateLimit(a, opts).allowed).toBe(true);
    expect(rateLimit(a, opts).allowed).toBe(false);
    expect(rateLimit(b, opts).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prefers the first x-forwarded-for entry", () => {
    const req = new Request("https://x.test", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to unknown when no headers present", () => {
    const req = new Request("https://x.test");
    expect(getClientIp(req)).toBe("unknown");
  });
});
