// src/components/dashboard/GoalsSection.tsx
import { Pencil, Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { GoalProgressDTO } from "../../lib/dashboard";
import { createGoal, deleteGoal, updateGoal } from "../../services/api/goalsService";

interface GoalsSectionProps {
  goals: GoalProgressDTO[];
  onRefresh: () => void;
}

export function GoalsSection({ goals, onRefresh }: GoalsSectionProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  const [editGoal, setEditGoal] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  function formatBRL(value: number) {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateMonthlySaving(goal: GoalProgressDTO): {
    monthly: number;
    remaining: number;
    monthsLeft: number;
  } | null {
    if (!goal.deadline) return null;

    const deadline = new Date(goal.deadline);
    if (Number.isNaN(deadline.getTime())) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

    const remaining = Math.max(0, (goal.targetAmount ?? 0) - (goal.currentAmount ?? 0));
    const msDiff = end.getTime() - today.getTime();
    if (msDiff <= 0) {
      return { monthly: remaining, remaining, monthsLeft: 0 };
    }

    // Aproximação determinística: meses restantes = teto(dias/30.44)
    const days = msDiff / (1000 * 60 * 60 * 24);
    const monthsLeft = Math.max(1, Math.ceil(days / 30.44));
    const monthly = remaining / monthsLeft;
    return { monthly, remaining, monthsLeft };
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await createGoal({
        ownerId: user.id,
        title: newGoal.title,
        targetAmount: Number(newGoal.targetAmount),
        currentAmount: Number(newGoal.currentAmount || 0),
        deadline: newGoal.deadline ? new Date(newGoal.deadline).toISOString() : undefined,
        status: "ACTIVE",
      });
      setShowForm(false);
      setNewGoal({ title: "", targetAmount: "", currentAmount: "", deadline: "" });
      onRefresh();
    } catch (error) {
      console.error("Erro ao criar meta:", error);
      alert("Erro ao criar meta");
    }
  }

  async function handleEditOpen(goal: GoalProgressDTO) {
    const goalId = String((goal as any).id ?? (goal as any).goalId);
    setEditingGoalId(goalId);

    const deadlineISO = goal.deadline ? new Date(goal.deadline).toISOString().slice(0, 10) : "";

    setEditGoal({
      title: goal.title ?? "",
      targetAmount: String(goal.targetAmount ?? ""),
      currentAmount: String(goal.currentAmount ?? ""),
      deadline: deadlineISO,
    });
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !editingGoalId) return;
    try {
      await updateGoal(editingGoalId, {
        ownerId: user.id,
        title: editGoal.title,
        targetAmount: Number(editGoal.targetAmount),
        currentAmount: Number(editGoal.currentAmount || 0),
        deadline: editGoal.deadline ? new Date(editGoal.deadline).toISOString() : undefined,
        status: "ACTIVE",
      });
      setEditingGoalId(null);
      onRefresh();
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
      alert("Erro ao atualizar meta");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta meta?")) return;
    try {
      await deleteGoal(id);
      onRefresh();
    } catch (error) {
      console.error("Erro ao excluir meta:", error);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <div>
          <h2 className="text-ella-navy text-lg font-semibold">Metas financeiras</h2>
          <p className="text-ella-subtile mt-1 text-sm">
            Defina e acompanhe seus objetivos financeiros.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-ella-navy hover:bg-ella-navy/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          <Plus size={18} />
          Nova Meta
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-ella-navy mb-4 font-medium">Nova Meta</h3>
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
            <div className="col-span-2">
              <label className="text-ella-subtile mb-1 block text-xs font-medium">Título</label>
              <input
                required
                type="text"
                className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Ex: Reserva de Emergência"
              />
            </div>
            <div>
              <label className="text-ella-subtile mb-1 block text-xs font-medium">
                Valor Alvo (R$)
              </label>
              <input
                required
                type="number"
                step="0.01"
                className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="text-ella-subtile mb-1 block text-xs font-medium">
                Valor Atual (R$)
              </label>
              <input
                type="number"
                step="0.01"
                className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="text-ella-subtile mb-1 block text-xs font-medium">
                Prazo (Opcional)
              </label>
              <input
                type="date"
                className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-ella-subtile rounded-lg px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-ella-gold hover:bg-ella-gold/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
              >
                Salvar Meta
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 && !showForm && (
          <div className="text-ella-subtile col-span-full py-8 text-center">
            Nenhuma meta cadastrada. Clique em "Nova Meta" para começar.
          </div>
        )}

        {goals.map((goal) => {
          const goalId = (goal as any).id ?? (goal as any).goalId;
          const progress = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100),
          );

          const saving = calculateMonthlySaving(goal);

          return (
            <div
              key={goalId}
              className="group relative rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-ella-background/10 text-ella-navy flex h-10 w-10 items-center justify-center rounded-full">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="text-ella-navy font-medium">{goal.title}</h3>
                    {goal.deadline && (
                      <p className="text-ella-subtile text-xs">
                        Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEditOpen(goal)}
                    className="hover:text-ella-navy"
                    title="Editar meta"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(String(goalId))}
                    className="hover:text-red-600"
                    title="Excluir meta"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {editingGoalId === String(goalId) && (
                <form
                  onSubmit={handleEditSave}
                  className="mt-3 space-y-4 rounded-xl border border-gray-100 bg-white p-4"
                >
                  <div>
                    <label className="text-ella-subtile mb-1 block text-xs font-medium">
                      Título
                    </label>
                    <input
                      required
                      type="text"
                      className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
                      value={editGoal.title}
                      onChange={(e) => setEditGoal({ ...editGoal, title: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-ella-subtile mb-1 block text-xs font-medium">
                        Valor Alvo (R$)
                      </label>
                      <input
                        required
                        inputMode="decimal"
                        type="number"
                        step="0.01"
                        className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
                        value={editGoal.targetAmount}
                        onChange={(e) => setEditGoal({ ...editGoal, targetAmount: e.target.value })}
                        placeholder="0,00"
                      />
                    </div>

                    <div>
                      <label className="text-ella-subtile mb-1 block text-xs font-medium">
                        Valor Atual (R$)
                      </label>
                      <input
                        inputMode="decimal"
                        type="number"
                        step="0.01"
                        className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
                        value={editGoal.currentAmount}
                        onChange={(e) =>
                          setEditGoal({ ...editGoal, currentAmount: e.target.value })
                        }
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="max-w-[220px]">
                    <label className="text-ella-subtile mb-1 block text-xs font-medium">
                      Prazo
                    </label>
                    <input
                      type="date"
                      className="border-ella-muted focus:border-ella-gold w-full rounded-lg border p-2 text-sm outline-none"
                      value={editGoal.deadline}
                      onChange={(e) => setEditGoal({ ...editGoal, deadline: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingGoalId(null)}
                      className="text-ella-subtile hover:text-ella-navy rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-ella-gold hover:bg-ella-gold/90 rounded-lg px-4 py-2 text-sm font-medium text-white"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-4">
                <div className="text-ella-subtile mb-2 flex items-center justify-between text-xs">
                  <span>
                    R$ {formatBRL(goal.currentAmount)} de {formatBRL(goal.targetAmount)}
                  </span>
                  <span className="text-ella-navy font-medium">{progress}%</span>
                </div>

                {saving && saving.remaining > 0 && goal.deadline && (
                  <div className="text-ella-subtile mb-2 text-xs">
                    {saving.monthsLeft > 0 ? (
                      <span>
                        Para atingir até {new Date(goal.deadline).toLocaleDateString("pt-BR")},
                        poupe ~ R$ {formatBRL(saving.monthly)}/mês
                      </span>
                    ) : (
                      <span>
                        Prazo expirado: faltam R$ {formatBRL(saving.remaining)} para concluir
                      </span>
                    )}
                  </div>
                )}

                <div className="bg-ella-background/20 h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-ella-gold h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
