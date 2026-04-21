import crypto from "crypto";

function getKey(): Buffer {
  const raw = process.env.TOTP_ENCRYPTION_KEY ?? "";
  // Expect base64 32 bytes (AES-256-GCM)
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("TOTP_ENCRYPTION_KEY must be base64-encoded 32 bytes");
  }
  return key;
}

export function encryptString(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // base64(iv).base64(tag).base64(enc)
  return [iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(".");
}

export function decryptString(payload: string): string {
  const key = getKey();
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) throw new Error("Invalid encrypted payload");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString("utf8");
}

