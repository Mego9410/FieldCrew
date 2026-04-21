import { generateSecret as otplibGenerateSecret, generateURI, verifySync } from "otplib";
import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { encryptString, decryptString } from "@/lib/security/crypto";

const TOTP_PERIOD_SECONDS = 30;
const TOTP_EPOCH_TOLERANCE = 1;

export type TwoFactorRow = {
  owner_user_id: string;
  enabled: boolean;
  secret_enc: string | null;
  recovery_codes: unknown;
};

export async function getTwoFactorRow(db: SupabaseClient, ownerUserId: string): Promise<TwoFactorRow | null> {
  const { data, error } = await db
    .from("owner_two_factor")
    .select("owner_user_id, enabled, secret_enc, recovery_codes")
    .eq("owner_user_id", ownerUserId)
    .maybeSingle();
  if (error) return null;
  return (data as TwoFactorRow | null) ?? null;
}

export async function upsertTwoFactorSecret(db: SupabaseClient, ownerUserId: string, secret: string): Promise<void> {
  const secretEnc = encryptString(secret);
  await db
    .from("owner_two_factor")
    .upsert(
      {
        owner_user_id: ownerUserId,
        enabled: false,
        secret_enc: secretEnc,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "owner_user_id" }
    );
}

export function buildOtpAuthUrl(opts: { email: string; secret: string }): string {
  return generateURI({
    strategy: "totp",
    issuer: "FieldCrew",
    label: opts.email,
    secret: opts.secret,
    period: TOTP_PERIOD_SECONDS,
  });
}

export function verifyTotpCode(secret: string, code: string): boolean {
  const cleaned = code.replace(/\s+/g, "");
  const result = verifySync({
    strategy: "totp",
    secret,
    token: cleaned,
    period: TOTP_PERIOD_SECONDS,
    epochTolerance: TOTP_EPOCH_TOLERANCE,
  });
  return result.valid;
}

export function generateSecret(): string {
  return otplibGenerateSecret();
}

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function generateRecoveryCodes(count = 10): { plain: string[]; hashes: string[] } {
  const plain: string[] = [];
  const hashes: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = crypto.randomBytes(2).toString("hex");
    const b = crypto.randomBytes(2).toString("hex");
    const code = `${a}-${b}`.toLowerCase();
    plain.push(code);
    hashes.push(sha256Hex(code));
  }
  return { plain, hashes };
}

type RecoveryCodeRecord = { hash: string; used_at: string | null };

export function parseRecoveryCodesJson(v: unknown): RecoveryCodeRecord[] {
  if (!Array.isArray(v)) return [];
  const out: RecoveryCodeRecord[] = [];
  for (const item of v) {
    if (!item || typeof item !== "object") continue;
    const hash = (item as { hash?: unknown }).hash;
    const used_at = (item as { used_at?: unknown }).used_at;
    if (typeof hash !== "string" || !hash) continue;
    out.push({
      hash,
      used_at: typeof used_at === "string" ? used_at : null,
    });
  }
  return out;
}

export function recoveryCodesToJson(hashes: string[]): RecoveryCodeRecord[] {
  return hashes.map((h) => ({ hash: h, used_at: null }));
}

export function tryConsumeRecoveryCode(records: RecoveryCodeRecord[], code: string): { ok: boolean; next: RecoveryCodeRecord[] } {
  const h = sha256Hex(code.trim().toLowerCase());
  const next = records.map((r) => ({ ...r }));
  const idx = next.findIndex((r) => r.hash === h);
  if (idx < 0) return { ok: false, next: records };
  if (next[idx]!.used_at) return { ok: false, next: records };
  next[idx]!.used_at = new Date().toISOString();
  return { ok: true, next };
}

export function decryptSecret(secretEnc: string): string {
  return decryptString(secretEnc);
}

