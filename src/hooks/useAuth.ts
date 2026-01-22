import { useNavigate } from "react-router-dom";
import { useAuth as useAuthContext } from "../contexts/AuthContext";
import { login as doLogin, register as doRegister } from "../lib/auth";

export function useAuthFlow() {
  const navigate = useNavigate();
  const ctx = useAuthContext();

  async function login(email: string, password: string) {
    await doLogin(email, password);
    await ctx.loadProfile();
    navigate("/dashboard");
  }

  async function register(payload: { email: string; password: string; name: string }) {
    const [firstName, ...rest] = payload.name.trim().split(/\s+/);
    await doRegister({
      firstName: firstName ?? "",
      lastName: rest.join(" "),
      email: payload.email,
      password: payload.password,
    });
    await login(payload.email, payload.password);
  }

  return {
    user: ctx.user,
    loadingProfile: ctx.loadingProfile,
    loadProfile: ctx.loadProfile,
    logout: ctx.logout,
    setUser: ctx.setUser,
    login,
    register,
  };
}
