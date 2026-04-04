"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ActivitySquare, ShieldCheck, Zap, UploadCloud, FileText, Bot, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0); // 0=idle, 1=OCR, 2=ML, 3=Done
  const [result, setResult] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  
  const handleDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const f = e.target.files[0];
          setFile(f);
          setAnalyzeStep(1);
          setResult(null);
          setChatOpen(false);
          
          try {
             // 1. Hit OCR Service
             const ocrForm = new FormData();
             ocrForm.append("file", f);
             const ocrRes = await fetch("http://localhost:8000/ai/ocr-service", {
                 method: "POST",
                 body: ocrForm
             }).then(r => r.json());
             
             setAnalyzeStep(2);

             // 2. Hit Ensemble Transformer Engine
             const mlRes = await fetch("http://localhost:8000/ai/final-engine", {
                 method: "POST",
                 headers: {
                     "Content-Type": "application/json"
                 },
                 body: JSON.stringify({
                     raw_text: ocrRes.raw_text,
                     hb_val: ocrRes.hb_val
                 })
             }).then(r => r.json());
             
             setResult(mlRes);
             setAnalyzeStep(3);
          } catch(err) {
             console.error("Pipeline failure:", err);
             setResult({
                 disease: "System Error. Manual Override Required.",
                 risk_score: 99.9,
                 confidence: 0.0,
                 channel: "RED",
                 reason: "Network failure isolating the PyTorch microservice container."
             });
             setAnalyzeStep(3);
          }
      }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section: Live AI Analyzer */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Instant Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Triage.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
              Upload patient blood diagnostics securely. Our hybrid PyTorch Transformer pipeline extracts contexts and calculates triage priority in real-time.
            </p>

            {/* Interactive Drag & Drop Main Block */}
            <motion.div initial={{y: 30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5, ease: "easeOut"}} className="relative w-full max-w-3xl">
               {/* Animated Glowing Gradient Ring underneath the box */}
               <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-primary to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
               
               <div className="w-full bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-3 flex flex-col relative z-10 group transition-all duration-300 hover:shadow-primary/20">
                {!result && analyzeStep === 0 && (
                    <label className="w-full h-64 border-2 border-dashed border-primary/50 hover:border-primary bg-background/50 hover:bg-primary/10 transition-all duration-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer p-6 relative overflow-hidden">
                       <UploadCloud className="w-14 h-14 text-primary mb-4 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                       <div className="font-extrabold text-2xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">Secure Medical Dropzone</div>
                       <div className="text-sm text-muted-foreground mb-6 font-medium">Auto-Ingests Dense PDF/JPG Formats via Offline AI Abstraction.</div>
                       <div className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-wide rounded-xl shadow-lg transition-colors">Select Local File</div>
                       <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleDrop} />
                    </label>
                )}

                {(analyzeStep > 0 || result) && (
                    <div className="w-full bg-card rounded-2xl p-6 relative overflow-hidden transition-all text-left flex flex-col md:flex-row gap-6">
                        {/* File Left Side */}
                        <div className="shrink-0 w-full md:w-1/3 flex flex-col items-center justify-center p-6 border border-border rounded-xl bg-muted/30">
                            <FileText className={`w-16 h-16 mb-4 ${analyzeStep < 3 ? 'text-muted-foreground animate-pulse' : 'text-primary'}`} />
                            <div className="font-bold text-center truncate w-full px-2">{file?.name || "Report.pdf"}</div>
                            <div className="text-xs text-muted-foreground mt-1">{(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB</div>
                            {result && (
                                <button onClick={() => {setResult(null); setFile(null); setAnalyzeStep(0); setChatOpen(false);}} className="text-xs font-bold text-primary mt-6 hover:underline">Process New File</button>
                            )}
                        </div>

                        {/* ML Output Right Side */}
                        <div className="flex-1 flex flex-col justify-center">
                            {analyzeStep < 3 ? (
                                <div className="space-y-4">
                                   <div className={`font-bold flex items-center gap-2 mb-2 ${analyzeStep === 1 ? 'text-blue-500' : 'text-primary'}`}><ActivitySquare className="w-5 h-5 animate-spin" /> {analyzeStep === 1 ? 'Step 1: Extracting OCR Abstractions...' : 'Step 2: Feeding XGBoost & PyTorch MLOps...'}</div>
                                   <div className="w-full bg-muted rounded-full h-2 mb-4">
                                      <div className={`bg-primary h-2 rounded-full transition-all duration-500 ${analyzeStep === 1 ? 'w-1/3' : 'w-2/3'}`} />
                                   </div>
                                   <div className="w-full h-8 bg-muted/50 rounded animate-pulse" />
                                   <div className="w-3/4 h-8 bg-muted/50 rounded animate-pulse" />
                                </div>
                            ) : (
                                <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}}>
                                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                                       <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          result.channel === 'RED' ? 'bg-destructive/10 text-destructive' : 
                                          result.channel === 'GREEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-600'
                                       }`}>
                                           PRIORITY: {result.channel} CHANNEL
                                       </div>
                                       <div className="text-xs font-bold text-muted-foreground">NLP CONFIDENCE: <span className="text-foreground">{(result.confidence * 100).toFixed(1)}%</span></div>
                                   </div>

                                   <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div>
                                         <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Detected Pathology</div>
                                         <div className="font-black text-lg">{result.disease}</div>
                                      </div>
                                      <div>
                                         <div className="text-xs font-bold text-muted-foreground uppercase mb-1">XGBoost Risk Index</div>
                                         <div className={`font-black text-3xl ${result.channel === 'RED' ? 'text-destructive' : ''}`}>{result.risk_score}</div>
                                      </div>
                                   </div>

                                   <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm font-medium leading-relaxed">
                                       <span className="font-bold text-primary block mb-1">Clinical Reason:</span> 
                                       {result.reason}
                                   </div>
                                   
                                   <button onClick={() => setChatOpen(!chatOpen)} className="mt-4 w-full py-3 bg-foreground text-background font-bold rounded-lg hover:opacity-90 flex items-center justify-center gap-2">
                                       <Bot className="w-5 h-5"/> Explain via AI Assistant
                                   </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </div>
          </motion.div>

            {/* Assistant Chatbot Accordion */}
            <AnimatePresence>
                {chatOpen && result && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="w-full max-w-3xl mt-6 bg-card border border-border shadow-xl rounded-2xl overflow-hidden text-left">
                        <div className="bg-muted p-4 font-bold flex items-center gap-2 border-b border-border">
                           <Bot className="w-5 h-5 text-primary" /> Specialist AI Clinical Assistant
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-primary"/></div>
                                <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm">
                                   I am your MLOps Clinical Assistant. Based on the `{result.channel}` channel assignment for `{result.disease}`, {result.channel === 'RED' ? "this is a massive emergency requiring 0-hour blood dispatch immediately from the primary local center." : result.channel === 'GREEN' ? "this is a chronic requirement that has bypassed standard queues for specialized tracking." : "this patient is currently stable but should be monitored for sudden Hb fluctuations."} How else can I assist in interpreting the data?
                                </div>
                            </div>
                            <div className="flex gap-4 flex-row-reverse">
                                <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm text-sm">
                                   What should I do?
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-primary"/></div>
                                <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm">
                                   Please ensure the patient has physically arrived at the hospital ward, then proceed to the Secure Login portal to verify this action inside the Triage Routing API.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
      </section>

      {/* Feature Grids */}
      <section className="py-20 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
             <FeatureCard 
               icon={<Zap className="w-6 h-6 text-yellow-500" />} 
               title="Transformer NLP" 
               desc="Leverages HuggingFace PyTorch DistilBERT models to contextually group medical definitions instantaneously." 
             />
             <FeatureCard 
               icon={<ShieldCheck className="w-6 h-6 text-primary" />} 
               title="XGBoost Math Arrays" 
               desc="Binds classification structures natively against deep non-linear regression engines for Risk Index formulation." 
             />
             <FeatureCard 
               icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />} 
               title="Explicit Rule Engine" 
               desc="Overrides Machine Learning failures by forcing critical Hemoglobin drops strictly into Red Channel protocols." 
             />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all">
       <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 shadow-inner mx-auto md:mx-0">{icon}</div>
       <h3 className="text-xl font-bold mb-4">{title}</h3>
       <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
    </div>
  )
}
