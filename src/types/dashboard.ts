// Shared Dashboard types for the frontend UI

export interface DashboardSummary {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
}

export interface DashboardTransaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "INCOME" | "EXPENSE";
}

export interface DashboardInsight {
  id: number;
  title: string;
  description: string;
  type: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardInvoice {
  id: string;
  cardName: string;
  brand: string;
  lastFourDigits: string;
  personName: string;
  amount: number;
  dueDate: string;
  isOverdue: boolean;
}

export interface DashboardData {
  summary: DashboardSummary;
  transactions: DashboardTransaction[];
  insights: DashboardInsight[];
  monthly?: MonthlyData[];
  invoices?: DashboardInvoice[];
}

export type SectionId = "overview" | "invoices" | "transactions" | "charts" | "goals" | "insights";
