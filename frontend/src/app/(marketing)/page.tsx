"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Database, Users, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FloatingOrbProps {
  color: string;
  size: string;
  top: string;
  left: string;
  delay: number;
}

// Background floating elements for abstract Gen-AI tech feel
const FloatingOrb = ({ color, size, top, left, delay }: FloatingOrbProps) => (
  <motion.div
    className={`absolute rounded-full blur-[100px] opacity-30 dark:opacity-20 pointer-events-none mix-blend-screen dark:mix-blend-plus-lighter`}
    style={{ backgroundColor: color, width: size, height: size, top, left }}
    animate={{ y: [0, 40, -40, 0], x: [0, -40, 40, 0], scale: [1, 1.1, 0.9, 1] }}
    transition={{ duration: 15, repeat: Infinity, delay: delay, ease: "easeInOut" }}
  />
);

export default function HomeLandingPage() {
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const keywords = ["Clinical API", "Triage Logic", "Surgical AI", "Bio-Data"];
    let timeout: NodeJS.Timeout;
    const currentWord = keywords[keywordIndex];
    
    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText === "") {
          setIsDeleting(false);
          setKeywordIndex((prev) => (prev + 1) % keywords.length);
        }
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      }, 80);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, keywordIndex]);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-muted/20 dark:to-background z-[-2]" />
        
        {/* Dynamic Mesh Gradients */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
           <FloatingOrb color="#10b981" size="50vw" top="-10%" left="-10%" delay={0} /> {/* Emerald */}
           <FloatingOrb color="#3b82f6" size="40vw" top="20%" left="60%" delay={2} /> {/* Blue */}
           <FloatingOrb color="#f43f5e" size="30vw" top="60%" left="20%" delay={4} /> {/* Rose */}
        </div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
               className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase shadow-sm backdrop-blur-md"
            >
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> RAKTAVA V5.2 Live
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter mb-6 leading-[1.05] text-foreground transition-colors duration-300">
              The Engine for <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-400 inline-block drop-shadow-sm min-h-[1.2rem]">
                 {displayText}<span className="animate-pulse border-r-[6px] border-primary ml-1 h-[0.8em] inline-block -translate-y-2"></span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed mx-auto font-medium transition-colors duration-300">
              Automated biological parsing and deep-learning logistics routers. Bypass the cloud entirely using extreme low-latency PyTorch networks deployed securely on-site.
            </p>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                <Link href="/analyze" className="w-full sm:w-auto px-8 py-4 rounded-full bg-foreground text-background dark:bg-primary dark:text-primary-foreground font-black text-sm lg:text-base hover:scale-105 hover:shadow-2xl hover:shadow-foreground/20 dark:hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2">
                   Initialize AI Core <ArrowRight className="w-5 h-5"/>
                </Link>
                <Link href="#services" className="w-full sm:w-auto px-8 py-4 rounded-full bg-card/60 backdrop-blur-md text-foreground font-bold text-sm lg:text-base border border-border shadow-sm hover:bg-card hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2">
                   View Documentation
                </Link>
            </motion.div>

            {/* SLEEK SOS CARD (User requested Relocation & Size Reduction) */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-16 w-full max-w-md mx-auto">
               <div className="bg-card/70 dark:bg-card/50 backdrop-blur-2xl border border-destructive/20 dark:border-destructive/30 rounded-3xl p-5 shadow-2xl shadow-destructive/10 flex items-center justify-between gap-4 group transition-colors duration-300">
                  <div className="flex items-center gap-4 text-left">
                     <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-6 h-6 text-destructive animate-pulse" />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm text-foreground mb-0.5">Emergency Subsystem</h4>
                        <p className="text-[11px] text-muted-foreground font-medium leading-tight">Public geographical tracking and hyper-fast ambulance routing.</p>
                     </div>
                  </div>
                  <Link href="/sos" className="shrink-0 w-10 h-10 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shadow-destructive/30">
                     <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </motion.div>
        </div>
      </section>

      {/* Bento-Box Modern Services Architecture */}
      <section id="services" className="py-32 px-6 relative z-10 bg-muted/30 dark:bg-background border-t border-border transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
             <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground transition-colors duration-300">Engineered for Scale.</h2>
                <p className="text-muted-foreground text-lg mt-4 font-medium transition-colors duration-300">A completely decoupled, module-based healthcare API infrastructure. From PyMuPDF byte-layer analysis to Supabase-backed React interfaces.</p>
             </div>
             <div className="flex md:justify-end">
                <Link href="#about" className="text-sm font-bold bg-background dark:bg-card border border-border px-6 py-3 rounded-full hover:bg-muted transition-colors flex items-center gap-2">Read Tech Spec <ArrowRight className="w-4 h-4"/></Link>
             </div>
          </div>
          
          {/* Aesthetic Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
             
             {/* Main Wide Card */}
             <BentoCard 
               href="/analyze"
               colSpan="md:col-span-2"
               icon={<Zap className="w-6 h-6 text-yellow-500" />} 
               title="Byte-Level Mathematical OCR" 
               desc="Leverages exact document coordinate maps to strip Hb arrays directly from PDF streams, bypassing standard un-reliable visual hallucination models entirely." 
               bgClasses="bg-gradient-to-br from-card to-card/50"
             />

             {/* Square Card */}
             <BentoCard 
               href="/dashboard/map"
               colSpan="md:col-span-1"
               icon={<Users className="w-6 h-6 text-primary" />} 
               title="Routing Analytics" 
               desc="Predictive WMA load-balancing across Madhya Pradesh trauma centers." 
               bgClasses="bg-card"
             />

             {/* Square Card */}
             <BentoCard 
               href="/analyze"
               colSpan="md:col-span-1"
               icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />} 
               title="Physical Override" 
               desc="Strict clinical parameter thresholds (Hb, Plt) enforced via server middleware." 
               bgClasses="bg-card"
             />

             {/* Main Wide Card */}
             <BentoCard 
               href="/dashboard/inventory"
               colSpan="md:col-span-2"
               icon={<Database className="w-6 h-6 text-purple-500" />} 
               title="Distributed SQL Network" 
               desc="Multi-node PostgreSQL architecture seamlessly locking active dispatch requests to physical blood inventory, removing race conditions across hospital branches." 
               bgClasses="bg-gradient-to-tl from-card to-card/50"
             />

          </div>
        </div>
      </section>
    </div>
  );
}

interface BentoCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  colSpan: string;
  bgClasses: string;
}

// Sleek Bento Box Component
function BentoCard({ icon, title, desc, href, colSpan, bgClasses }: BentoCardProps) {
  return (
    <Link href={href || "#"} className={`${colSpan} ${bgClasses} p-8 rounded-[2rem] border border-border/60 hover:border-border shadow-sm hover:shadow-xl dark:shadow-none hover:shadow-primary/5 transition-all duration-500 group flex flex-col justify-between overflow-hidden relative backdrop-blur-xl`}>
       
       <div className="absolute top-0 right-0 w-32 h-32 bg-foreground dark:bg-primary opacity-0 group-hover:opacity-[0.03] rounded-full blur-3xl transition-opacity duration-500 pointer-events-none" />
       
       <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-background border border-transparent group-hover:border-border flex items-center justify-center mb-6 shadow-sm transition-all duration-500 z-10">
          {icon}
       </div>
       <div className="z-10">
          <h3 className="text-xl font-extrabold mb-2 tracking-tight text-foreground transition-colors duration-300">{title}</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed transition-colors duration-300">{desc}</p>
       </div>
    </Link>
  )
}
