import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BudgetForm } from "./BudgetForm";

vi.mock("@/services/api/budgetService", () => ({
  fetchBudget: vi.fn(),
  createBudget: vi.fn(),
  updateBudget: vi.fn(),
}));

const budgetService = await import("@/services/api/budgetService");

describe("BudgetForm", () => {
  it("renders form and prefills when budget exists", async () => {
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
      recommendation: "ok",
      isHealthy: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });

    render(<BudgetForm personId="p1" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Renda Mensal/i)).toHaveValue(1000);
    });
  });

  it("submits update when budgetId exists", async () => {
    vi.mocked(budgetService.fetchBudget).mockResolvedValue({
      id: "b1",
      income: 1000,
      essentialFixedCost: 0,
      necessaryFixedCost: 0,
      variableFixedCost: 0,
      investment: 0,
      plannedPurchase: 0,
      protection: 0,
      total: 0,
      balance: 1000,
      necessitiesPercentage: 0,
      desiresPercentage: 0,
      investmentsPercentage: 0,
      recommendation: "ok",
      isHealthy: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });

    vi.mocked(budgetService.updateBudget).mockResolvedValue({
      id: "b1",
      income: 2000,
      essentialFixedCost: 0,
      necessaryFixedCost: 0,
      variableFixedCost: 0,
      investment: 0,
      plannedPurchase: 0,
      protection: 0,
      total: 0,
      balance: 2000,
      necessitiesPercentage: 0,
      desiresPercentage: 0,
      investmentsPercentage: 0,
      recommendation: "ok",
      isHealthy: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    });

    const onSuccess = vi.fn();
    render(<BudgetForm personId="p1" onSuccess={onSuccess} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Renda Mensal/i)).toHaveValue(1000);
    });

    fireEvent.change(screen.getByLabelText(/Renda Mensal/i), { target: { value: "2000" } });
    fireEvent.click(screen.getByRole("button", { name: /Atualizar Orçamento/i }));

    await waitFor(() => {
      expect(budgetService.updateBudget).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(budgetService.updateBudget).toHaveBeenCalledWith(
      "b1",
      expect.objectContaining({ income: 2000 }),
    );
  });

  it("submits create when no budget exists", async () => {
    vi.mocked(budgetService.fetchBudget).mockRejectedValue(new Error("Orçamento não encontrado"));

    vi.mocked(budgetService.createBudget).mockResolvedValue({
      id: "b2",
      income: 1200,
      essentialFixedCost: 0,
      necessaryFixedCost: 0,
      variableFixedCost: 0,
      investment: 0,
      plannedPurchase: 0,
      protection: 0,
      total: 0,
      balance: 1200,
      necessitiesPercentage: 0,
      desiresPercentage: 0,
      investmentsPercentage: 0,
      recommendation: "ok",
      isHealthy: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });

    render(<BudgetForm personId="p1" />);

    fireEvent.change(screen.getByLabelText(/Renda Mensal/i), { target: { value: "1200" } });
    fireEvent.click(screen.getByRole("button", { name: /Salvar Orçamento/i }));

    await waitFor(() => {
      expect(budgetService.createBudget).toHaveBeenCalledWith(
        "p1",
        expect.objectContaining({ income: 1200 }),
      );
    });
  });
});
