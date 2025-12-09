// src/lib/goals.ts
import { getPersonIdFromToken } from "./dashboard";
import { http } from "./http";

export interface GoalDTO {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
}

export interface CreateGoalDTO {
  ownerId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: string;
  status?: "ACTIVE" | "COMPLETED" | "ARCHIVED";
}

export async function fetchGoals(): Promise<GoalDTO[]> {
  const personId = getPersonIdFromToken();
  if (!personId) throw new Error("Usuário não autenticado");

  const res = await http.get<{ data: GoalDTO[] }>(`/goals/owner/${personId}`);
  return res.data?.data ?? [];
}

export async function createGoal(data: Omit<CreateGoalDTO, "ownerId">): Promise<GoalDTO> {
  const personId = getPersonIdFromToken();
  if (!personId) throw new Error("Usuário não autenticado");

  const payload: CreateGoalDTO = {
    ...data,
    ownerId: personId,
    status: "ACTIVE",
  };

  const res = await http.post<{ data: GoalDTO }>("/goals", payload);
  return res.data?.data;
}

export async function updateGoal(id: string, data: Partial<CreateGoalDTO>): Promise<GoalDTO> {
  const res = await http.put<{ data: GoalDTO }>(`/goals/${id}`, data);
  return res.data?.data;
}

export async function deleteGoal(id: string): Promise<void> {
  await http.delete(`/goals/${id}`);
}
