import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BudgetPage from "./BudgetPage";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "p1", name: "Teste" } }),
}));

vi.mock("@/services/api/budgetService", () => ({
  fetchBudget: vi.fn(),
  createBudget: vi.fn(),
  updateBudget: vi.fn(),
}));

const budgetService = await import("@/services/api/budgetService");

describe("BudgetPage", () => {
  it("loads and shows budget summary when budget exists", async () => {
    vi.mocked(budgetService.fetchBudget).mockResolvedValue({
      id: "b1",
      income: 1000,
      essentialFixedCost: 100,
      necessaryFixedCost: 50,
      variableFixedCost: 20,
      investment: 200,
      plannedPurchase: 10,
      protection: 5,
      total: 385,
      balance: 615,
      necessitiesPercentage: 15,
      desiresPercentage: 2,
      investmentsPercentage: 21,
      recommendation: "✅ Excelente!",
      isHealthy: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });

    render(<BudgetPage />);

    await waitFor(() => {
      expect(screen.getByText(/Editar Orçamento/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: /Regra 50\/30\/20/i })).toBeInTheDocument();
    expect(screen.getByText(/Excelente/i)).toBeInTheDocument();
  });

  it("shows create flow when budget does not exist", async () => {
    vi.mocked(budgetService.fetchBudget).mockRejectedValue(new Error("Orçamento não encontrado"));

    render(<BudgetPage />);

    await waitFor(() => {
      expect(screen.getByText(/Você ainda não tem um orçamento/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /Salvar Orçamento/i })).toBeInTheDocument();
  });
});
