"use client";

import { motion } from "framer-motion";
import { Heart, ShieldAlert, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PatientsPage() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium mb-6">
          <Heart className="w-4 h-4" /> Patient Priority
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Data. Your Priority.</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We use ethical AI to ensure the most vulnerable patients get the blood they need first, eliminating biases and manual delays.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-24 relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border hidden md:block -z-10" />
        
        <StepCard 
          step="01" 
          icon={<FileText className="w-6 h-6" />}
          title="Hospital Intake" 
          desc="Your critical stats (Hemoglobin, Disease type) are entered securely by your physician." 
        />
        <StepCard 
          step="02" 
          icon={<ShieldAlert className="w-6 h-6" />}
          title="AI Evaluation" 
          desc="Our Scikit-Learn models objectively score your risk level against regional capacity." 
        />
        <StepCard 
          step="03" 
          icon={<Heart className="w-6 h-6" />}
          title="Instant Allocation" 
          desc="Blood is immediately reserved for you, triggering emergency transport if needed." 
        />
      </div>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="bg-card border border-border shadow-md rounded-3xl p-12 text-center max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Are you a patient requiring assistance?</h2>
        <p className="text-muted-foreground mb-8">
          While direct allocations are handled by your registered hospital, you can sign up to track your request priority anonymously.
        </p>
        <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-medium rounded-full hover:bg-muted-foreground transition-colors">
          Track My Request <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}

function StepCard({ step, icon, title, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-background border border-border p-8 rounded-3xl text-center shadow-sm relative"
    >
      <div className="w-12 h-12 bg-primary text-primary-foreground font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
        {step}
      </div>
      <div className="w-12 h-12 text-primary mx-auto mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </motion.div>
  )
}
