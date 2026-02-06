import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import AdminAlertsPage from "../pages/admin/AdminAlertsPage";
import AdminAuditPage from "../pages/admin/AdminAuditPage";
import AdminBillingPage from "../pages/admin/AdminBillingPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";

export function AdminRoutes() {
  return (
    <div className="bg-ella-background flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-6xl px-6 pt-4">
        <div className="border-ella-muted bg-ella-card inline-flex gap-1 rounded-full border p-1">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "bg-ella-background text-ella-navy rounded-full px-4 py-2 text-sm font-medium"
                : "text-ella-subtile hover:text-ella-navy rounded-full px-4 py-2 text-sm font-medium"
            }
          >
            Usuários
          </NavLink>
          <NavLink
            to="/admin/audit"
            className={({ isActive }) =>
              isActive
                ? "bg-ella-background text-ella-navy rounded-full px-4 py-2 text-sm font-medium"
                : "text-ella-subtile hover:text-ella-navy rounded-full px-4 py-2 text-sm font-medium"
            }
          >
            Auditoria
          </NavLink>
          <NavLink
            to="/admin/billing"
            className={({ isActive }) =>
              isActive
                ? "bg-ella-background text-ella-navy rounded-full px-4 py-2 text-sm font-medium"
                : "text-ella-subtile hover:text-ella-navy rounded-full px-4 py-2 text-sm font-medium"
            }
          >
            Pagamentos
          </NavLink>

          <NavLink
            to="/admin/alerts"
            className={({ isActive }) =>
              isActive
                ? "bg-ella-background text-ella-navy rounded-full px-4 py-2 text-sm font-medium"
                : "text-ella-subtile hover:text-ella-navy rounded-full px-4 py-2 text-sm font-medium"
            }
          >
            Alertas
          </NavLink>
        </div>
      </div>
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/users" replace />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/audit" element={<AdminAuditPage />} />
          <Route path="/billing" element={<AdminBillingPage />} />
          <Route path="/alerts" element={<AdminAlertsPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
