import { Route, Routes } from "react-router-dom";
import { Header } from "../components/shared/Header";
import DashboardPage from "../pages/Dashboard";
import SettingsPage from "../pages/Settings";

export function DashboardRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}
