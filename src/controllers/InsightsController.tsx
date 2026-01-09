import { useEffect, useState } from "react";
import { fetchInsights, InsightListDTO } from "../services/api/insightsService";

interface Props {
  personId: string;
  year: number;
  month: number;
  children: (props: {
    data: InsightListDTO | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export function InsightsController({ personId, year, month, children }: Props) {
  const [data, setData] = useState<InsightListDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) return;

    console.log("[InsightsController] Loading insights", { personId, year, month });

    async function load() {
      setLoading(true);
      try {
        const result = await fetchInsights(personId, year, month);
        console.log("[InsightsController] Insights response:", result);
        setData(result);
      } catch (err) {
        setError("Erro ao carregar insights");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [personId, year, month]);

  return <>{children({ data, loading, error })}</>;
}
