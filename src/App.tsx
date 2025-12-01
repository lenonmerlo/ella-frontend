// src/App.tsx
import "./styles/globals.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Logo } from "./components/Logo";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register"; // quando você criar

function App() {
  return (
    <div className="min-h-screen bg-ella-background text-ella-text">
      {/* Header */}
      <header className="border-b border-ella-muted bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo variant="horizontal" size="medium" />
          <span className="text-xs text-ella-subtile">
            Sua parceira financeira inteligente
          </span>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
