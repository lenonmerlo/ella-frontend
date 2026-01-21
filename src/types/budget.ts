export interface BudgetRequest {
  income: number;
  essentialFixedCost: number;
  necessaryFixedCost: number;
  variableFixedCost: number;
  investment: number;
  plannedPurchase: number;
  protection: number;
}

export interface BudgetResponse {
  id: string;

  // Entrada
  income: number;
  essentialFixedCost: number;
  necessaryFixedCost: number;
  variableFixedCost: number;
  investment: number;
  plannedPurchase: number;
  protection: number;

  // Calculados
  total: number;
  balance: number;

  // Regra 50/30/20
  necessitiesPercentage: number;
  desiresPercentage: number;
  investmentsPercentage: number;

  // Recomendações
  recommendation: string;
  isHealthy: boolean;

  // Auditoria
  createdAt: string;
  updatedAt: string;
}
