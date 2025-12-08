import { CategoryBreakdownDTO, MonthlyEvolutionDTO } from "../../lib/dashboard";
import { http } from "../../lib/http";

export interface ChartsDTO {
  monthlyEvolution: MonthlyEvolutionDTO;
  categoryBreakdown: CategoryBreakdownDTO[];
}

export async function fetchCharts(personId: string, year: number) {
  const res = await http.get<{ data: ChartsDTO }>(`/dashboard/${personId}/charts`, {
    params: { year },
  });
  return res.data.data;
}
