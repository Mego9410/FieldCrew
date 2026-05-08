/**
 * Minimal RFC 4180-style CSV helpers for browser blob downloads.
 */

export type CsvPrimitive = string | number | boolean | null | undefined;

function cellToString(value: CsvPrimitive): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

/** Quote when the field contains comma, quote, or newline. */
export function escapeCsvCell(value: CsvPrimitive): string {
  const s = cellToString(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsvString(
  headers: string[],
  dataRows: CsvPrimitive[][],
  options?: { bom?: boolean }
): string {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...dataRows.map((row) => row.map(escapeCsvCell).join(",")),
  ];
  const body = lines.join("\n");
  return (options?.bom ? "\ufeff" : "") + body;
}

export function csvStringToBlob(csv: string): Blob {
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}
