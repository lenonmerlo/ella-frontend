import { useEffect, useState } from "react";
import { ChartsDTO, fetchCharts } from "../services/api/chartsService";

interface Props {
  personId: string;
  year: number;
  month?: number;
  children: (props: {
    data: ChartsDTO | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export function ChartsController({ personId, year, month, children }: Props) {
  const [data, setData] = useState<ChartsDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) return;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchCharts(personId, year, month);
        setData(result);
      } catch (err) {
        setError("Erro ao carregar gráficos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [personId, year, month]);

  return <>{children({ data, loading, error })}</>;
}
