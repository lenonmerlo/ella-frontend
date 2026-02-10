import {
  DashboardDataLocal,
  DashboardInsightLocal,
  DashboardSummaryLocal,
  DashboardTransactionLocal,
} from "../../lib/dashboard";
import { http } from "../../lib/http";

export interface BankStatementUploadResponse {
  bankStatementId: string;
  bank: string;
  statementDate: string;
  openingBalance: number;
  closingBalance: number;
  creditLimit: number;
  availableLimit: number;
  transactionCount: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: Array<{
    id: string;
    transactionDate: string;
    description: string;
    amount: number;
    balance: number;
    type: "CREDIT" | "DEBIT";
  }>;
}

export async function uploadBankStatement(
  file: File,
  password?: string,
  bank: "ITAU_PERSONNALITE" | "ITAU" | "C6" | "NUBANK" | "BRADESCO" = "ITAU_PERSONNALITE",
): Promise<BankStatementUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bank", bank);
  if (password) {
    formData.append("password", password);
  }

  const response = await http.post<any>("/bank-statements/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120_000,
  });

  const raw = response.data?.data ?? response.data;
  if (!raw) throw new Error("Resposta vazia do upload de extrato");

  return {
    bankStatementId: String(raw.bankStatementId ?? ""),
    bank: String(raw.bank ?? "ITAU"),
    statementDate: String(raw.statementDate ?? ""),
    openingBalance: Number(raw.openingBalance ?? 0),
    closingBalance: Number(raw.closingBalance ?? 0),
    creditLimit: Number(raw.creditLimit ?? 0),
    availableLimit: Number(raw.availableLimit ?? 0),
    transactionCount: Number(raw.transactionCount ?? 0),
    totalIncome: Number(raw.totalIncome ?? 0),
    totalExpenses: Number(raw.totalExpenses ?? 0),
    transactions: Array.isArray(raw.transactions)
      ? raw.transactions.map((t: any) => ({
          id: String(t.id ?? ""),
          transactionDate: String(t.transactionDate ?? ""),
          description: String(t.description ?? ""),
          amount: Number(t.amount ?? 0),
          balance: Number(t.balance ?? 0),
          type: String(t.type ?? "DEBIT") as "CREDIT" | "DEBIT",
        }))
      : [],
  };
}

// NOTE: Imports kept to match existing app patterns/types.
// These are intentionally unused for now.
void (0 as unknown as DashboardDataLocal);
void (0 as unknown as DashboardInsightLocal);
void (0 as unknown as DashboardSummaryLocal);
void (0 as unknown as DashboardTransactionLocal);
