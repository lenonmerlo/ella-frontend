import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import LoginPage from "./Login";

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ loadProfile: vi.fn() }),
}));

vi.mock("../lib/auth", () => ({
  login: vi.fn(),
}));

describe("LoginPage", () => {
  it("shows links to register and forgot password", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /criar acesso/i })).toHaveAttribute(
      "href",
      "/auth/register",
    );

    expect(screen.getByRole("link", { name: /esqueci minha senha/i })).toHaveAttribute(
      "href",
      "/auth/forgot-password",
    );
  });
});
