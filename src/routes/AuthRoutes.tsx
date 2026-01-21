import { Route, Routes } from "react-router-dom";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ResetPasswordPage from "../pages/ResetPasswordPage";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}
