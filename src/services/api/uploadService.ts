import {
  DashboardDataLocal,
  DashboardInsightLocal,
  DashboardSummaryLocal,
  DashboardTransactionLocal,
} from "../../lib/dashboard";
import { http } from "../../lib/http";

export async function uploadInvoice(
  file: File,
  password?: string,
  dueDate?: string,
): Promise<DashboardDataLocal> {
  const formData = new FormData();
  formData.append("file", file);
  if (password) {
    formData.append("password", password);
  }
  if (dueDate) {
    formData.append("dueDate", dueDate);
  }

  const response = await http.post<any>("/invoices/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const raw = response.data?.data ?? response.data;
  if (!raw) throw new Error("Resposta vazia do upload de fatura");

  const summary: DashboardSummaryLocal = {
    balance: Number(raw.summary?.balance ?? 0),
    totalIncome: Number(raw.summary?.totalIncome ?? 0),
    totalExpenses: Number(raw.summary?.totalExpenses ?? 0),
    savingsRate: Number(raw.summary?.savingsRate ?? 0),
  };

  const transactions: DashboardTransactionLocal[] = Array.isArray(raw.transactions)
    ? raw.transactions.map((t: any, idx: number) => ({
        id: idx + 1,
        description: String(t.description ?? ""),
        amount: Number(t.amount ?? 0),
        category: String(t.category ?? ""),
        date: String(t.transactionDate ?? t.date ?? ""),
        type: String(t.type ?? "EXPENSE").toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE",
      }))
    : [];

  const insights: DashboardInsightLocal[] = Array.isArray(raw.insights)
    ? raw.insights.map((i: any, idx: number) => ({
        id: Number(i.id ?? idx + 1),
        title: String(i.title ?? ""),
        description: String(i.description ?? ""),
        type: String(i.type ?? "TIP"),
        priority: ["HIGH", "MEDIUM", "LOW"].includes(String(i.priority))
          ? (i.priority as "HIGH" | "MEDIUM" | "LOW")
          : "LOW",
      }))
    : [];

  const startDate = raw.startDate ? String(raw.startDate) : undefined;
  const endDate = raw.endDate ? String(raw.endDate) : undefined;

  return { summary, transactions, insights, startDate, endDate };
}
