"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster richColors position="bottom-right" />
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
