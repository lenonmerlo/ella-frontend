import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Garante que o DOM seja limpo entre testes (Vitest não faz isso automaticamente).
afterEach(() => {
  cleanup();
});

// Recharts/ResponsiveContainer usa ResizeObserver; jsdom não fornece por padrão.
if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class ResizeObserver {
    observe() {
      // no-op
    }
    unobserve() {
      // no-op
    }
    disconnect() {
      // no-op
    }
  }

  // @ts-expect-error - definindo no runtime para testes
  window.ResizeObserver = ResizeObserver;
}
