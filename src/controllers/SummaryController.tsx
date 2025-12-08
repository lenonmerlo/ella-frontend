import { useEffect, useState } from "react";
import { fetchSummary, SummaryDTO } from "../services/api/summaryService";

interface Props {
  personId: string;
  year: number;
  month: number;
  children: (props: {
    data: SummaryDTO | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export function SummaryController({ personId, year, month, children }: Props) {
  const [data, setData] = useState<SummaryDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) return;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchSummary(personId, year, month);
        setData(result);
      } catch (err) {
        setError("Erro ao carregar resumo");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [personId, year, month]);

  return <>{children({ data, loading, error })}</>;
}
