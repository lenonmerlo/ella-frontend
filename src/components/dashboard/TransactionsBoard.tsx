import { useEffect, useMemo, useState } from "react";
import { FinancialTransactionResponseDTO } from "../../lib/dashboard";
import { fetchInvoices, updateInvoicePayment } from "../../services/api/invoicesService";
import {
  FinancialTransactionRequest,
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "../../services/api/transactionsService";
import type { DashboardInvoice } from "../../types/dashboard";
import { formatDatePtBR, tryParseISODateLike } from "../../utils/date";

interface Props {
  personId: string;
  referenceDate: Date;
  onRefresh?: () => void;
}

const TYPE_OPTIONS = ["INCOME", "EXPENSE", "DEBIT", "CREDIT", "PIX", "TRANSFER", "CASH"] as const;
const SCOPE_OPTIONS = ["PERSONAL", "BUSINESS"] as const;
const CATEGORY_OPTIONS = [
  "Alimentação",
  "iFood",
  "Transporte",
  "Viagem",
  "E-commerce",
  "Vestuário",
  "Academia/Saúde",
  "Beleza",
  "Assinaturas",
  "Internet",
  "Celular",
  "TV",
  "Saúde",
  "Educação",
  "Lazer",
  "Pet",
  "Moradia",
  "Água",
  "Luz",
  "Gás",
  "Aluguel",
  "Impostos",
  "Taxas e Juros",
  "Serviços",
  "Outros",
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = tryParseISODateLike(value);
  return d ? d.toLocaleDateString("pt-BR") : "-";
}

function signedForInvoiceTotal(type: FinancialTransactionResponseDTO["type"], amount: number) {
  // Match backend invoice total logic: expenses add, everything else subtract.
  // (Invoice uploads typically use EXPENSE + INCOME.)
  return type === "EXPENSE" ? amount : -amount;
}

export function TransactionsBoard({ personId, referenceDate, onRefresh }: Props) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [scopeFilter, setScopeFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FinancialTransactionResponseDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [savingInvoiceId, setSavingInvoiceId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FinancialTransactionResponseDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FinancialTransactionResponseDTO | null>(null);
  const [form, setForm] = useState<FinancialTransactionRequest>(() => ({
    personId,
    description: "",
    amount: 0,
    type: "EXPENSE",
    scope: "PERSONAL",
    category: "Outros",
    transactionDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    paidDate: "",
    status: "PENDING",
  }));

  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchInvoices(personId, year, month);
        const mapped: DashboardInvoice[] = (result?.invoices ?? []).map((inv: any) => ({
          id: String(inv.invoiceId ?? inv.id ?? inv.creditCardId),
          cardId: String(inv.creditCardId ?? ""),
          cardName: String(inv.creditCardName ?? "Cartão"),
          brand: String(inv.creditCardBrand ?? ""),
          lastFourDigits: String(inv.creditCardLastFourDigits ?? "****"),
          personName: String(inv.personName ?? ""),
          amount: Number(inv.totalAmount ?? 0),
          dueDate: String(inv.dueDate ?? ""),
          isOverdue: Boolean(inv.isOverdue),
          isPaid: Boolean(inv.isPaid),
          paidDate: inv.paidDate ? String(inv.paidDate) : undefined,
        }));
        setInvoices(mapped);
      } catch {
        // ignore: movimentação pode funcionar sem faturas
        setInvoices([]);
      }
    })();
  }, [personId, year, month]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTransactions(personId, {
          year: startDate || endDate ? undefined : year,
          month: startDate || endDate ? undefined : month,
          start: startDate || undefined,
          end: endDate || undefined,
          category: categoryFilter === "ALL" ? undefined : categoryFilter,
          page,
          size,
        });
        setData(result.transactions);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } catch (err) {
        setError("Erro ao carregar transações");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [personId, year, month, startDate, endDate, categoryFilter, page, size]);

  const filtered = useMemo(() => {
    return data.filter((tx) => {
      const matchType = typeFilter === "ALL" || tx.type === typeFilter;
      const matchScope = scopeFilter === "ALL" || tx.scope === scopeFilter;
      const matchCategory = categoryFilter === "ALL" || tx.category === categoryFilter;
      return matchType && matchScope && matchCategory;
    });
  }, [data, typeFilter, scopeFilter, categoryFilter]);

  const groupedByCard = useMemo(() => {
    const groups = new Map<
      string,
      {
        key: string;
        cardName: string;
        lastFour: string;
        cardholderName: string;
        transactions: FinancialTransactionResponseDTO[];
        subtotal: number;
      }
    >();

    for (const tx of filtered) {
      const key = String(tx.creditCardId ?? "");
      const isCard = Boolean(tx.creditCardId);
      const groupKey = isCard ? key : "__NO_CARD__";

      const cardName = String(tx.creditCardName ?? "Cartão");
      const lastFour = String(tx.creditCardLastFourDigits ?? "");
      const cardholderName = String(tx.creditCardCardholderName ?? "");

      const existing = groups.get(groupKey);
      const amount = Number(tx.amount ?? 0);
      const signed = signedForInvoiceTotal(tx.type, amount);

      if (existing) {
        existing.transactions.push(tx);
        existing.subtotal += signed;
      } else {
        groups.set(groupKey, {
          key: groupKey,
          cardName: isCard ? cardName : "Sem cartão",
          lastFour: isCard ? lastFour : "",
          cardholderName: isCard ? cardholderName : "",
          transactions: [tx],
          subtotal: signed,
        });
      }
    }

    const arr = Array.from(groups.values());
    // Stable ordering: cards first, then "Sem cartão".
    arr.sort((a, b) => {
      if (a.key === "__NO_CARD__" && b.key !== "__NO_CARD__") return 1;
      if (b.key === "__NO_CARD__" && a.key !== "__NO_CARD__") return -1;
      const aLabel = `${a.cardName} ${a.lastFour}`.trim();
      const bLabel = `${b.cardName} ${b.lastFour}`.trim();
      return aLabel.localeCompare(bLabel, "pt-BR");
    });

    for (const g of arr) {
      g.transactions.sort((a, b) => {
        const da = new Date(a.purchaseDate ?? a.transactionDate).getTime();
        const db = new Date(b.purchaseDate ?? b.transactionDate).getTime();
        return db - da;
      });
    }

    const distinctCardGroups = arr.filter((g) => g.key !== "__NO_CARD__").length;
    const shouldGroup = distinctCardGroups >= 2;
    const grandTotal = arr.reduce((acc, g) => acc + g.subtotal, 0);

    return { shouldGroup, groups: arr, grandTotal };
  }, [filtered]);

  const filterCategoryOptions = useMemo(() => {
    const fromData = Array.from(
      new Set(data.map((tx) => String(tx.category || "")).filter(Boolean)),
    );
    const merged = Array.from(new Set([...fromData, ...CATEGORY_OPTIONS]));
    merged.sort((a, b) => a.localeCompare(b, "pt-BR"));
    return merged;
  }, [data]);

  const categoryOptions = useMemo(() => {
    if (form.category && !CATEGORY_OPTIONS.includes(form.category)) {
      return [form.category, ...CATEGORY_OPTIONS];
    }
    return CATEGORY_OPTIONS;
  }, [form.category]);

  function openCreate() {
    setEditing(null);
    setForm({
      personId,
      description: "",
      amount: 0,
      type: "EXPENSE",
      scope: "PERSONAL",
      category: "Outros",
      transactionDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      paidDate: "",
      status: "PENDING",
    });
    setShowForm(true);
  }

  function openEdit(tx: FinancialTransactionResponseDTO) {
    setEditing(tx);
    setForm({
      personId,
      description: tx.description,
      amount: Number(tx.amount),
      type: tx.type,
      scope: tx.scope ?? "PERSONAL",
      category: tx.category,
      transactionDate: tx.transactionDate,
      dueDate: tx.dueDate ?? "",
      paidDate: tx.paidDate ?? "",
      status: tx.status,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: FinancialTransactionRequest = {
        ...form,
        status: form.paidDate ? "PAID" : "PENDING",
      };
      if (editing) {
        await updateTransaction(editing.id, payload);
      } else {
        await createTransaction(payload);
      }
      setShowForm(false);
      setEditing(null);
      onRefresh?.();
      setPage(0);
      const result = await fetchTransactions(personId, {
        year: startDate || endDate ? undefined : year,
        month: startDate || endDate ? undefined : month,
        start: startDate || undefined,
        end: endDate || undefined,
        category: categoryFilter === "ALL" ? undefined : categoryFilter,
        page: 0,
        size,
      });
      setData(result.transactions);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError("Erro ao salvar transação");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteTarget(null);
    setLoading(true);
    try {
      await deleteTransaction(id);
      onRefresh?.();
      const result = await fetchTransactions(personId, {
        year: startDate || endDate ? undefined : year,
        month: startDate || endDate ? undefined : month,
        start: startDate || undefined,
        end: endDate || undefined,
        category: categoryFilter === "ALL" ? undefined : categoryFilter,
        page,
        size,
      });
      setData(result.transactions);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError("Erro ao excluir transação");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function resetFilters() {
    setStartDate("");
    setEndDate("");
    setTypeFilter("ALL");
    setScopeFilter("ALL");
    setCategoryFilter("ALL");
    setPage(0);
  }

  return (
    <section className="ella-glass space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-ella-navy text-lg font-semibold">Movimentação financeira</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="bg-ella-brand hover:bg-ella-brand/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
          >
            Nova transação
          </button>
        </div>
      </div>

      <div className="bg-ella-background/60 grid grid-cols-1 gap-3 rounded-xl p-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-1">
          <label className="text-ella-subtile text-xs">Início</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-ella-subtile text-xs">Fim</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-ella-subtile text-xs">Tipo</label>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="ALL">Todos</option>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-ella-subtile text-xs">Escopo</label>
          <select
            value={scopeFilter}
            onChange={(e) => {
              setScopeFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="ALL">Todos</option>
            {SCOPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-ella-subtile text-xs">Categoria</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="ALL">Todos</option>
            {filterCategoryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2 md:col-span-2 lg:col-span-4">
          <button
            onClick={() => setPage(0)}
            className="bg-ella-brand hover:bg-ella-brand/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
          >
            Aplicar filtros
          </button>
          <button
            onClick={resetFilters}
            className="text-ella-navy rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {invoices.length > 0 && (
        <div className="bg-ella-background/40 rounded-xl p-4">
          <h4 className="text-ella-navy mb-3 text-sm font-semibold">Pagamento das faturas</h4>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-ella-card/70 rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-ella-navy text-sm font-medium">{inv.cardName}</div>
                    <div className="text-ella-subtile text-xs">
                      Venc.: {formatDatePtBR(inv.dueDate)}
                    </div>
                  </div>
                  {inv.isOverdue && !inv.isPaid && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      Vencida
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-ella-subtile">Pago?</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(inv.isPaid)}
                      disabled={savingInvoiceId === inv.id}
                      onChange={async (e) => {
                        const paid = e.target.checked;
                        const dateToSend = paid
                          ? inv.paidDate || new Date().toISOString().slice(0, 10)
                          : undefined;
                        try {
                          setSavingInvoiceId(inv.id);
                          await updateInvoicePayment(inv.id, paid, dateToSend);
                          const refreshed = await fetchInvoices(personId, year, month);
                          const mapped: DashboardInvoice[] = (refreshed?.invoices ?? []).map(
                            (x: any) => ({
                              id: String(x.invoiceId ?? x.id ?? x.creditCardId),
                              cardId: String(x.creditCardId ?? ""),
                              cardName: String(x.creditCardName ?? "Cartão"),
                              brand: String(x.creditCardBrand ?? ""),
                              lastFourDigits: String(x.creditCardLastFourDigits ?? "****"),
                              personName: String(x.personName ?? ""),
                              amount: Number(x.totalAmount ?? 0),
                              dueDate: String(x.dueDate ?? ""),
                              isOverdue: Boolean(x.isOverdue),
                              isPaid: Boolean(x.isPaid),
                              paidDate: x.paidDate ? String(x.paidDate) : undefined,
                            }),
                          );
                          setInvoices(mapped);
                          onRefresh?.();
                        } finally {
                          setSavingInvoiceId(null);
                        }
                      }}
                      className="h-4 w-4"
                    />

                    {Boolean(inv.isPaid) && (
                      <input
                        type="date"
                        value={inv.paidDate ? inv.paidDate.slice(0, 10) : ""}
                        disabled={savingInvoiceId === inv.id}
                        onChange={async (e) => {
                          const paidDate = e.target.value;
                          try {
                            setSavingInvoiceId(inv.id);
                            await updateInvoicePayment(inv.id, true, paidDate);
                            const refreshed = await fetchInvoices(personId, year, month);
                            const mapped: DashboardInvoice[] = (refreshed?.invoices ?? []).map(
                              (x: any) => ({
                                id: String(x.invoiceId ?? x.id ?? x.creditCardId),
                                cardId: String(x.creditCardId ?? ""),
                                cardName: String(x.creditCardName ?? "Cartão"),
                                brand: String(x.creditCardBrand ?? ""),
                                lastFourDigits: String(x.creditCardLastFourDigits ?? "****"),
                                personName: String(x.personName ?? ""),
                                amount: Number(x.totalAmount ?? 0),
                                dueDate: String(x.dueDate ?? ""),
                                isOverdue: Boolean(x.isOverdue),
                                isPaid: Boolean(x.isPaid),
                                paidDate: x.paidDate ? String(x.paidDate) : undefined,
                              }),
                            );
                            setInvoices(mapped);
                            onRefresh?.();
                          } finally {
                            setSavingInvoiceId(null);
                          }
                        }}
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {groupedByCard.shouldGroup && (
          <div className="border-ella-muted bg-ella-card/70 mb-3 flex items-center justify-between rounded-xl border px-4 py-3">
            <div className="text-ella-navy text-sm font-semibold">Total geral (fatura)</div>
            <div className="text-ella-navy text-sm font-bold">
              {formatCurrency(Math.abs(groupedByCard.grandTotal))}
            </div>
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-ella-background/60 text-ella-subtile text-left text-xs tracking-wide uppercase">
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Escopo</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {!groupedByCard.shouldGroup &&
              filtered.map((tx) => {
                const isIncome = tx.type === "INCOME";
                const isBusiness = tx.scope === "BUSINESS";
                return (
                  <tr key={tx.id} className="hover:bg-ella-background/40">
                    <td className="text-ella-navy px-4 py-3 font-medium">{tx.description}</td>
                    <td className="text-ella-subtile px-4 py-3">
                      {formatDate(tx.purchaseDate ?? tx.transactionDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-ella-subtile bg-ella-card/70 rounded px-2 py-1 text-xs">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          isBusiness
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isBusiness ? "Empresa" : "Pessoal"}
                      </span>
                    </td>
                    <td className="text-ella-subtile px-4 py-3">{tx.type}</td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        isIncome ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(Number(tx.amount))}
                    </td>
                    <td className="space-x-2 px-4 py-3">
                      <button
                        className="text-ella-navy text-xs font-semibold hover:underline"
                        onClick={() => openEdit(tx)}
                      >
                        Editar
                      </button>
                      <button
                        className="text-xs font-semibold text-red-600 hover:underline"
                        onClick={() => setDeleteTarget(tx)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}

            {groupedByCard.shouldGroup &&
              groupedByCard.groups
                .filter((g) => g.key !== "__NO_CARD__")
                .map((g) => {
                  const titleParts = [
                    g.cardName,
                    g.lastFour ? `• final ${g.lastFour}` : "",
                    g.cardholderName ? `• ${g.cardholderName}` : "",
                  ].filter(Boolean);
                  const title = titleParts.join(" ");
                  return (
                    <>
                      <tr key={`${g.key}__header`} className="bg-ella-background/40">
                        <td className="px-4 py-3" colSpan={7}>
                          <div className="flex items-center justify-between">
                            <div className="text-ella-navy text-sm font-semibold">{title}</div>
                            <div className="text-ella-navy text-sm font-bold">
                              Subtotal: {formatCurrency(Math.abs(g.subtotal))}
                            </div>
                          </div>
                        </td>
                      </tr>
                      {g.transactions.map((tx) => {
                        const isIncome = tx.type === "INCOME";
                        const isBusiness = tx.scope === "BUSINESS";
                        return (
                          <tr key={tx.id} className="hover:bg-ella-background/40">
                            <td className="text-ella-navy px-4 py-3 font-medium">
                              {tx.description}
                            </td>
                            <td className="text-ella-subtile px-4 py-3">
                              {formatDate(tx.purchaseDate ?? tx.transactionDate)}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-ella-subtile bg-ella-card/70 rounded px-2 py-1 text-xs">
                                {tx.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded px-2 py-1 text-xs font-semibold ${
                                  isBusiness
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {isBusiness ? "Empresa" : "Pessoal"}
                              </span>
                            </td>
                            <td className="text-ella-subtile px-4 py-3">{tx.type}</td>
                            <td
                              className={`px-4 py-3 text-right font-semibold ${
                                isIncome ? "text-emerald-600" : "text-red-600"
                              }`}
                            >
                              {isIncome ? "+" : "-"}
                              {formatCurrency(Number(tx.amount))}
                            </td>
                            <td className="space-x-2 px-4 py-3">
                              <button
                                className="text-ella-navy text-xs font-semibold hover:underline"
                                onClick={() => openEdit(tx)}
                              >
                                Editar
                              </button>
                              <button
                                className="text-xs font-semibold text-red-600 hover:underline"
                                onClick={() => setDeleteTarget(tx)}
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })}
            {filtered.length === 0 && (
              <tr>
                <td className="text-ella-subtile px-4 py-6 text-center text-sm" colSpan={7}>
                  Nenhuma transação encontrada para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-ella-subtile text-sm">
          Página {page + 1} de {Math.max(totalPages, 1)} — {totalElements} registros
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-50"
          >
            Próxima
          </button>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            {[10, 20, 50].map((opt) => (
              <option key={opt} value={opt}>
                {opt}/página
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-ella-subtile text-sm">Carregando...</div>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-ella-card w-full max-w-2xl rounded-2xl p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-ella-navy text-lg font-semibold">
                  {editing ? "Editar transação" : "Nova transação"}
                </h4>
                <p className="text-ella-subtile text-sm">Preencha os campos obrigatórios</p>
              </div>
              <button
                className="text-ella-subtile hover:text-ella-navy"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                Fechar
              </button>
            </div>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1">
                <label className="text-ella-subtile text-xs">Descrição</label>
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ella-subtile text-xs">Valor (BRL)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ella-subtile text-xs">Tipo</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ella-subtile text-xs">Escopo</label>
                <select
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value as any })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {SCOPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "PERSONAL" ? "Pessoal" : "Empresa"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ella-subtile text-xs">Categoria</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ella-subtile text-xs">Data da transação</label>
                <input
                  required
                  type="date"
                  value={form.transactionDate}
                  onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ella-subtile text-xs">Vencimento (opcional)</label>
                <input
                  type="date"
                  value={form.dueDate || ""}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ella-subtile text-xs">Pagamento (opcional)</label>
                <input
                  type="date"
                  value={form.paidDate || ""}
                  onChange={(e) => setForm({ ...form, paidDate: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="text-ella-subtile rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-ella-brand hover:bg-ella-brand/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
                >
                  {editing ? "Salvar alterações" : "Criar transação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-ella-card w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h4 className="text-ella-navy mb-2 text-lg font-semibold">Confirmar exclusão</h4>
            <p className="text-ella-subtile mb-4 text-sm">
              Tem certeza que deseja excluir "{deleteTarget.description}"?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                className="border-ella-muted text-ella-subtile rounded-lg border px-4 py-2 text-sm font-medium"
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
