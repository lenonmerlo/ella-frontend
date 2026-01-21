export function formatCurrency(value: number, currency: string = "BRL"): string {
  const safe = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    // Fallback simples caso Intl/currency falhe
    return `R$ ${safe.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

export function parseNumberInput(value: string): number {
  // Permite campo vazio sem virar NaN
  if (!value) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
