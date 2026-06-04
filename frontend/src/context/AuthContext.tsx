"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { ActivitySquare } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const enforceGuards = useCallback(() => {
    if (loading) return;
    const isDashboard = pathname.startsWith("/dashboard");
    if (isDashboard && !user && !token) {
      router.replace("/login");
    }
  }, [loading, pathname, user, token, router]);

  const fetchUser = useCallback(async (authToken: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${apiUrl}/auth/users/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
        signal: controller.signal
      });
      
      clearTimeout(id);

      if (res.ok) {
        const json = await res.json();
        const rawUser = json.data;
        if (rawUser) {
          setUser({
            id: rawUser.id,
            email: rawUser.email,
            role: rawUser.role,
            full_name: rawUser.fullName || rawUser.full_name || '',
          });
        }
      } else {
        toast.error("Session expired, please login again");
        logout();
      }
    } catch (err: unknown) {
      console.error("Auth fetch error:", err);
      if (err instanceof Error && (err.name === 'AbortError' || err.message.includes("Failed to fetch"))) {
         toast.error("Network Error: Could not connect to the authentication server.");
         setUser(null);
      } else {
         toast.error("Authentication Error");
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    enforceGuards();
  }, [enforceGuards]);

  const login = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    fetchUser(newToken);
    router.push("/dashboard");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <ActivitySquare className="w-10 h-10 animate-spin text-primary" />
               <p className="font-bold uppercase tracking-widest text-sm animate-pulse opacity-70">Verifying Identity</p>
            </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
