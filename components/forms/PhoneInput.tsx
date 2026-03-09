"use client";

import { useState, useEffect } from "react";
import { FormField, FormInput, FormSelect } from "./FormField";

/** Country dial code options; USA first as default. */
export const COUNTRY_CODES = [
  { dial: "1", label: "United States", code: "US" },
  { dial: "1", label: "Canada", code: "CA" },
  { dial: "44", label: "United Kingdom", code: "GB" },
  { dial: "61", label: "Australia", code: "AU" },
  { dial: "64", label: "New Zealand", code: "NZ" },
  { dial: "353", label: "Ireland", code: "IE" },
  { dial: "49", label: "Germany", code: "DE" },
  { dial: "33", label: "France", code: "FR" },
  { dial: "34", label: "Spain", code: "ES" },
  { dial: "39", label: "Italy", code: "IT" },
  { dial: "31", label: "Netherlands", code: "NL" },
  { dial: "52", label: "Mexico", code: "MX" },
  { dial: "55", label: "Brazil", code: "BR" },
  { dial: "91", label: "India", code: "IN" },
  { dial: "81", label: "Japan", code: "JP" },
  { dial: "86", label: "China", code: "CN" },
  { dial: "82", label: "South Korea", code: "KR" },
  { dial: "27", label: "South Africa", code: "ZA" },
  { dial: "971", label: "UAE", code: "AE" },
] as const;

const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // United States

/**
 * Parse a stored phone value (E.164 or loose) into dial code + national number.
 * Used for initial value and when value prop changes.
 */
function parsePhoneValue(value: string): { dial: string; national: string } {
  const digits = value.replace(/\D/g, "");
  if (!digits) return { dial: DEFAULT_COUNTRY.dial, national: "" };
  // Try to match a country by dial code (longest first)
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (digits.startsWith(c.dial)) {
      const national = digits.slice(c.dial.length).replace(/\D/g, "");
      return { dial: c.dial, national };
    }
  }
  // Assume US: 1 + 10 digits or 10 digits
  if (digits.length === 11 && digits.startsWith("1")) {
    return { dial: "1", national: digits.slice(1) };
  }
  if (digits.length === 10) {
    return { dial: "1", national: digits };
  }
  return { dial: DEFAULT_COUNTRY.dial, national: digits };
}

/** Format national number for display (e.g. US 10-digit). */
function formatNational(dial: string, national: string): string {
  const d = national.replace(/\D/g, "");
  if (dial === "1" && d.length <= 10) {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return d;
}

/** Build E.164 from dial + national digits. */
function toE164(dial: string, national: string): string {
  const n = national.replace(/\D/g, "");
  if (!n) return "";
  return `+${dial}${n}`;
}

export interface PhoneInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  "aria-label"?: string;
}

function getInitialState(value: string) {
  const parsed = parsePhoneValue(value);
  return {
    dial: parsed.dial,
    national: parsed.national ? formatNational(parsed.dial, parsed.national) : "",
  };
}

export function PhoneInput({
  id,
  value,
  onChange,
  label = "Phone",
  required,
  placeholder,
  autoComplete = "tel",
  "aria-label": ariaLabel,
}: PhoneInputProps) {
  const [dial, setDial] = useState(() => getInitialState(value).dial);
  const [national, setNational] = useState(() => getInitialState(value).national);
  const countrySelectId = `${id}-country`;

  // Sync from controlled value when it changes externally (e.g. when editing existing worker)
  useEffect(() => {
    const { dial: d, national: n } = getInitialState(value);
    setDial(d);
    setNational(n ? formatNational(d, n) : "");
  }, [value]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = COUNTRY_CODES.find((c) => c.dial === e.target.value);
    const newDial = option?.dial ?? DEFAULT_COUNTRY.dial;
    setDial(newDial);
    const e164 = toE164(newDial, national.replace(/\D/g, ""));
    onChange(e164);
  };

  const handleNationalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const maxLen = dial === "1" ? 10 : 15;
    const limited = raw.slice(0, maxLen);
    const formatted = formatNational(dial, limited);
    setNational(formatted);
    onChange(toE164(dial, limited));
  };

  const displayPlaceholder = placeholder ?? (dial === "1" ? "(555) 123-4567" : "Phone number");

  return (
    <FormField label={label} id={id} required={required}>
      <div className="flex gap-2">
        <FormSelect
          id={countrySelectId}
          value={dial}
          onChange={handleCountryChange}
          className="w-[180px] shrink-0"
          aria-label={ariaLabel ?? "Country code"}
        >
          {COUNTRY_CODES.map((c) => (
            <option key={`${c.code}-${c.dial}`} value={c.dial}>
              {c.label} +{c.dial}
            </option>
          ))}
        </FormSelect>
        <FormInput
          id={id}
          type="tel"
          value={national}
          onChange={handleNationalChange}
          placeholder={displayPlaceholder}
          autoComplete={autoComplete}
          className="flex-1 min-w-0"
          aria-label={ariaLabel ?? label}
        />
      </div>
    </FormField>
  );
}
