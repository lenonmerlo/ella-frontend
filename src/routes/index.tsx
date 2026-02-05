import { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import CookiePolicy from "../pages/CookiePolicy";
import HomePage from "../pages/Home";
import PrivacyPage from "../pages/PrivacyPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import { AdminRoutes } from "./AdminRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { DashboardRoutes } from "./DashboardRoutes";

function HomeRoute() {
  const { user, loadingProfile: loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <HomePage />;
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loadingProfile: loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, loadingProfile: loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  const isAdmin = String(user?.role ?? "").toUpperCase() === "ADMIN";
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminRoutes />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DashboardRoutes />
            </PrivateRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <PrivateRoute>
              <PrivacyPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
