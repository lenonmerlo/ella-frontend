import { http } from "../../lib/http";

export interface SummaryDTO {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate?: number;
}

export async function fetchSummary(personId: string, year: number, month: number) {
  const res = await http.get<{ data: SummaryDTO }>(`/dashboard/${personId}/summary`, {
    params: { year, month },
  });
  return res.data.data;
}
