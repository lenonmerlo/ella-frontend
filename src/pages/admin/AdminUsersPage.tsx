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

type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  plan: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const PLAN_OPTIONS = ["FREE", "ESSENTIAL", "COMPLETE", "PREMIUM"] as const;
type Plan = (typeof PLAN_OPTIONS)[number];

export default function AdminUsersPage() {
  const dialog = useDialog();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [data, setData] = useState<Page<AdminUserListItem> | null>(null);

  const [planByUserId, setPlanByUserId] = useState<Record<string, Plan | "">>({});

  const canPrev = useMemo(() => (data ? data.number > 0 : false), [data]);
  const canNext = useMemo(() => (data ? data.number + 1 < data.totalPages : false), [data]);

  async function load() {
    setLoading(true);
    try {
      const res = await http.get<ApiResponse<Page<AdminUserListItem>>>("/admin/users", {
        params: {
          q: q.trim() ? q.trim() : undefined,
          role: role || undefined,
          status: status || undefined,
          page,
          size,
        },
      });
      setData(res.data?.data ?? null);

      const rows = res.data?.data?.content ?? [];
      setPlanByUserId((prev) => {
        const next = { ...prev };
        for (const r of rows) {
          const current = String(r.plan || "FREE").toUpperCase() as Plan;
          if (!next[r.id] && PLAN_OPTIONS.includes(current)) {
            next[r.id] = current;
          }
        }
        return next;
      });
    } catch (e: unknown) {
      await dialog.alert({
        title: "Erro",
        message: e instanceof Error ? e.message : "Falha ao carregar usuários",
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function updatePlan(user: AdminUserListItem, nextPlan: Plan) {
    const ok = await dialog.confirm({
      title: "Confirmar",
      message: `Alterar plano de ${user.email} para ${nextPlan}?`,
      confirmText: "Alterar",
      cancelText: "Cancelar",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await http.put(`/admin/users/${user.id}/plan`, {
        plan: nextPlan,
      });
      await load();
    } catch (e: unknown) {
      await dialog.alert({
        title: "Erro",
        message: e instanceof Error ? e.message : "Falha ao atualizar plano",
      });
    }
  }

  async function updateStatus(user: AdminUserListItem, nextStatus: string) {
    const ok = await dialog.confirm({
      title: "Confirmar",
      message: `Alterar status de ${user.email} para ${nextStatus}?`,
      confirmText: "Alterar",
      cancelText: "Cancelar",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await http.put(`/admin/users/${user.id}/status`, {
        status: nextStatus,
      });
      await load();
    } catch (e: any) {
      await dialog.alert({
        title: "Erro",
        message: e?.message || "Falha ao atualizar status",
      });
    }
  }

  async function updateRole(user: AdminUserListItem, nextRole: string) {
    const ok = await dialog.confirm({
      title: "Confirmar",
      message: `Alterar role de ${user.email} para ${nextRole}?`,
      confirmText: "Alterar",
      cancelText: "Cancelar",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await http.put(`/admin/users/${user.id}/role`, {
        role: nextRole,
      });
      await load();
    } catch (e: any) {
      await dialog.alert({
        title: "Erro",
        message: e?.message || "Falha ao atualizar role",
      });
    }
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
            <h1 className="text-ella-navy text-xl font-semibold">Admin • Usuários</h1>
          </div>
          <p className="text-ella-subtile text-sm">Gerencie usuários, roles e status.</p>
        </div>

        <form
          className="flex w-full flex-col gap-2 sm:max-w-2xl sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
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
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm sm:w-40"
            aria-label="Filtrar por role"
          >
            <option value="">Role: Todas</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-ella-muted bg-ella-card text-ella-navy w-full rounded-xl border px-3 py-2 text-sm sm:w-[180px]"
            aria-label="Filtrar por status"
          >
            <option value="">Status: Todos</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PENDING">PENDING</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
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
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-ella-background/60 text-ella-navy/80">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Plano</th>
                <th className="px-4 py-3 font-medium">Role</th>
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
                data.content.map((u) => (
                  <tr key={u.id} className="border-ella-muted hover:bg-ella-background/40 border-t">
                    <td className="text-ella-navy px-4 py-3 font-medium">{u.name}</td>
                    <td className="text-ella-subtile px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={planByUserId[u.id] ?? ""}
                          onChange={(e) =>
                            setPlanByUserId((prev) => ({
                              ...prev,
                              [u.id]: e.target.value as Plan,
                            }))
                          }
                          className="border-ella-muted bg-ella-card text-ella-navy rounded-xl border px-2 py-1 text-xs"
                          aria-label="Selecionar plano"
                        >
                          {PLAN_OPTIONS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition disabled:opacity-50"
                          onClick={() => {
                            const nextPlan = planByUserId[u.id];
                            if (!nextPlan) return;
                            void updatePlan(u, nextPlan as Plan);
                          }}
                          disabled={loading || !planByUserId[u.id] || planByUserId[u.id] === u.plan}
                        >
                          Aplicar
                        </button>
                      </div>
                    </td>
                    <td className="text-ella-subtile px-4 py-3">{u.role}</td>
                    <td className="text-ella-subtile px-4 py-3">{u.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
                          onClick={() => updateRole(u, "ADMIN")}
                          disabled={loading || u.role === "ADMIN"}
                        >
                          Tornar ADMIN
                        </button>
                        <button
                          type="button"
                          className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
                          onClick={() => updateRole(u, "USER")}
                          disabled={loading || u.role === "USER"}
                        >
                          Tornar USER
                        </button>
                        <button
                          type="button"
                          className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
                          onClick={() => updateStatus(u, "ACTIVE")}
                          disabled={loading || u.status === "ACTIVE"}
                        >
                          Ativar
                        </button>
                        <button
                          type="button"
                          className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition"
                          onClick={() => updateStatus(u, "BLOCKED")}
                          disabled={loading || u.status === "BLOCKED"}
                        >
                          Bloquear
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-ella-subtile px-4 py-4" colSpan={6}>
                    Nenhum usuário encontrado.
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
                usuários
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
