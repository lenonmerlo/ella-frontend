import { http } from "../../lib/http";
import type {
  InvestmentRequest,
  InvestmentResponse,
  InvestmentSummaryResponse,
} from "../../types/investment";

function unwrap<T>(data: any): T {
  return (data?.data ?? data) as T;
}

export async function fetchInvestmentsSummary(
  personId: string,
): Promise<InvestmentSummaryResponse> {
  const res = await http.get<any>(`/investments/person/${personId}`);
  return unwrap<InvestmentSummaryResponse>(res.data);
}

export async function createInvestment(
  personId: string,
  payload: InvestmentRequest,
): Promise<InvestmentResponse> {
  const res = await http.post<any>(`/investments`, payload, { params: { personId } });
  return unwrap<InvestmentResponse>(res.data);
}

export async function updateInvestment(
  investmentId: string,
  payload: InvestmentRequest,
): Promise<InvestmentResponse> {
  const res = await http.put<any>(`/investments/${investmentId}`, payload);
  return unwrap<InvestmentResponse>(res.data);
}

export async function deleteInvestment(investmentId: string): Promise<void> {
  await http.delete(`/investments/${investmentId}`);
}
