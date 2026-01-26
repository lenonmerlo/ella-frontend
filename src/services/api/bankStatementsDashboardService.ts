import { http } from "../../lib/http";

export interface BankStatementDashboardSummaryDTO {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface BankStatementDashboardTransactionDTO {
  id: string;
  transactionDate: string;
  description: string;
  amount: number;
  balance?: number | null;
  type?: string | null;
}

export interface BankStatementDashboardResponseDTO {
  summary: BankStatementDashboardSummaryDTO;
  transactions: BankStatementDashboardTransactionDTO[];
}

export async function fetchBankStatementsDashboard(
  personId: string,
  year: number,
  month: number,
): Promise<BankStatementDashboardResponseDTO> {
  const res = await http.get<{ data: BankStatementDashboardResponseDTO }>(
    `/dashboard/bank-statements/${personId}`,
    {
      params: { year, month },
    },
  );

  return res.data.data;
}
