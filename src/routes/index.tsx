import { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import HomePage from "../pages/Home";
import PrivacyPage from "../pages/PrivacyPage";
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

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/auth/*" element={<AuthRoutes />} />
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
