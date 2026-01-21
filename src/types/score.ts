export interface Score {
  id: string;
  personId: string;
  scoreValue: number; // 0-100
  calculationDate: string; // ISO date
  creditUtilizationScore: number;
  onTimePaymentScore: number;
  spendingDiversityScore: number;
  spendingConsistencyScore: number;
  creditHistoryScore: number;
}
