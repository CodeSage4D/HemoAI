"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeartPulse, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex text-foreground bg-background">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 relative">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center lg:justify-start mb-8 text-primary">
            <HeartPulse className="w-10 h-10" />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground mb-8">Sign in to your Hemo-Sync institutional portal.</p>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input type="email" placeholder="admin@hospital.org" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Password</label>
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <input type="password" placeholder="••••••••" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent" />
              </div>
              
              <Link href="/dashboard" className="w-full block text-center py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors mt-6 shadow-lg shadow-primary/20">
                Sign In to Dashboard
              </Link>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Don't have an account? <Link href="/signup" className="text-primary font-medium hover:underline">Request Access</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Image/Graphic Section */}
      <div className="hidden lg:flex w-1/2 bg-muted p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-emerald-500/20 mix-blend-multiply dark:mix-blend-screen" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.2 }}
          className="relative z-10 max-w-lg text-center"
        >
          <div className="w-full h-80 rounded-3xl bg-card border border-border shadow-2xl p-8 flex flex-col justify-end text-left relative overflow-hidden">
             {/* Abstract Chart elements inside the card */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full blur-3xl" />
             <div className="flex gap-2 items-end h-32 mb-6 border-b border-border/50 pb-2">
                <div className="w-8 bg-primary rounded-t-sm h-[40%]" />
                <div className="w-8 bg-primary/70 rounded-t-sm h-[60%]" />
                <div className="w-8 bg-primary/40 rounded-t-sm h-[30%]" />
                <div className="w-8 bg-primary rounded-t-sm h-[80%]" />
                <div className="w-8 bg-emerald-500 rounded-t-sm h-[100%]" />
             </div>
             
             <h3 className="font-bold text-xl mb-1">Predictive Logs Active</h3>
             <p className="text-sm text-muted-foreground">SaaS analytics continuously synchronizing with your local inventory.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
