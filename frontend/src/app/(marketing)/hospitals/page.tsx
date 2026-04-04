"use client";

import { motion } from "framer-motion";
import { Building2, Stethoscope, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HospitalsPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" /> For Institutions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Empower Your Hospital with AI Logistics.</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Hemo-Sync connects your internal trauma inventory with regional blood banks, ensuring you never face life-threatening stockouts during mass casualty incidents or critical surgeries.
          </p>
          
          <div className="space-y-4 mb-10">
             <FeatureItem text="Direct API integration with Epic & Cerner" />
             <FeatureItem text="Automated procurement requests" />
             <FeatureItem text="Patient diagnostic confidence scoring" />
             <FeatureItem text="HIPAA & SOC2 Compliant Cloud Architecture" />
          </div>

          <Link href="/signup" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-primary/30 transition-all inline-block hover:-translate-y-1">
            Create Institutional Account
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[600px] rounded-3xl bg-muted border border-border shadow-2xl overflow-hidden flex items-center justify-center"
        >
           {/* Mockup UI representation */}
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-emerald-500/10" />
           <div className="w-[80%] h-[80%] bg-card rounded-2xl shadow-xl border border-border p-6 flex flex-col gap-4 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                 <div className="font-bold flex items-center gap-2"><Stethoscope className="w-5 h-5 text-primary"/> OR Status</div>
                 <Lock className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                 <div className="h-10 bg-muted rounded-lg w-full animate-pulse" />
                 <div className="h-10 bg-muted rounded-lg w-4/5 animate-pulse delay-75" />
                 <div className="h-10 bg-muted rounded-lg w-full animate-pulse delay-150" />
                 <div className="h-10 bg-destructive/20 border border-destructive/30 rounded-lg w-3/4 flex items-center px-4 mt-6">
                    <div className="w-2 h-2 rounded-full bg-destructive animate-ping mr-3" /> Critical Shortage Alert
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 font-medium">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      <span>{text}</span>
    </div>
  )
}
