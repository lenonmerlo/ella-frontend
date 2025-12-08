import { FinancialTransactionResponseDTO } from "../../lib/dashboard";
import { http } from "../../lib/http";

export interface TransactionListDTO {
  transactions: FinancialTransactionResponseDTO[];
  total: number;
  page: number;
}

export async function fetchTransactions(personId: string, year: number, month: number, limit = 50) {
  const res = await http.get<{ data: TransactionListDTO }>(`/dashboard/${personId}/transactions`, {
    params: { year, month, limit },
  });
  return res.data.data;
}
