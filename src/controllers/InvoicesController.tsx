import { useEffect, useState } from "react";
import { fetchInvoices } from "../services/api/invoicesService";
import type { DashboardInvoice } from "../types/dashboard";

interface Props {
  personId: string;
  year: number;
  month: number;
  children: (props: {
    data: { invoices: DashboardInvoice[] } | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export function InvoicesController({ personId, year, month, children }: Props) {
  const [data, setData] = useState<{ invoices: DashboardInvoice[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) return;

    async function load() {
      setLoading(true);
      try {
        const result = await fetchInvoices(personId, year, month);
        const mapped: DashboardInvoice[] = (result?.invoices ?? []).map((inv) => ({
          id: inv.creditCardId ?? inv.creditCardName ?? "cartao",
          cardName: inv.creditCardName ?? "Cartão",
          brand: inv.creditCardBrand ?? "",
          lastFourDigits: inv.creditCardLastFourDigits ?? "****",
          personName: inv.personName ?? "",
          amount: Number(inv.totalAmount ?? 0),
          dueDate: inv.dueDate ?? "",
          isOverdue: Boolean(inv.isOverdue),
        }));
        setData({ invoices: mapped });
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
