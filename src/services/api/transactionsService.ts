import { FinancialTransactionResponseDTO } from "../../lib/dashboard";
import { http } from "../../lib/http";

export interface TransactionListDTO {
  transactions: FinancialTransactionResponseDTO[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface TransactionFilters {
  year?: number;
  month?: number;
  start?: string;
  end?: string;
  category?: string;
  page?: number;
  size?: number;
}

export async function fetchTransactions(personId: string, filters: TransactionFilters) {
  const { year, month, start, end, category, page = 0, size = 50 } = filters;
  const res = await http.get<{ data: TransactionListDTO }>(`/dashboard/${personId}/transactions`, {
    params: { year, month, start, end, category, page, size },
  });
  return res.data.data;
}

export interface FinancialTransactionRequest {
  personId: string;
  description: string;
  amount: number;
  type: string;
  scope?: "PERSONAL" | "BUSINESS";
  category: string;
  transactionDate: string;
  dueDate?: string | null;
  paidDate?: string | null;
  status: string;
}

export async function createTransaction(payload: FinancialTransactionRequest) {
  const res = await http.post<{ data: FinancialTransactionResponseDTO }>("/transactions", payload);
  return res.data.data;
}

export async function updateTransaction(id: string, payload: FinancialTransactionRequest) {
  const res = await http.put<{ data: FinancialTransactionResponseDTO }>(
    `/transactions/${id}`,
    payload,
  );
  return res.data.data;
}

export async function deleteTransaction(id: string) {
  await http.delete(`/transactions/${id}`);
}
