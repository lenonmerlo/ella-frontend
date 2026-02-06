import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../contexts/DialogContext";
import { http } from "../../lib/http";

type AlertSeverity = "INFO" | "WARNING" | "DANGER";

type AdminAlertDTO = {
  code: string;
  severity: AlertSeverity;
  title: string;
  message: string;
};

type AdminAlertsListItemDTO = {
  userId: string;
  name: string;
  email: string;
  userPlan?: string;
  userStatus?: string;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionAutoRenew?: boolean;
  lastPaidAt?: string;
  alerts: AdminAlertDTO[];
};

function severityLabel(s: AlertSeverity) {
  if (s === "DANGER") return "Crítico";
  if (s === "WARNING") return "Atenção";
  return "Info";
}

function severityBadgeClass(s: AlertSeverity) {
  switch (s) {
    case "DANGER":
      return "bg-red-600/15 text-red-700 border-red-600/30";
    case "WARNING":
      return "bg-amber-600/15 text-amber-800 border-amber-600/30";
    default:
      return "bg-sky-600/15 text-sky-800 border-sky-600/30";
  }
}

export default function AdminAlertsPage() {
  const navigate = useNavigate();
  const dialog = useDialog();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AdminAlertsListItemDTO[]>([]);
  const [severityFilter, setSeverityFilter] = useState<"" | AlertSeverity>("");

  async function load() {
    setLoading(true);
    try {
      const res = await http.get<{ data: AdminAlertsListItemDTO[] }>("/admin/alerts", {
        params: { q: q || undefined, limit: 200 },
      });
      setItems(res.data?.data ?? []);
    } catch (e: unknown) {
      await dialog.alert({
        title: "Erro",
        message: e instanceof Error ? e.message : "Falha ao carregar alertas",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!severityFilter) return items;
    return items.filter((i) => i.alerts?.some((a) => a.severity === severityFilter));
  }, [items, severityFilter]);

  const totalAlerts = useMemo(() => {
    let count = 0;
    for (const i of filtered) count += i.alerts?.length ?? 0;
    return count;
  }, [filtered]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border-ella-muted bg-ella-card text-ella-navy hover:bg-ella-background rounded-full border px-3 py-1 text-xs font-medium transition"
              aria-label="Voltar"
            >
              Voltar
            </button>
            <h1 className="text-ella-navy text-xl font-semibold">Admin • Alertas</h1>
          </div>
          <p className="text-ella-subtile text-sm">
            Alertas de assinatura e cobrança (sem Stripe).
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-2 sm:max-w-3xl sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            void load();
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou email"
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm"
          />

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm sm:w-48"
            aria-label="Filtrar por severidade"
          >
            <option value="">Severidade: Todas</option>
            <option value="DANGER">Crítico</option>
            <option value="WARNING">Atenção</option>
            <option value="INFO">Info</option>
          </select>

          <button
            type="submit"
            className="bg-ella-brand hover:bg-ella-brand/90 rounded-xl px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Atualizar"}
          </button>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="border-ella-muted text-ella-subtile rounded-full border px-3 py-1 text-xs">
          {filtered.length} usuários com alertas
        </span>
        <span className="border-ella-muted text-ella-subtile rounded-full border px-3 py-1 text-xs">
          {totalAlerts} alertas
        </span>
      </div>

      <div className="border-ella-muted bg-ella-card mt-6 overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-ella-muted/60 bg-ella-background/40 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Usuário</th>
                <th className="px-4 py-3 font-semibold">Plano</th>
                <th className="px-4 py-3 font-semibold">Assinatura</th>
                <th className="px-4 py-3 font-semibold">Alertas</th>
              </tr>
            </thead>
            <tbody className="divide-ella-muted/40 divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-ella-subtile px-4 py-6">
                    Nenhum alerta encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.userId} className="hover:bg-ella-background/30">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-ella-navy font-medium">
                          {row.name || "(sem nome)"}
                        </span>
                        <span className="text-ella-subtile text-xs">{row.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-ella-navy text-xs font-semibold">
                        {row.userPlan ?? "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-ella-subtile text-xs">
                        <div>Status: {row.subscriptionStatus ?? "-"}</div>
                        <div>Fim: {row.subscriptionEndDate ?? "-"}</div>
                        {row.subscriptionAutoRenew != null && (
                          <div>Auto-renova: {row.subscriptionAutoRenew ? "Sim" : "Não"}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          {row.alerts.map((a, idx) => (
                            <span
                              key={`${a.code}-${idx}`}
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityBadgeClass(a.severity)}`}
                              title={a.message}
                            >
                              {severityLabel(a.severity)}: {a.title}
                            </span>
                          ))}
                        </div>
                        <div className="text-ella-subtile text-xs">
                          {row.lastPaidAt
                            ? `Último pagamento: ${row.lastPaidAt}`
                            : "Sem pagamento registrado"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
