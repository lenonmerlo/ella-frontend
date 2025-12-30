import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SmartCategoryChart } from "./SmartCategoryChart";

describe("SmartCategoryChart", () => {
  it("renders pie chart info for 3 categories", () => {
    const data = [
      { name: "Alimentação", value: 1000 },
      { name: "Transporte", value: 500 },
      { name: "Saúde", value: 300 },
    ];

    render(<SmartCategoryChart data={data} />);

    expect(screen.getByText(/Categorias:\s*3/i)).toBeInTheDocument();
    expect(screen.getByText(/Visualização:\s*Pizza/i)).toBeInTheDocument();
  });

  it("renders horizontal bar as default for 10 categories", () => {
    const data = Array.from({ length: 10 }, (_, i) => ({
      name: `Categoria ${i + 1}`,
      value: 1000 - i * 10,
    }));

    render(<SmartCategoryChart data={data} />);

    expect(screen.getByText(/Categorias:\s*10/i)).toBeInTheDocument();
    expect(screen.getByText(/Visualização:\s*Barras Horizontais/i)).toBeInTheDocument();
  });

  it("renders treemap as default for 20 categories", () => {
    const data = Array.from({ length: 20 }, (_, i) => ({
      name: `Categoria ${i + 1}`,
      value: 1000 - i * 10,
    }));

    render(<SmartCategoryChart data={data} />);

    expect(screen.getByText(/Categorias:\s*20/i)).toBeInTheDocument();
    expect(screen.getByText(/Visualização:\s*Treemap/i)).toBeInTheDocument();
  });
});
