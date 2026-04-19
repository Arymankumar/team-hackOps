import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, setToken } from "@/lib/api";
import type { Plan, User } from "@/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setPlan: (plan: Plan) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await api<{ id: string; email: string; name: string; plan: Plan }>("/auth/me");
      setUser({ id: me.id, email: me.email, name: me.name, plan: me.plan });
    } catch {
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem("sf_token");
    if (!t) {
      setLoading(false);
      return;
    }
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ token: string; user: User }>("/auth/login", {
      auth: false,
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await api<{ token: string; user: User }>("/auth/signup", {
      auth: false,
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const setPlan = useCallback(async (plan: Plan) => {
    const me = await api<{ id: string; email: string; name: string; plan: Plan }>("/auth/me/plan", {
      method: "PATCH",
      body: JSON.stringify({ plan }),
    });
    setUser({ id: me.id, email: me.email, name: me.name, plan: me.plan });
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refreshUser, setPlan }),
    [user, loading, login, signup, logout, refreshUser, setPlan]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
