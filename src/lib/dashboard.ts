/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken, parseJwt } from "./auth";
import { http } from "./http";

// ✅ Tipos compatíveis com o backend (atualizados)
export interface SummaryDTO {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface TotalsDTO {
  monthIncome: number;
  monthExpenses: number;
  yearIncome: number;
  yearExpenses: number;
}

export interface CategoryBreakdownDTO {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyPointDTO {
  monthLabel: string;
  income: number;
  expenses: number;
}

export interface MonthlyEvolutionDTO {
  points: MonthlyPointDTO[];
}

export interface GoalProgressDTO {
  id?: string;
  goalId?: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  percentage: number;
  status: string;
  deadline?: string;
}

export interface InvoiceSummaryDTO {
  invoiceId?: string;
  creditCardId: string;
  creditCardName: string;
  creditCardBrand?: string;
  creditCardLastFourDigits?: string;
  personName?: string;
  totalAmount: number;
  dueDate: string;
  isOverdue: boolean;
  isPaid?: boolean;
  paidDate?: string;
}

export interface FinancialTransactionResponseDTO {
  id: string;
  personId: string;
  personName: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE" | "DEBIT" | "CREDIT" | "PIX" | "TRANSFER" | "CASH";
  scope?: "PERSONAL" | "BUSINESS";
  category: string;
  tripId?: string;
  tripSubcategory?: string;
  transactionDate: string;
  dueDate?: string;
  paidDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  // Optional credit card metadata (present for invoice-uploaded transactions)
  creditCardId?: string | null;
  creditCardName?: string | null;
  creditCardLastFourDigits?: string | null;
  creditCardCardholderName?: string | null;
}

export interface CompanyDashboardDTO {
  companyId: string;
  companyName: string;
  summary: SummaryDTO;
  totals: TotalsDTO;
  categoryBreakdown: CategoryBreakdownDTO[];
  invoices: InvoiceSummaryDTO[];
}

export interface ConsolidatedTotalsDTO {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

// ✅ CORRIGIDO: Adicionado personalTransactions
export interface DashboardResponseDTO {
  personId: string;
  personalSummary?: SummaryDTO;
  personalTotals?: TotalsDTO;
  personalCategoryBreakdown?: CategoryBreakdownDTO[];
  personalMonthlyEvolution?: MonthlyEvolutionDTO;
  goalProgress?: GoalProgressDTO;
  personalInvoices?: InvoiceSummaryDTO[];
  personalTransactions?: FinancialTransactionResponseDTO[]; // ✅ NOVO
  companies?: CompanyDashboardDTO[];
  consolidatedTotals?: ConsolidatedTotalsDTO;
}

export interface DashboardRequestDTO {
  personId: string;
  year: number;
  month: number;
}

// Estrutura esperada pelo Dashboard local após upload
export interface DashboardSummaryLocal {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
}

export interface DashboardTransactionLocal {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "INCOME" | "EXPENSE";
}

export interface DashboardInsightLocal {
  id: number;
  title: string;
  description: string;
  type: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface DashboardDataLocal {
  summary: DashboardSummaryLocal;
  transactions: DashboardTransactionLocal[];
  insights: DashboardInsightLocal[];
  startDate?: string;
  endDate?: string;
  tripSuggestion?: TripSuggestionLocal;
}

export interface TripSuggestionLocal {
  tripId: string;
  startDate: string;
  endDate: string;
  transactionIds: string[];
  message?: string;
}

/**
 * Extrai o personId do JWT armazenado no token.
 * Nota: O backend retorna 'id' no payload do token.
 */
export function getPersonIdFromToken(): string | null {
  const token = getToken();
  if (!token) return null;

  const payload = parseJwt(token);
  // Aceita múltiplas chaves possíveis para o id
  const possible = payload?.id || payload?.personId || payload?.userId || payload?.sub;
  if (!possible) return null;
  return String(possible);
}

/**
 * Busca dashboard rápido (overview) para uma pessoa.
 * GET /api/dashboard/quick/{personId}
 */
export async function fetchQuickDashboard(personId: string): Promise<DashboardResponseDTO | null> {
  try {
    console.log("[API] GET /dashboard/quick/", personId);
    const res = await http.get<any>(`/dashboard/quick/${personId}`);
    console.log("[API] /dashboard/quick response:", res.status, res.data);
    const payload = res.data?.data ?? res.data;
    return payload ?? null;
  } catch (error) {
    console.error("Erro ao buscar quick dashboard:", error);
    throw error;
  }
}

export async function getInvoices(): Promise<DashboardResponseDTO | null> {
  try {
    const res = await http.get<any>("/invoices");
    console.log("[API] /invoices response:", res.status, res.data);
    const payload = res.data?.data ?? res.data;
    return payload ?? null;
  } catch (error) {
    console.error("Erro ao buscar quick dashboard:", error);
    throw error;
  }
}

/**
 * Busca dashboard completo com filtros.
 * POST /api/dashboard
 */
export async function fetchDashboard(
  personId: string,
  year: number,
  month: number,
): Promise<DashboardResponseDTO | null> {
  try {
    console.log("[API] POST /dashboard", { personId, year, month });
    const res = await http.post<any>("/dashboard", {
      personId,
      year,
      month,
    });
    console.log("[API] /dashboard response:", res.status, res.data);
    const payload = res.data?.data ?? res.data;
    return payload ?? null;
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);
    throw error;
  }
}

/**
 * Busca dashboard completo para a pessoa autenticada.
 */
export async function fetchCurrentUserDashboard(
  year: number,
  month: number,
): Promise<DashboardResponseDTO | null> {
  const personId = getPersonIdFromToken();
  if (!personId) {
    throw new Error("Não foi possível extrair personId do token");
  }
  console.debug("[Auth] personId extraído do token:", personId);
  // Preferir dashboard rápido centralizado no backend; fallback para completo
  try {
    const quick = await fetchQuickDashboard(personId);
    if (quick) return quick;
  } catch (e) {
    console.warn("[API] Falha no quick dashboard, tentando completo:", e);
  }
  return fetchDashboard(personId, year, month);
}

/**
 * Fallback: busca transações persistidas para a pessoa no período.
 * GET /api/transactions/person/{personId}/period?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
export async function fetchCurrentUserTransactionsInPeriod(
  start: string,
  end: string,
): Promise<DashboardTransactionLocal[]> {
  const personId = getPersonIdFromToken();
  if (!personId) throw new Error("PersonId ausente no token");

  console.debug("[API] GET /transactions/person/period", { personId, start, end });
  const res = await http.get<{ data: any[] }>(`/transactions/person/${personId}/period`, {
    params: { start, end },
  });
  console.debug("[API] /transactions/person/period response:", res.status, res.data);

  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list.map((t: any, idx: number) => ({
    id: idx + 1,
    description: String(t.description ?? ""),
    amount: Number(t.amount ?? 0),
    category: String(t.category ?? ""),
    date: String(t.transactionDate ?? t.date ?? ""),
    type: String(t.type ?? "EXPENSE").toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE",
  }));
}

/**
 * Upload real de fatura (CSV prioritário; PDF futuramente)
 * POST /api/invoices/upload
 * multipart/form-data com campo "file"
 * Retorno esperado: { summary, transactions, insights }
 */
export async function uploadInvoice(file: File, password?: string): Promise<DashboardDataLocal> {
  const formData = new FormData();
  formData.append("file", file);
  if (password) {
    formData.append("password", password);
  }

  console.debug("[API] POST /invoices/upload (multipart)", { name: file.name, size: file.size });
  const response = await http.post<any>("/invoices/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("[API] /invoices/upload response:", response.status, response.data);

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
