import { http } from "../../lib/http";

export interface InsightDTO {
  type: string;
  message: string;
  category: string;
}

export interface InsightListDTO {
  insights: InsightDTO[];
}

export async function fetchInsights(personId: string, year: number, month: number) {
  const res = await http.get<{ data: InsightListDTO }>(`/dashboard/${personId}/insights`, {
    params: { year, month },
  });
  return res.data.data;
}
