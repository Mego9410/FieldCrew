import { describe, it, expect } from "vitest";
import {
  twoFactorCookieValue,
  isValidTwoFactorCookie,
} from "@/lib/security/twoFactorCookie";

describe("twoFactorCookie", () => {
  it("produces a stable value for the same user id", async () => {
    const a = await twoFactorCookieValue("user-123");
    const b = await twoFactorCookieValue("user-123");
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it("produces different values for different users", async () => {
    const a = await twoFactorCookieValue("user-123");
    const b = await twoFactorCookieValue("user-456");
    expect(a).not.toBe(b);
  });

  it("validates a matching cookie and rejects a foreign/empty one", async () => {
    const value = await twoFactorCookieValue("user-123");
    expect(await isValidTwoFactorCookie("user-123", value)).toBe(true);
    expect(await isValidTwoFactorCookie("user-456", value)).toBe(false);
    expect(await isValidTwoFactorCookie("user-123", "")).toBe(false);
    expect(await isValidTwoFactorCookie("user-123", undefined)).toBe(false);
    expect(await isValidTwoFactorCookie("user-123", "1")).toBe(false);
  });
});
