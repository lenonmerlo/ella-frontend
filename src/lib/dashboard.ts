/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken, parseJwt } from "./auth";
import { http } from "./http";

// Tipos compatíveis com o backend
export interface SummaryDTO {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  projectedBalance: number;
}

export interface TotalsDTO {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryBreakdownDTO {
  category: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyEvolutionDTO {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface GoalProgressDTO {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  completionPercentage: number;
}

export interface InvoiceSummaryDTO {
  id: string;
  amount: number;
  dueDate: string;
  status: string;
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
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export interface DashboardResponseDTO {
  personId: string;
  personalSummary?: SummaryDTO;
  personalTotals?: TotalsDTO;
  personalCategoryBreakdown?: CategoryBreakdownDTO[];
  personalMonthlyEvolution?: MonthlyEvolutionDTO[];
  goalProgress?: GoalProgressDTO;
  personalInvoices?: InvoiceSummaryDTO[];
  companies?: CompanyDashboardDTO[];
  consolidatedTotals?: ConsolidatedTotalsDTO;
}

export interface DashboardRequestDTO {
  personId: string;
  year: number;
  month: number;
}

/**
 * Extrai o personId do JWT armazenado no token.
 * Nota: O backend retorna 'id' no payload do token.
 */
export function getPersonIdFromToken(): string | null {
  const token = getToken();
  if (!token) return null;

  const payload = parseJwt(token);
  return payload?.id ?? null;
}

/**
 * Busca dashboard rápido (overview) para uma pessoa.
 * GET /api/dashboard/quick/{personId}
 */
export async function fetchQuickDashboard(personId: string): Promise<DashboardResponseDTO | null> {
  try {
    const res = await http.get<{ data: DashboardResponseDTO }>(`/dashboard/quick/${personId}`);
    return res.data?.data ?? null;
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
    const res = await http.post<{ data: DashboardResponseDTO }>("/dashboard", {
      personId,
      year,
      month,
    });
    return res.data?.data ?? null;
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

  return fetchDashboard(personId, year, month);
}
