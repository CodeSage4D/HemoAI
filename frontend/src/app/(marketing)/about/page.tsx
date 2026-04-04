"use client";

import { motion } from "framer-motion";
import { ShieldCheck, HeartPulse, ActivitySquare } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Redefining Blood Management for the Modern Era.</h1>
        <p className="text-lg text-muted-foreground">
          At Hemo-Sync, our mission is to eliminate blood shortages by predicting local demand and matching critical supply to priority patients with precision AI intelligence.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        <AboutFeature icon={<ShieldCheck className="w-8 h-8 text-primary" />} title="Absolute Reliability" desc="Built and deployed on ultra-resilient architectural standards to guarantee our systems never falter during a trauma alert." />
        <AboutFeature icon={<HeartPulse className="w-8 h-8 text-emerald-500" />} title="Empathy & Integrity" desc="Connecting communities to health networks securely. Data protection and anonymous routing keeps families safe." />
        <AboutFeature icon={<ActivitySquare className="w-8 h-8 text-blue-500" />} title="Predictive AI" desc="Leveraging deep neural networks and Scikit-Learn pipelines to project regional shortage events weeks before they occur." />
      </div>

      <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         whileInView={{ opacity: 1, scale: 1 }}
         viewport={{ once: true }}
         className="mt-32 rounded-3xl bg-primary/10 overflow-hidden relative"
      >
        <div className="p-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Vision for 2030</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto italic">
              "We envision a decade where no patient is ever turned away due to a logistical shortage of blood products. Hemo-Sync will bridge the gap between availability and instantaneous hospital delivery across the entire continent."
            </p>
        </div>
      </motion.div>
    </div>
  );
}

function AboutFeature({ icon, title, desc }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="mb-6 p-4 rounded-xl bg-muted inline-block">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </motion.div>
  )
}
