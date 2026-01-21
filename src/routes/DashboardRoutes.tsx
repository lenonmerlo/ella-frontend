import { Route, Routes } from "react-router-dom";
import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import DashboardPage from "../pages/Dashboard";
import SettingsPage from "../pages/Settings";

export function DashboardRoutes() {
  return (
    <div className="bg-ella-background flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
