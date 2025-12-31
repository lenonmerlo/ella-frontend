import { http } from "../../lib/http";

export type CriticalReason =
  | "HIGH_VALUE"
  | "RISK_CATEGORY"
  | "SUSPICIOUS_DESCRIPTION"
  | "DUPLICATE_SAME_DAY"
  | "OTHER";

export interface CriticalTransactionResponseDTO {
  id: string;
  personId: string;
  personName: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  scope?: "PERSONAL" | "BUSINESS";
  category: string;
  tripId?: string | null;
  tripSubcategory?: string | null;
  transactionDate: string;
  purchaseDate?: string | null;
  dueDate?: string | null;
  paidDate?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  critical: boolean;
  criticalReason?: CriticalReason | null;
  criticalReviewed: boolean;
  criticalReviewedAt?: string | null;
}

export interface CriticalTransactionsStatsDTO {
  totalCritical: number;
  totalUnreviewed: number;
  byReason: Record<string, number>;
}

export async function fetchCriticalTransactions(personId: string) {
  const res = await http.get<{ data: CriticalTransactionResponseDTO[] }>("/transactions/critical", {
    params: { personId },
  });
  return res.data.data;
}

export async function fetchCriticalTransactionsStats(personId: string) {
  const res = await http.get<{ data: CriticalTransactionsStatsDTO }>(
    "/transactions/critical/stats",
    { params: { personId } },
  );
  return res.data.data;
}

export async function markCriticalTransactionReviewed(id: string) {
  const res = await http.post<{ data: CriticalTransactionResponseDTO }>(
    `/transactions/critical/${id}/review`,
  );
  return res.data.data;
}
