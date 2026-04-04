"use client";

import { motion } from "framer-motion";
import { LineChart, Zap, Database, BrainCircuit, Activity } from "lucide-react";
import Link from "next/link";

const services = [
  { icon: <BrainCircuit className="w-8 h-8"/>, title: "ML Triage Engine", desc: "Prioritizes incoming physical distress logic to instantly triage high-hemoglobin loss cases." },
  { icon: <LineChart className="w-8 h-8"/>, title: "Forecast Analytics", desc: "Granular graphical prediction indicating O- and A+ demand surges based on community variables." },
  { icon: <Database className="w-8 h-8"/>, title: "Inventory Automation", desc: "Automatically synchronizes blood bag expiration via barcode to local hospital systems." },
  { icon: <Activity className="w-8 h-8"/>, title: "Emergency Routing", desc: "Triggers SMS and push notifications to eligible nearby donors when specific types are critically low." }
];

export default function ServicesPage() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Providing comprehensive technological infrastructure for blood banks and institutional hospitals globally.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-24">
        {services.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-6 p-8 rounded-3xl bg-muted/40 border border-border/50 hover:bg-muted/80 transition-colors"
          >
            <div className="text-primary shrink-0 p-4 bg-background rounded-2xl shadow-sm border border-border h-max">
              {s.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full rounded-3xl bg-gradient-to-br from-primary to-emerald-600 p-12 text-center text-white"
      >
        <Zap className="w-12 h-12 mx-auto mb-6 text-white/80" />
        <h2 className="text-3xl font-bold mb-6">Ready to upgrade your infrastructure?</h2>
        <Link href="/contact" className="inline-block px-8 py-4 bg-white text-emerald-700 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all">
          Request Implementation
        </Link>
      </motion.div>
    </div>
  );
}
