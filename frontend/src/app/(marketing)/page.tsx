"use client";

import { motion } from "framer-motion";
import { ArrowRight, ActivitySquare, ShieldCheck, Zap, Database, HeartPulse, Droplet, Plus, Stethoscope, Users, Microscope } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Creative Background floating icons matching UI request (Plus + Droplet Blood Patterns)
const FloatingIcon = ({ icon: Icon, className, animateOpts }: any) => (
  <motion.div
    className={`absolute opacity-[0.15] pointer-events-none drop-shadow-2xl ${className}`}
    animate={animateOpts}
    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
  >
    <Icon className="w-16 h-16" />
  </motion.div>
);

export default function HomeLandingPage() {
  
  // Custom typing effect engine
  const [keywordIndex, setKeywordIndex] = useState(0);
  const keywords = ["Clinical Intelligence.", "Diagnostic Triage.", "Medical Automation.", "Healthcare AI."];
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentWord = keywords[keywordIndex];
    if (isDeleting) {
      setDisplayText((prev) => prev.slice(0, -1));
      timeout = setTimeout(() => {}, 50); // Delete speed
      if (displayText === "") {
        setIsDeleting(false);
        setKeywordIndex((prev) => (prev + 1) % keywords.length);
      }
    } else {
      setDisplayText(currentWord.slice(0, displayText.length + 1));
      timeout = setTimeout(() => {}, 120); // Type speed
      if (displayText === currentWord) {
         timeout = setTimeout(() => setIsDeleting(true), 3000); // Wait on full word
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, keywordIndex, keywords]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        
        {/* Floating Creative Medical Pattern */}
        <FloatingIcon icon={Plus} className="top-24 left-[10%] text-rose-500" animateOpts={{y: [0, 40, 0], rotate: [0, 90, 0]}} />
        <FloatingIcon icon={Droplet} className="bottom-[20%] right-[15%] text-red-500" animateOpts={{y: [0, -50, 0], scale: [1, 1.2, 1]}} />
        <FloatingIcon icon={Plus} className="bottom-[10%] left-[20%] text-blue-500" animateOpts={{y: [0, -30, 0], rotate: [-45, 0, -45]}} />
        <FloatingIcon icon={Droplet} className="top-[30%] right-[10%] text-rose-400" animateOpts={{y: [0, 50, 0], scale: [1, 1.1, 1]}} />
        <FloatingIcon icon={ActivitySquare} className="top-[10%] right-[40%] text-emerald-500" animateOpts={{scale: [0.8, 1.1, 0.8], rotate: [0, 45, 0]}} />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }} 
               transition={{ duration: 0.5 }}
               className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-black tracking-widest uppercase shadow-sm backdrop-blur-md"
            >
               <HeartPulse className="w-5 h-5" /> V5.2 Hemo-AI Architecture Live
            </motion.div>
            
            <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tighter mb-8 leading-[1.1]">
              The Global Standard in <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-400 min-h-[1.2em] inline-block mt-4 drop-shadow-sm">
                 {displayText}<span className="animate-pulse border-r-4 border-primary ml-1 h-[0.9em] inline-block -translate-y-1"></span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl leading-relaxed mx-auto font-medium">
              We unify hospital blood banks and emergency dispatch centers using Offline PyTorch Deep Learning to execute automated, flawless patient triage directly from physical lab reports.
            </p>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/analyze" className="px-10 py-5 rounded-3xl bg-primary text-primary-foreground font-black text-lg hover:bg-primary/90 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 flex items-center gap-3">
                   Launch AI Analysis Core <ArrowRight className="w-6 h-6"/>
                </Link>
                <Link href="#about" className="px-10 py-5 rounded-3xl bg-muted/80 backdrop-blur-md text-foreground font-bold hover:bg-muted border border-border shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3">
                   Discover Our Mission &darr;
                </Link>
            </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative bg-background border-t border-border overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none"></div>
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-yellow-500/20">
                   <ActivitySquare className="w-4 h-4"/> 100% Offline Integrity
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">Bridging the Gap Between Code and Biology.</h2>
                <div className="space-y-6">
                  <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                     Hemo-Sync was engineered to eliminate critical delays in clinical diagnostics. Rather than forcing medical staff to manually interpret complex strings of hematology parameters under extreme stress, our intelligence suite mathematically parses the data instantly.
                  </p>
                  <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                     By relying on static PyTorch Neural Weights entirely downloaded to your local server, all Patient HIPAA data remains strictly isolated. We never send your documents to the cloud. We do not guess. We diagnose based on absolute physiological limits.
                  </p>
                </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative z-10">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-emerald-500/30 blur-3xl opacity-30 block rounded-full pointer-events-none scale-150"></div>
                 <div className="bg-card/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col justify-center items-center h-56 translate-y-12 overflow-hidden relative group transition-all duration-500 hover:border-primary/50">
                    <Droplet className="w-20 h-20 text-primary mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    <div className="font-black text-4xl text-foreground">0ms</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">Cloud Latency</div>
                 </div>
                 <div className="bg-card/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col justify-center items-center h-56 group transition-all duration-500 hover:border-emerald-500/50 relative">
                    <ShieldCheck className="w-20 h-20 text-emerald-500 mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    <div className="font-black text-4xl text-foreground">100%</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">Data Localization</div>
                 </div>
            </div>
         </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 bg-muted/20 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-blue-500/20">
                   <Microscope className="w-4 h-4"/> Clinical Toolset
             </div>
             <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">Enterprise Services.</h2>
             <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">Unlocking massive diagnostic scale for connected hospitals through secure, physical logic validation loops.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <FeatureCard 
               icon={<Zap className="w-8 h-8 text-yellow-500" />} 
               title="Byte-Level OCR" 
               desc="Leverages PyMuPDF mathematical byte-extraction to strip text directly out of secure PDF clinical reports without graphical pixel hallucination." 
             />
             <FeatureCard 
               icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />} 
               title="Physical Override" 
               desc="Machine Learning is untrustworthy alone. We enforce strict biological/numeric boundaries (Hb, RBC) to prevent AI false positives in clinical care." 
             />
             <FeatureCard 
               icon={<Database className="w-8 h-8 text-primary" />} 
               title="Decentralized Database" 
               desc="Syncing hospital triage queues instantly with local blood bank inventories via Supabase PostgreSQL routers, ensuring perfect 0-second delivery." 
             />
             <FeatureCard 
               icon={<Stethoscope className="w-8 h-8 text-blue-500" />} 
               title="Custom Telemetry Forms" 
               desc="Skip document uploads entirely. Clinical staff can force raw numbers immediately into the Fast-API engine for an isolated emergency evaluation." 
             />
             <FeatureCard 
               icon={<Users className="w-8 h-8 text-purple-500" />} 
               title="Urgency Routing Analytics" 
               desc="Outputs trigger distinct priority bounds (RED, YELLOW, GREEN) assigning critical trauma directly to 0-hour dispatch logic queues." 
             />
             <FeatureCard 
               icon={<HeartPulse className="w-8 h-8 text-rose-500" />} 
               title="Live Dashboarding" 
               desc="Visually tracks extracted medical variables on responsive Recharts Cartesian arrays, isolating pathology limits instantly for nursing teams." 
             />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
       <div className="w-20 h-20 rounded-[1.5rem] bg-muted group-hover:bg-background border border-transparent group-hover:border-border flex items-center justify-center mb-8 shadow-inner transition-all duration-500">{icon}</div>
       <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
       <p className="text-muted-foreground leading-relaxed text-lg font-medium">{desc}</p>
    </div>
  )
}
