/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DashboardData } from "../../types/dashboard";
import type { DashboardResponseDTO } from "../dashboard";

/**
 * Maps DashboardResponseDTO (backend) to DashboardData (frontend UI model)
 */
export function mapBackendToDashboard(backendData: DashboardResponseDTO): DashboardData {
  const monthIncome = backendData.personalTotals?.monthIncome ?? 0;
  const monthExpenses = backendData.personalTotals?.monthExpenses ?? 0;
  const balance = monthIncome - monthExpenses;
  const savingsRate = monthIncome > 0 ? Math.round((balance / monthIncome) * 100) : 0;

  const transactions = (backendData.personalTransactions ?? []).map((tx: any, idx: number) => ({
    id: idx + 1,
    description: tx.description ?? "",
    amount: Number(tx.amount ?? 0),
    category: tx.category ?? "",
    date: tx.transactionDate ?? tx.date ?? "",
    type: (String(tx.type ?? "EXPENSE").toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE") as
      | "INCOME"
      | "EXPENSE",
  }));

  const insights = [] as DashboardData["insights"];
  // Mensagem amigável quando não há transações
  if (!backendData.personalTransactions || backendData.personalTransactions.length === 0) {
    insights.push({
      id: 1,
      title: "Bem-vindo ao Ella! 👋",
      description: "Faça upload da sua fatura para começar a acompanhar suas finanças.",
      type: "INFO",
      priority: "HIGH",
    });
  }
  if (savingsRate >= 30) {
    insights.push({
      id: 1,
      title: "Ótima taxa de poupança! 🎉",
      description: `Você está economizando ${savingsRate}% da sua renda mensal. Continue assim para atingir suas metas ainda mais rápido!`,
      type: "TIP",
      priority: "HIGH",
    });
  }

  const monthly: DashboardData["monthly"] = [];
  if (backendData.personalMonthlyEvolution?.points) {
    for (const point of backendData.personalMonthlyEvolution.points) {
      monthly.push({
        month: point.monthLabel ?? "",
        income: Number(point.income ?? 0),
        expense: Number(point.expenses ?? 0),
      });
    }
  }

  const invoices = (backendData.personalInvoices ?? []).map((inv: any) => ({
    id: inv.creditCardId,
    cardName: inv.creditCardName ?? "Cartão",
    brand: inv.creditCardBrand ?? "",
    lastFourDigits: inv.creditCardLastFourDigits ?? "****",
    personName: inv.personName ?? "",
    amount: Number(inv.totalAmount ?? 0),
    dueDate: inv.dueDate ?? "",
    isOverdue: Boolean(inv.isOverdue),
  }));

  return {
    summary: {
      balance,
      totalIncome: monthIncome,
      totalExpenses: monthExpenses,
      savingsRate,
    },
    transactions,
    insights,
    monthly,
    invoices,
  };
}
