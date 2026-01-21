export interface InvestmentRequest {
  name: string;
  type: InvestmentType;
  initialValue: number;
  currentValue: number;
  investmentDate: string; // YYYY-MM-DD
  description?: string;
}

export interface InvestmentResponse {
  id: string;
  name: string;
  type: InvestmentType;
  initialValue: number;
  currentValue: number;
  investmentDate: string;
  description?: string;
  profitability: number; // percentual
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentSummaryResponse {
  totalInvested: number;
  totalCurrent: number;
  totalProfitability: number; // percentual
  investments: InvestmentResponse[];
}

export enum InvestmentType {
  SAVINGS = "SAVINGS",
  FIXED_INCOME = "FIXED_INCOME",
  VARIABLE_INCOME = "VARIABLE_INCOME",
  CRYPTOCURRENCY = "CRYPTOCURRENCY",
  REAL_ESTATE = "REAL_ESTATE",
  OTHER = "OTHER",
}

export const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  [InvestmentType.SAVINGS]: "Poupança",
  [InvestmentType.FIXED_INCOME]: "Renda Fixa",
  [InvestmentType.VARIABLE_INCOME]: "Renda Variável",
  [InvestmentType.CRYPTOCURRENCY]: "Criptomoedas",
  [InvestmentType.REAL_ESTATE]: "Imóvel",
  [InvestmentType.OTHER]: "Outro",
};
