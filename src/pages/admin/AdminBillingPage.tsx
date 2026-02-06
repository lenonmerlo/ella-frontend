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

type BillingStatus = "UP_TO_DATE" | "OVERDUE" | "NO_SUBSCRIPTION" | "CANCELED";

const PLAN_OPTIONS = ["FREE", "ESSENTIAL", "COMPLETE", "PREMIUM"] as const;
type Plan = (typeof PLAN_OPTIONS)[number];

const CURRENCY_OPTIONS = ["BRL", "USD", "CAD"] as const;
type Currency = (typeof CURRENCY_OPTIONS)[number];

type AdminBillingListItem = {
  userId: string;
  name: string;
  email: string;
  userPlan: string;
  userStatus: string;

  subscriptionStatus?: string;
  subscriptionPlan?: string;
  subscriptionStartDate?: string; // LocalDate
  subscriptionEndDate?: string; // LocalDate

  billingStatus: BillingStatus;
  daysToExpire: number;

  lastPaidAt?: string; // LocalDateTime
};

function planLabel(p: string) {
  switch (String(p).toUpperCase()) {
    case "FREE":
      return "FREE";
    case "ESSENTIAL":
      return "ESSENTIAL";
    case "COMPLETE":
      return "COMPLETE";
    case "PREMIUM":
      return "PREMIUM";
    default:
      return p;
  }
}

function formatDate(d: string | undefined) {
  if (!d) return "—";
  try {
    // LocalDate vem como YYYY-MM-DD
    const dt = new Date(`${d}T00:00:00`);
    return dt.toLocaleDateString("pt-BR");
  } catch {
    return d;
  }
}

function formatDateTime(d: string | undefined) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("pt-BR");
  } catch {
    return d;
  }
}

function statusLabel(s: BillingStatus) {
  switch (s) {
    case "UP_TO_DATE":
      return "Em dia";
    case "OVERDUE":
      return "Atrasado";
    case "NO_SUBSCRIPTION":
      return "Sem assinatura";
    case "CANCELED":
      return "Cancelado";
    default:
      return s;
  }
}

function statusPillClass(s: BillingStatus) {
  switch (s) {
    case "UP_TO_DATE":
      return "bg-emerald-500/10 text-emerald-700";
    case "OVERDUE":
      return "bg-red-500/10 text-red-700";
    case "NO_SUBSCRIPTION":
      return "bg-amber-500/10 text-amber-700";
    case "CANCELED":
      return "bg-zinc-500/10 text-zinc-700";
    default:
      return "bg-ella-background/60 text-ella-navy/80";
  }
}

export default function AdminBillingPage() {
  const dialog = useDialog();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [data, setData] = useState<Page<AdminBillingListItem> | null>(null);

  const [planByUserId, setPlanByUserId] = useState<Record<string, Plan | "">>({});
  const [renewDaysByUserId, setRenewDaysByUserId] = useState<Record<string, string>>({});
  const [paymentDraftByUserId, setPaymentDraftByUserId] = useState<
    Record<
      string,
      {
        plan: Plan | "";
        amount: string;
        currency: Currency;
        paidAt: string;
      }
    >
  >({});

  const canPrev = useMemo(() => (data ? data.number > 0 : false), [data]);
  const canNext = useMemo(() => (data ? data.number + 1 < data.totalPages : false), [data]);

  async function load() {
    setLoading(true);
    try {
      const res = await http.get<ApiResponse<Page<AdminBillingListItem>>>("/admin/billing", {
        params: {
          q: q.trim() ? q.trim() : undefined,
          page,
          size,
        },
      });

      setData(res.data?.data ?? null);

      const rows = res.data?.data?.content ?? [];
      setPlanByUserId((prev) => {
        const next = { ...prev };
        for (const r of rows) {
          const current = String(r.subscriptionPlan || r.userPlan || "FREE").toUpperCase() as Plan;
          if (!next[r.userId] && PLAN_OPTIONS.includes(current)) {
            next[r.userId] = current;
          }
        }
        return next;
      });

      setRenewDaysByUserId((prev) => {
        const next = { ...prev };
        for (const r of rows) {
          if (next[r.userId] == null) {
            next[r.userId] = "30";
          }
        }
        return next;
      });

      setPaymentDraftByUserId((prev) => {
        const next = { ...prev };
        for (const r of rows) {
          if (next[r.userId] != null) continue;
          const currentPlan = String(
            r.subscriptionPlan || r.userPlan || "FREE",
          ).toUpperCase() as Plan;
          next[r.userId] = {
            plan: PLAN_OPTIONS.includes(currentPlan) ? currentPlan : "",
            amount: "",
            currency: "BRL",
            paidAt: "",
          };
        }
        return next;
      });
    } catch (e: unknown) {
      await dialog.alert({
        title: "Erro",
        message: e instanceof Error ? e.message : "Falha ao carregar pagamentos",
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function updatePlan(userId: string, nextPlan: Plan) {
    const ok = await dialog.confirm({
      title: "Confirmar",
      message: `Alterar plano do usuário para ${nextPlan}?`,
      confirmText: "Alterar",
      cancelText: "Cancelar",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await http.put(`/admin/users/${userId}/plan`, { plan: nextPlan });
      await load();
    } catch (e: unknown) {
      await dialog.alert({
        title: "Erro",
        message: e instanceof Error ? e.message : "Falha ao atualizar plano",
      });
    }
  }

  async function renewSubscription(userId: string, email: string) {
    const rawDays = renewDaysByUserId[userId] ?? "30";
    const days = Number.parseInt(String(rawDays), 10);
    if (!Number.isFinite(days) || days < 1) {
      await dialog.alert({
        title: "Erro",
        message: "Informe um número de dias válido (mínimo 1).",
      });
      return;
    }

    const ok = await dialog.confirm({
      title: "Confirmar",
      message: `Renovar assinatura de ${email} por ${days} dia(s)?`,
      confirmText: "Renovar",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await http.post(`/admin/users/${userId}/subscription/renew`, { days });
      await load();
    } catch (e: unknown) {
      await dialog.alert({
        title: "Erro",
        message: e instanceof Error ? e.message : "Falha ao renovar assinatura",
      });
    }
  }

  function normalizeLocalDateTime(value: string): string {
    // datetime-local pode vir sem segundos (YYYY-MM-DDTHH:mm). O backend espera ISO LocalDateTime.
    if (!value) return value;
    return value.length === 16 ? `${value}:00` : value;
  }

  async function registerPayment(userId: string, email: string) {
    const draft = paymentDraftByUserId[userId];
    if (!draft) return;

    const amount = String(draft.amount ?? "").trim();
    if (!amount) {
      await dialog.alert({ title: "Erro", message: "Informe o valor do pagamento." });
      return;
    }

    const plan = draft.plan;
    if (!plan) {
      await dialog.alert({ title: "Erro", message: "Selecione o plano do pagamento." });
      return;
    }

    const ok = await dialog.confirm({
      title: "Confirmar",
      message: `Registrar pagamento de ${email}: ${amount} ${draft.currency} (${plan})?`,
      confirmText: "Registrar",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (!ok) return;

    try {
      const paidAt = normalizeLocalDateTime(String(draft.paidAt || "").trim());
      await http.post(`/admin/users/${userId}/payments`, {
        plan,
        amount,
        currency: draft.currency,
        paidAt: paidAt || undefined,
      });
      await load();
    } catch (e: unknown) {
      await dialog.alert({
        title: "Erro",
        message: e instanceof Error ? e.message : "Falha ao registrar pagamento",
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
            <h1 className="text-ella-navy text-xl font-semibold">Admin • Pagamentos</h1>
          </div>
          <p className="text-ella-subtile text-sm">
            Status de cobrança baseado na validade da assinatura (sem Stripe).
          </p>
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
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Plano</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Válido até</th>
                <th className="px-4 py-3 font-medium">Último pagamento</th>
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
                data.content.map((row) => (
                  <tr
                    key={row.userId}
                    className="border-ella-muted hover:bg-ella-background/40 border-t"
                  >
                    <td className="px-4 py-3">
                      <div className="text-ella-navy font-medium">{row.name}</div>
                      <div className="text-ella-subtile text-xs">{row.email}</div>
                    </td>
                    <td className="text-ella-subtile px-4 py-3">
                      {planLabel(row.subscriptionPlan || row.userPlan || "—")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusPillClass(row.billingStatus)}>
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium">
                          {statusLabel(row.billingStatus)}
                        </span>
                      </span>
                      {row.billingStatus === "UP_TO_DATE" && Number.isFinite(row.daysToExpire) ? (
                        <div className="text-ella-subtile mt-1 text-xs">
                          {row.daysToExpire} dia(s) para vencer
                        </div>
                      ) : null}
                    </td>
                    <td className="text-ella-subtile px-4 py-3">
                      {formatDate(row.subscriptionEndDate)}
                    </td>
                    <td className="text-ella-subtile px-4 py-3">
                      {formatDateTime(row.lastPaidAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={planByUserId[row.userId] ?? ""}
                            onChange={(e) => {
                              const nextPlan = e.target.value as Plan;
                              setPlanByUserId((prev) => ({
                                ...prev,
                                [row.userId]: nextPlan,
                              }));
                              setPaymentDraftByUserId((prev) => ({
                                ...prev,
                                [row.userId]: {
                                  ...(prev[row.userId] ?? {
                                    plan: "",
                                    amount: "",
                                    currency: "BRL",
                                    paidAt: "",
                                  }),
                                  plan: nextPlan,
                                },
                              }));
                            }}
                            className="border-ella-muted bg-ella-card text-ella-navy rounded-xl border px-2 py-1 text-xs"
                            aria-label="Selecionar plano"
                          >
                            {PLAN_OPTIONS.map((p) => (
                              <option key={p} value={p}>
                                {planLabel(p)}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition disabled:opacity-50"
                            disabled={
                              loading ||
                              !planByUserId[row.userId] ||
                              String(planByUserId[row.userId]) ===
                                String(row.subscriptionPlan || row.userPlan || "")
                            }
                            onClick={() => {
                              const nextPlan = planByUserId[row.userId];
                              if (!nextPlan) return;
                              void updatePlan(row.userId, nextPlan as Plan);
                            }}
                          >
                            Trocar plano
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={renewDaysByUserId[row.userId] ?? "30"}
                            onChange={(e) =>
                              setRenewDaysByUserId((prev) => ({
                                ...prev,
                                [row.userId]: e.target.value,
                              }))
                            }
                            className="border-ella-muted bg-ella-card text-ella-navy w-24 rounded-xl border px-2 py-1 text-xs"
                            aria-label="Dias para renovar"
                          />
                          <button
                            type="button"
                            className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition disabled:opacity-50"
                            disabled={loading}
                            onClick={() => void renewSubscription(row.userId, row.email)}
                          >
                            Renovar
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Valor"
                            value={paymentDraftByUserId[row.userId]?.amount ?? ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setPaymentDraftByUserId((prev) => ({
                                ...prev,
                                [row.userId]: {
                                  ...(prev[row.userId] ?? {
                                    plan: planByUserId[row.userId] ?? "",
                                    amount: "",
                                    currency: "BRL",
                                    paidAt: "",
                                  }),
                                  amount: v,
                                },
                              }));
                            }}
                            className="border-ella-muted bg-ella-card text-ella-navy w-28 rounded-xl border px-2 py-1 text-xs"
                            aria-label="Valor do pagamento"
                          />
                          <select
                            value={paymentDraftByUserId[row.userId]?.currency ?? "BRL"}
                            onChange={(e) => {
                              const v = e.target.value as Currency;
                              setPaymentDraftByUserId((prev) => ({
                                ...prev,
                                [row.userId]: {
                                  ...(prev[row.userId] ?? {
                                    plan: planByUserId[row.userId] ?? "",
                                    amount: "",
                                    currency: "BRL",
                                    paidAt: "",
                                  }),
                                  currency: v,
                                },
                              }));
                            }}
                            className="border-ella-muted bg-ella-card text-ella-navy rounded-xl border px-2 py-1 text-xs"
                            aria-label="Moeda do pagamento"
                          >
                            {CURRENCY_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <select
                            value={
                              paymentDraftByUserId[row.userId]?.plan ??
                              planByUserId[row.userId] ??
                              ""
                            }
                            onChange={(e) => {
                              const v = e.target.value as Plan;
                              setPaymentDraftByUserId((prev) => ({
                                ...prev,
                                [row.userId]: {
                                  ...(prev[row.userId] ?? {
                                    plan: planByUserId[row.userId] ?? "",
                                    amount: "",
                                    currency: "BRL",
                                    paidAt: "",
                                  }),
                                  plan: v,
                                },
                              }));
                            }}
                            className="border-ella-muted bg-ella-card text-ella-navy rounded-xl border px-2 py-1 text-xs"
                            aria-label="Plano do pagamento"
                          >
                            {PLAN_OPTIONS.map((p) => (
                              <option key={p} value={p}>
                                {planLabel(p)}
                              </option>
                            ))}
                          </select>
                          <input
                            type="datetime-local"
                            value={paymentDraftByUserId[row.userId]?.paidAt ?? ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              setPaymentDraftByUserId((prev) => ({
                                ...prev,
                                [row.userId]: {
                                  ...(prev[row.userId] ?? {
                                    plan: planByUserId[row.userId] ?? "",
                                    amount: "",
                                    currency: "BRL",
                                    paidAt: "",
                                  }),
                                  paidAt: v,
                                },
                              }));
                            }}
                            className="border-ella-muted bg-ella-card text-ella-navy rounded-xl border px-2 py-1 text-xs"
                            aria-label="Pago em"
                          />
                          <button
                            type="button"
                            className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition disabled:opacity-50"
                            disabled={loading}
                            onClick={() => void registerPayment(row.userId, row.email)}
                          >
                            Registrar pagamento
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-ella-subtile px-4 py-4" colSpan={6}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-ella-muted flex items-center justify-between border-t px-4 py-3">
          <div className="text-ella-subtile text-xs">
            Página {data ? data.number + 1 : 1} de {data ? Math.max(1, data.totalPages) : 1}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition disabled:opacity-50"
              disabled={loading || !canPrev}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              className="border-ella-muted text-ella-subtile hover:bg-ella-background hover:text-ella-navy rounded-full border px-3 py-1 text-xs transition disabled:opacity-50"
              disabled={loading || !canNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
