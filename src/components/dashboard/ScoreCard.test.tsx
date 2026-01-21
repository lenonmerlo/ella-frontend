import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ScoreCard } from "./ScoreCard";

vi.mock("../../services/scoreService", () => ({
  getScore: vi.fn(),
}));

import { getScore } from "../../services/scoreService";

describe("ScoreCard", () => {
  it("should display loading state", () => {
    (getScore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    render(<ScoreCard personId="123" />);

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("should display score when loaded", async () => {
    (getScore as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "s1",
      personId: "123",
      scoreValue: 82,
      calculationDate: "2026-01-21",
      creditUtilizationScore: 70,
      onTimePaymentScore: 100,
      spendingDiversityScore: 20,
      spendingConsistencyScore: 100,
      creditHistoryScore: 20,
    });

    const onViewDetails = vi.fn();
    render(<ScoreCard personId="123" onViewDetails={onViewDetails} />);

    expect(await screen.findByText(/82\s*\/\s*100/i)).toBeInTheDocument();
    expect(screen.queryByText(/Detalhamento/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ver detalhes/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /ver detalhes/i }));
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it("should display error when fetch fails", async () => {
    (getScore as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Erro ao buscar score"),
    );

    render(<ScoreCard personId="invalid" />);

    expect(await screen.findByText(/Erro ao carregar score/i)).toBeInTheDocument();
    expect(screen.getByText(/Erro ao buscar score/i)).toBeInTheDocument();
  });
});
