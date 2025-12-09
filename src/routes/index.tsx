import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { AuthRoutes } from "./AuthRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loadingProfile: loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DashboardRoutes />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
