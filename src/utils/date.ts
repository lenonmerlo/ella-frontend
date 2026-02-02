const ISO_DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseISODateLike(value: string): Date {
  const s = String(value ?? "").trim();
  const match = ISO_DATE_ONLY_RE.exec(s);
  if (match) {
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);
    return new Date(year, monthIndex, day);
  }
  return new Date(s);
}

export function tryParseISODateLike(value?: string | null): Date | null {
  if (!value) return null;
  const d = parseISODateLike(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDatePtBR(value?: string | null): string {
  if (!value) return "--";
  const d = tryParseISODateLike(value);
  return d ? d.toLocaleDateString("pt-BR") : String(value);
}
