import { http } from "../../lib/http";
import type { BudgetRequest, BudgetResponse } from "../../types/budget";

function unwrap<T>(data: any): T {
  return (data?.data ?? data) as T;
}

export async function fetchBudget(personId: string): Promise<BudgetResponse> {
  const res = await http.get<any>(`/budget/${personId}`);
  return unwrap<BudgetResponse>(res.data);
}

export async function createBudget(
  personId: string,
  payload: BudgetRequest,
): Promise<BudgetResponse> {
  const res = await http.post<any>(`/budget`, payload, { params: { personId } });
  return unwrap<BudgetResponse>(res.data);
}

export async function updateBudget(
  budgetId: string,
  payload: BudgetRequest,
): Promise<BudgetResponse> {
  const res = await http.put<any>(`/budget/${budgetId}`, payload);
  return unwrap<BudgetResponse>(res.data);
}
