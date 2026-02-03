export interface AssetRequest {
  name: string;
  type: AssetType;
  purchaseValue?: number;
  currentValue: number;
  purchaseDate?: string; // YYYY-MM-DD
}

export interface AssetResponse {
  id: string;
  name: string;
  type: AssetType;
  purchaseValue?: number | null;
  currentValue: number;
  purchaseDate?: string | null;
  syncedFromInvestment: boolean;
  investmentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssetTotalValueResponse {
  totalValue: number;
}

export enum AssetType {
  IMOVEL = "IMOVEL",
  VEICULO = "VEICULO",
  INVESTIMENTO = "INVESTIMENTO",
  OUTROS = "OUTROS",
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  [AssetType.IMOVEL]: "Imóvel",
  [AssetType.VEICULO]: "Veículo",
  [AssetType.INVESTIMENTO]: "Investimento",
  [AssetType.OUTROS]: "Outros",
};
