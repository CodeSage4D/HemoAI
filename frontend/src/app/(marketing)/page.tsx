"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Activity, Shield, Cpu, HeartPulse } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <HeartPulse className="w-6 h-6" />
            Hemo-Sync
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Staff Portal
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI-Powered Live Operations
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
        >
          Intelligent Blood Management <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
            For Modern Healthcare.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
        >
          Predict demand, prioritize critical patients in real-time, and ensure optimal blood supply logistics using our state-of-the-art predictive AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            Access Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/demo"
            className="flex items-center justify-center px-8 py-4 rounded-full border border-border backdrop-blur-sm hover:bg-muted transition-colors font-semibold"
          >
            View Demo
          </Link>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 px-6 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Enterprise Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">SaaS platform built for reliability, scale, and critical care prioritization.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="w-6 h-6 text-primary" />}
              title="Demand Forecasting AI"
              desc="Machine learning predicts regional blood demand allowing preemptive donor drives and inventory redistribution."
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-primary" />}
              title="Patient Intelligence"
              desc="Real-time multi-variable scoring handles prioritizing requests for critical ICU and trauma patients automatically."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="End-to-End Tracking"
              desc="Full visibility from phlebotomy to transfusion. Automated expiry alerts ensure zero wastage."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
