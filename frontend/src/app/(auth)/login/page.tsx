"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2, Shield, Activity, Building2, Database, User, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      login(data.token);
    } catch (err: unknown) {
      if (err instanceof Error) {
         setError(err.message || "Failed to login. Check credentials.");
      } else {
         setError("Failed to login. Check credentials.");
      }
      setLoading(false);
    }
  };

  const handleDirectLogin = async (demoEmail: string, demoPassword: string) => {
    setError("");
    setLoading(true);
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      const data = await authApi.login(demoEmail, demoPassword);
      login(data.token);
    } catch (err: unknown) {
      if (err instanceof Error) {
         setError(err.message || "Failed to login. Check credentials.");
      } else {
         setError("Failed to login. Check credentials.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-foreground bg-background">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-10 md:px-16 lg:py-0 relative">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center lg:justify-start mb-8">
            <Logo iconSize={40} />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground mb-8">Sign in to your RAKTAVA institutional portal.</p>
            
            <AnimatePresence>
              {error && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mb-4 text-sm font-bold text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@hospital.org" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Password</label>
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
              </div>
              
              <button disabled={loading} className="w-full flex items-center justify-center gap-2 text-center py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors mt-6 shadow-lg shadow-primary/20 disabled:opacity-50">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> Authenticating...</> : "Sign In to Dashboard"}
              </button>
            </form>

            {/* EXPLORE RAKTAVA DEMO SYSTEM */}
            <div className="mt-8 border border-border/80 rounded-2xl p-6 bg-card shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  EXPLORE RAKTAVA DEMO SYSTEM
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Bypass standard login credential pools. Click a role profile below to explore simplified dashboards, real-time AI prioritizations, regional inventory tracking, and emergency logistics routes.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Profile 1 */}
                <button
                  type="button"
                  onClick={() => handleDirectLogin("admin@raktava.in", "SecurePassword123!")}
                  className="flex items-center gap-3 text-left p-3 rounded-xl border border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/40 transition-all group cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block group-hover:text-primary transition-colors">HQ Admin Cockpit</span>
                    <span className="text-[10px] text-muted-foreground block leading-tight">Aarav Sharma (System logs)</span>
                  </div>
                </button>

                {/* Profile 2 */}
                <button
                  type="button"
                  onClick={() => handleDirectLogin("dispatch@apollo.in", "HospitalAccess123!")}
                  className="flex items-center gap-3 text-left p-3 rounded-xl border border-border bg-muted/30 hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all group cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block group-hover:text-emerald-500 transition-colors">Apollo Hospital</span>
                    <span className="text-[10px] text-muted-foreground block leading-tight">Dr. Aditya Patel (Mumbai)</span>
                  </div>
                </button>

                {/* Profile 3 */}
                <button
                  type="button"
                  onClick={() => handleDirectLogin("aiims@raktava.in", "HospitalAccess123!")}
                  className="flex items-center gap-3 text-left p-3 rounded-xl border border-border bg-muted/30 hover:bg-teal-500/5 hover:border-teal-500/40 transition-all group cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block group-hover:text-teal-500 transition-colors">AIIMS Emergency</span>
                    <span className="text-[10px] text-muted-foreground block leading-tight">Dr. Priya Nair (Delhi)</span>
                  </div>
                </button>

                {/* Profile 4 */}
                <button
                  type="button"
                  onClick={() => handleDirectLogin("bank@raktava.in", "BankAccess123!")}
                  className="flex items-center gap-3 text-left p-3 rounded-xl border border-border bg-muted/30 hover:bg-indigo-500/5 hover:border-indigo-500/40 transition-all group cursor-pointer"
                >
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block group-hover:text-indigo-500 transition-colors">Red Cross India</span>
                    <span className="text-[10px] text-muted-foreground block leading-tight">Rajesh Kumar (Bengaluru)</span>
                  </div>
                </button>

                {/* Profile 5 */}
                <button
                  type="button"
                  onClick={() => handleDirectLogin("amit.verma@mail.in", "PatientPassword123!")}
                  className="flex items-center gap-3 text-left p-3 rounded-xl border border-border bg-muted/30 hover:bg-amber-500/5 hover:border-amber-500/40 transition-all group cursor-pointer sm:col-span-2"
                >
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block group-hover:text-amber-500 transition-colors">Patient Portal Desk</span>
                    <span className="text-[10px] text-muted-foreground block leading-tight">Amit Verma / Deepika Sen (Reports & Self checks)</span>
                  </div>
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account? <Link href="/signup" className="text-primary font-medium hover:underline">Request Access</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Image/Graphic Section */}
      <div className="hidden lg:flex w-1/2 bg-muted p-10 xl:p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-emerald-500/20 mix-blend-multiply dark:mix-blend-screen" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.2 }}
          className="relative z-10 max-w-lg text-center"
        >
          <div className="w-full h-80 rounded-3xl bg-card border border-border shadow-2xl p-8 flex flex-col justify-end text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full blur-3xl" />
             <div className="flex gap-2 items-end h-32 mb-6 border-b border-border/50 pb-2">
                <div className="w-8 bg-primary rounded-t-sm h-[40%]" />
                <div className="w-8 bg-primary/70 rounded-t-sm h-[60%]" />
                <div className="w-8 bg-primary/40 rounded-t-sm h-[30%]" />
                <div className="w-8 bg-primary rounded-t-sm h-[80%]" />
                <div className="w-8 bg-emerald-500 rounded-t-sm h-[100%]" />
             </div>
             
             <h3 className="font-bold text-xl mb-1">Predictive Logs Active</h3>
             <p className="text-sm text-muted-foreground">SaaS analytics continuously synchronizing with your local inventory via encrypted channels.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
