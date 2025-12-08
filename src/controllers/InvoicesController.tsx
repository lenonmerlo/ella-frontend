import { useEffect, useState } from "react";
import { fetchInvoices, InvoiceListDTO } from "../services/api/invoicesService";

interface Props {
  personId: string;
  year: number;
  month: number;
  children: (props: {
    data: InvoiceListDTO | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export function InvoicesController({ personId, year, month, children }: Props) {
  const [data, setData] = useState<InvoiceListDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) return;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchInvoices(personId, year, month);
        setData(result);
      } catch (err) {
        setError("Erro ao carregar faturas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [personId, year, month]);

  return <>{children({ data, loading, error })}</>;
}
