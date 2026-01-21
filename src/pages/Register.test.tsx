import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../lib/http", () => ({
  http: {
    post: vi.fn(),
  },
}));

vi.mock("../lib/auth", () => ({
  login: vi.fn(),
}));

import RegisterPage from "./Register";

const httpModule = await import("../lib/http");
const authModule = await import("../lib/auth");

describe("RegisterPage", () => {
  it("registers via /auth/register then logs in and navigates to dashboard", async () => {
    vi.mocked(httpModule.http.post).mockResolvedValue({ data: {} });
    vi.mocked(authModule.login).mockResolvedValue({
      token: "t",
      tokenType: "Bearer",
      expiresIn: 3600,
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^nome$/i), { target: { value: "Maria" } });
    fireEvent.change(screen.getByLabelText(/^sobrenome$/i), { target: { value: "Silva" } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: "maria@example.com" } });

    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(httpModule.http.post).toHaveBeenCalledWith("/auth/register", null, {
        params: { name: "Maria Silva", email: "maria@example.com", password: "password123" },
      });
    });

    expect(authModule.login).toHaveBeenCalledWith("maria@example.com", "password123");
    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });
});
