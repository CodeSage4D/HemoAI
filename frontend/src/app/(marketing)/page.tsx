"use client";

import { motion } from "framer-motion";
import { ArrowRight, ActivitySquare, ShieldCheck, Zap, Droplet } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Hemo-Sync Intelligence Core v2.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Predictive Blood <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Logistics AI.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Eliminate emergency shortages and preemptively route critical blood supply to top-priority trauma patients using Scikit-Learn powered analytics.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/signup" className="px-8 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
                Deploy Infrastructure <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/services" className="px-8 py-4 bg-card border border-border text-foreground font-bold rounded-full hover:bg-muted transition-colors">
                View Architecture
              </Link>
            </div>
          </motion.div>

          {/* Animated Illustration / Mock UI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[500px]"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-emerald-500/30 blur-3xl opacity-50 rounded-full" />
             <div className="w-full h-full bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-6 relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
                   <div className="font-bold flex items-center gap-2"><ActivitySquare className="w-5 h-5 text-primary"/> AI Triage Feed</div>
                   <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                   </div>
                </div>

                <div className="space-y-4 flex-1">
                   <mock-line className="block w-3/4 h-8 bg-muted rounded-md animate-pulse" />
                   <mock-line className="block w-full h-16 bg-destructive/10 border border-destructive/20 rounded-md animate-pulse delay-75" />
                   <mock-line className="block w-1/2 h-8 bg-muted rounded-md animate-pulse delay-150" />
                   
                   <div className="mt-8 p-4 bg-muted/50 rounded-xl">
                      <div className="text-xs text-muted-foreground font-bold mb-2 uppercase tracking-wide">Live Inventory Link</div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 font-bold text-lg"><Droplet className="w-5 h-5 text-destructive" /> O- Negative</div>
                         <div className="text-destructive font-black text-xl">12%</div>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
                         <div className="w-[12%] h-full bg-destructive" />
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section className="bg-muted py-12 border-y border-border">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
            <StatBlock num="400+" label="Hospitals Connected" />
            <StatBlock num="98.2%" label="Prediction Accuracy" />
            <StatBlock num="2.5M" label="Liters Routed" />
            <StatBlock num="0" label="Fatal Shortouts" />
         </div>
      </section>

      {/* Feature Grids */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for Critical Moments.</h2>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
               We replace archaic spreadsheets and manual phone calls with absolute software precision.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <FeatureCard 
               icon={<Zap className="w-6 h-6 text-yellow-500" />} 
               title="Immediate Allocation" 
               desc="Algorithms calculate physical distress trajectories to ensure blood is waiting before the patient arrives." 
             />
             <FeatureCard 
               icon={<ShieldCheck className="w-6 h-6 text-primary" />} 
               title="Secure & Compliant" 
               desc="Full SOC2 and HIPAA compliant pipelines ensuring patient metadata is never compromised." 
             />
             <FeatureCard 
               icon={<ActivitySquare className="w-6 h-6 text-emerald-500" />} 
               title="ML Demand Sync" 
               desc="Automated synchronization with community blood donation registries to scale supply proactively." 
             />
          </div>
        </div>
      </section>

    </div>
  );
}

function StatBlock({ num, label }: any) {
  return (
    <motion.div initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} className="text-center px-4">
       <div className="text-3xl md:text-5xl font-black mb-2 text-foreground">{num}</div>
       <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  )
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <motion.div 
      initial={{opacity:0, y:30}} 
      whileInView={{opacity:1, y:0}} 
      viewport={{once:true}} 
      whileHover={{y:-10}}
      className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all"
    >
       <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 shadow-inner">{icon}</div>
       <h3 className="text-xl font-bold mb-4">{title}</h3>
       <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  )
}
