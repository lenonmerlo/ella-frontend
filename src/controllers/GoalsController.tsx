import { useCallback, useEffect, useState } from "react";
import { fetchGoals, GoalListDTO } from "../services/api/goalsService";

interface Props {
  personId: string;
  children: (props: {
    data: GoalListDTO | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
  }) => React.ReactNode;
}

export function GoalsController({ personId, children }: Props) {
  const [data, setData] = useState<GoalListDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!personId) return;
    setLoading(true);
    try {
      const result = await fetchGoals(personId);
      setData(result);
    } catch (err) {
      setError("Erro ao carregar metas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    load();
  }, [load]);

  return <>{children({ data, loading, error, refresh: load })}</>;
}
