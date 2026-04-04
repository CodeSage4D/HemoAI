"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeartPulse, ArrowLeft, Building2, Heart } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const [role, setRole] = useState<"hospital" | "patient">("hospital");

  return (
    <div className="min-h-screen flex text-foreground bg-background">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 relative overflow-y-auto">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="max-w-md w-full mx-auto mt-12 mb-8">
          <div className="flex justify-center lg:justify-start mb-8 text-primary">
            <HeartPulse className="w-10 h-10" />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
            <p className="text-muted-foreground mb-8">Join the Hemo-Sync network.</p>

            {/* Role Selection Tabs */}
            <div className="flex p-1 bg-muted rounded-xl mb-8">
               <button 
                 onClick={() => setRole("hospital")}
                 className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${role === "hospital" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
               >
                 <Building2 className="w-4 h-4"/> Hospital
               </button>
               <button 
                 onClick={() => setRole("patient")}
                 className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${role === "patient" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
               >
                 <Heart className="w-4 h-4"/> Patient
               </button>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              
              {role === "hospital" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Institution Name</label>
                    <input type="text" placeholder="General Medical Center" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Official Admin Email</label>
                    <input type="email" placeholder="admin@hospital.org" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium">First Name</label>
                       <input type="text" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Last Name</label>
                       <input type="text" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
                     </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input type="email" placeholder="you@domain.com" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
              </div>
              
              <Link href="/dashboard" className="w-full block text-center py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors mt-6 shadow-lg shadow-primary/20">
                Create Account
              </Link>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Image/Graphic Section */}
      <div className="hidden lg:flex w-1/2 bg-muted p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/10 to-emerald-500/20 mix-blend-multiply dark:mix-blend-screen" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }}
          className="relative z-10 max-w-lg text-center"
        >
          <div className="w-full rounded-3xl bg-card border border-border shadow-2xl p-10 text-left relative overflow-hidden">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
               <Building2 className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-2xl mb-4">Join 400+ Medical Institutions</h3>
             <p className="text-muted-foreground leading-relaxed mb-6">
               Implementing Hemo-Sync guarantees a 40% reduction in logistical blood wastage and ensures optimal stock for critical intensive care admissions.
             </p>
             <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-muted" />
                <div className="w-2 h-2 rounded-full bg-muted" />
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
