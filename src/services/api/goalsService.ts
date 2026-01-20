import { GoalProgressDTO } from "../../lib/dashboard";
import { http } from "../../lib/http";

export interface GoalListDTO {
  goals: GoalProgressDTO[];
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

export async function fetchGoals(personId: string) {
  const res = await http.get<{ data: GoalListDTO }>(`/dashboard/${personId}/goals`);
  return res.data.data;
}

export async function createGoal(data: CreateGoalDTO) {
  const res = await http.post<{ data: GoalProgressDTO }>("/goals", data);
  return res.data?.data;
}

export async function updateGoal(id: string, data: CreateGoalDTO) {
  const res = await http.put<{ data: GoalProgressDTO }>(`/goals/${id}`, data);
  return res.data?.data;
}

export async function deleteGoal(id: string) {
  await http.delete(`/goals/${id}`);
}
