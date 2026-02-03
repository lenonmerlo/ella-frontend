export type ReportType = "MONTHLY" | "SEMIANNUAL" | "ANNUAL";

export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;

  prevTotalIncome?: number;
  prevTotalExpenses?: number;
  prevBalance?: number;

  incomeChange?: number;
  expensesChange?: number;
  balanceChange?: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
  percent: number;
}

export interface BudgetSection {
  configured?: boolean;
  income?: number;
  essentialFixedCost?: number;
  necessaryFixedCost?: number;
  variableFixedCost?: number;
  investment?: number;
  plannedPurchase?: number;
  protection?: number;
  total?: number;
  balance?: number;
  necessitiesPercentage?: number;
  desiresPercentage?: number;
  investmentsPercentage?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface BankStatementSummary {
  openingBalance?: number | null;
  closingBalance?: number | null;
  totalIncome?: number;
  totalExpenses?: number;
  balance?: number;
  transactionCount?: number;
}

export interface BankStatementTransaction {
  id?: string;
  transactionDate?: string | null;
  description?: string | null;
  amount?: number;
  balance?: number;
  type?: string | null;
}

export interface BankStatementsSection {
  summary?: BankStatementSummary;
  transactions?: BankStatementTransaction[];
  totalTransactions?: number;
  limitedTo?: number;
}

export interface ReportListItem {
  id: string;
  type: ReportType;
  title: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface ReportResponse {
  id: string;
  personId: string;
  type: ReportType;
  title: string;
  periodStart: string;
  periodEnd: string;
  referenceDate: string;
  createdAt: string;

  summary: ReportSummary;
  expensesByCategory: CategoryTotal[];
  incomesByCategory: CategoryTotal[];

  investments?: Record<string, any>;
  assets?: Record<string, any>;
  goals?: Record<string, any>;
  insights?: Array<Record<string, any>>;

  budget?: BudgetSection;
  bankStatements?: BankStatementsSection;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
