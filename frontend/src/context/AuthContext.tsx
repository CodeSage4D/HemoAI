"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { ActivitySquare } from "lucide-react";

interface User {
  id: number;
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

  useEffect(() => {
    // Check localStorage payload on boot
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
      enforceGuards();
    }
  }, []);

  useEffect(() => {
    enforceGuards();
  }, [user, loading, pathname]);

  const enforceGuards = () => {
    if (loading) return;
    const isDashboard = pathname.startsWith("/dashboard");
    if (isDashboard && !user && !token) {
      router.replace("/login");
    }
  };

  const fetchUser = async (authToken: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${apiUrl}/users/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
        signal: controller.signal
      });
      
      clearTimeout(id);

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        // Token invalid or expired
        toast.error("Session expired, please login again");
        logout();
      }
    } catch (err: any) {
      console.error("Auth fetch error:", err);
      if (err.name === 'AbortError' || err.message.includes("Failed to fetch")) {
         toast.error("Network Error: Could not connect to the authentication server.");
         setUser(null); // Explicit fallback
      } else {
         toast.error("Authentication Error");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    fetchUser(newToken);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
    router.push("/login");
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
