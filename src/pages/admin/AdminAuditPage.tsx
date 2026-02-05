import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../contexts/DialogContext";
import { http } from "../../lib/http";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  errors?: string[];
};

type Page<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type AuditEventStatus = "SUCCESS" | "FAILURE" | "PENDING";

type AdminAuditEventListItem = {
  id: string;
  timestamp: string;
  userId: string;
  userEmail?: string;
  ipAddress?: string;
  action: string;
  entityId?: string;
  entityType?: string;
  status: AuditEventStatus;
  errorMessage?: string;
  details?: Record<string, unknown>;
};

function formatTimestamp(ts: string | undefined) {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString("pt-BR");
  } catch {
    return ts;
  }
}

export default function AdminAuditPage() {
  const dialog = useDialog();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [action, setAction] = useState("");
  const [status, setStatus] = useState<string>("");
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [data, setData] = useState<Page<AdminAuditEventListItem> | null>(null);

  const canPrev = useMemo(() => (data ? data.number > 0 : false), [data]);
  const canNext = useMemo(() => (data ? data.number + 1 < data.totalPages : false), [data]);

  async function load() {
    setLoading(true);
    try {
      const res = await http.get<ApiResponse<Page<AdminAuditEventListItem>>>(
        "/admin/audit-events",
        {
          params: {
            q: q.trim() ? q.trim() : undefined,
            action: action.trim() ? action.trim() : undefined,
            status: status || undefined,
            entityType: entityType.trim() ? entityType.trim() : undefined,
            entityId: entityId.trim() ? entityId.trim() : undefined,
            page,
            size,
          },
        },
      );

      setData(res.data?.data ?? null);
    } catch (e: unknown) {
      await dialog.alert({
        title: "Erro",
        message: e instanceof Error ? e.message : "Falha ao carregar auditoria",
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function showDetails(ev: AdminAuditEventListItem) {
    const detailsText = JSON.stringify(
      {
        id: ev.id,
        timestamp: ev.timestamp,
        userId: ev.userId,
        userEmail: ev.userEmail,
        ipAddress: ev.ipAddress,
        action: ev.action,
        entityType: ev.entityType,
        entityId: ev.entityId,
        status: ev.status,
        errorMessage: ev.errorMessage,
        details: ev.details,
      },
      null,
      2,
    );

    await dialog.alert({
      title: "Detalhes do evento",
      message: (
        <pre className="mt-2 max-h-[60vh] overflow-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/90">
          {detailsText}
        </pre>
      ),
      confirmText: "Fechar",
    });
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
            <h1 className="text-ella-navy text-xl font-semibold">Admin • Auditoria</h1>
          </div>
          <p className="text-ella-subtile text-sm">Eventos e ações registradas no sistema.</p>
        </div>

        <form
          className="flex w-full flex-col gap-2 sm:max-w-3xl sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
            void load();
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar (email, action, entity)"
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="Action (exato)"
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm sm:w-56"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm sm:w-44"
            aria-label="Filtrar por status"
          >
            <option value="">Status: Todos</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILURE">FAILURE</option>
            <option value="PENDING">PENDING</option>
          </select>
          <input
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            placeholder="EntityType"
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm sm:w-44"
          />
          <input
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="EntityId"
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm sm:w-44"
          />
          <button
            type="submit"
            className="bg-ella-brand hover:bg-ella-brand/90 rounded-xl px-4 py-2 text-sm font-medium text-white"
            disabled={loading}
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="border-ella-muted bg-ella-card mt-6 overflow-hidden rounded-2xl border">
        <div className="overflow-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-ella-background/60 text-ella-navy/80">
              <tr>
                <th className="px-4 py-3 font-medium">Quando</th>
                <th className="px-4 py-3 font-medium">Usuário</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="text-ella-subtile px-4 py-4" colSpan={6}>
                    Carregando...
                  </td>
                </tr>
              ) : data?.content?.length ? (
                data.content.map((ev) => (
                  <tr
                    key={ev.id}
                    className="border-ella-muted hover:bg-ella-background/40 border-t"
                  >
                    <td className="text-ella-subtile px-4 py-3">{formatTimestamp(ev.timestamp)}</td>
                    <td className="px-4 py-3">
                      <div className="text-ella-navy font-medium">
                        {ev.userEmail || ev.userId || "—"}
                      </div>
                      <div className="text-ella-subtile text-xs">{ev.ipAddress || ""}</div>
                    </td>
                    <td className="text-ella-subtile px-4 py-3">{ev.action}</td>
                    <td className="text-ella-subtile px-4 py-3">
                      {ev.entityType ? (
                        <span className="text-ella-navy/90">{ev.entityType}</span>
                      ) : (
                        "—"
                      )}
                      {ev.entityId ? (
                        <span className="text-ella-subtile"> • {ev.entityId}</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          ev.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : ev.status === "FAILURE"
                              ? "bg-red-500/10 text-red-700"
                              : "bg-amber-500/10 text-amber-700"
                        }
                      >
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          {ev.status}
                        </span>
                      </span>
                      {ev.errorMessage ? (
                        <div
                          className="text-ella-subtile mt-1 max-w-[260px] truncate text-xs"
                          title={ev.errorMessage}
                        >
                          {ev.errorMessage}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
                        onClick={() => void showDetails(ev)}
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-ella-subtile px-4 py-4" colSpan={6}>
                    Nenhum evento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-ella-muted text-ella-subtile flex items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <div>
            {data ? (
              <span>
                Página {data.number + 1} de {Math.max(data.totalPages, 1)} • {data.totalElements}{" "}
                eventos
              </span>
            ) : (
              <span>—</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={!canPrev || loading}
            >
              Anterior
            </button>
            <button
              type="button"
              className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext || loading}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
