export function isValidUsPhoneE164(value: string): boolean {
  const v = value.trim();
  return /^\+1\d{10}$/.test(v);
}

