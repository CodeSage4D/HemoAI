"use client";

import { motion } from "framer-motion";
import { ActivitySquare, UploadCloud, Bot, AlertTriangle, CheckCircle2, UserCircle, Edit3, Droplets, Activity, HeartPulse } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AnalyzePage() {
  const [entryMode, setEntryMode] = useState<'upload' | 'manual'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0); 
  const [result, setResult] = useState<any>(null);
  const [ocrData, setOcrData] = useState<any>(null);
  
  const [manual, setManual] = useState({ 
    patient_name: "John Doe", patient_age: "45", context: "",
    hb: "", rbc: "", wbc: "", platelets: "", mcv: "", hct: "", mch: "", mchc: "", rdw: "", // CBC
    alt: "", ast: "", bilirubin: "", albumin: "", // LFT
    creatinine: "", urea: "", bun: "", // KFT
    cholesterol: "", hdl: "", ldl: "", triglycerides: "", // Lipids
    t3: "", t4: "", tsh: "", // Thyroid
    glucose: "", hba1c: "", // Diabetes
    vit_b12: "", vit_d: "" // Vitamins
  });

  const handleDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const f = e.target.files[0];
          setFile(f);
          setAnalyzeStep(1);
          setResult(null);
          setOcrData(null);
          
          try {
             // 1. Hit OCR Service Engine
             const ocrForm = new FormData();
             ocrForm.append("file", f);
             const ocrRes = await fetch("http://localhost:8000/ai/ocr-service", {
                 method: "POST",
                 body: ocrForm
             }).then(r => r.json());
             
             setOcrData(ocrRes);
             setAnalyzeStep(2);

             // 2. Hit Ensemble PyTorch Engine with complete 30-parameter payload
             const mlRes = await fetch("http://localhost:8000/ai/final-engine", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify(ocrRes)
             }).then(r => r.json());
             
             setResult(mlRes);
             setAnalyzeStep(3);
          } catch(err) {
             console.error("Pipeline failure:", err);
             setResult({ status: "REVIEW_REQUIRED", conditions: ["System Error"], risk_score: 99.9, confidence: 0.0, channel: "RED", reason: String(err), recommendation: "Network architecture failure." });
             setAnalyzeStep(3);
          }
      }
  };

  const submitManual = async (e: React.FormEvent) => {
      e.preventDefault();
      setAnalyzeStep(2);
      setResult(null);
      
      const parsedData = {
           raw_text: manual.context || "Manual Override. No qualitative context provided.",
           patient_name: manual.patient_name || "Unknown",
           patient_age: manual.patient_age || "0",
           hb: parseFloat(manual.hb) || 0,
           rbc: parseFloat(manual.rbc) || 0,
           wbc: parseFloat(manual.wbc) || 0,
           platelets: parseFloat(manual.platelets) || 0,
           mcv: parseFloat(manual.mcv) || 0,
           hct: parseFloat(manual.hct) || 0,
           mch: parseFloat(manual.mch) || 0,
           mchc: parseFloat(manual.mchc) || 0,
           rdw: parseFloat(manual.rdw) || 0,
           alt: parseFloat(manual.alt) || 0,
           ast: parseFloat(manual.ast) || 0,
           bilirubin: parseFloat(manual.bilirubin) || 0,
           albumin: parseFloat(manual.albumin) || 0,
           creatinine: parseFloat(manual.creatinine) || 0,
           urea: parseFloat(manual.urea) || 0,
           bun: parseFloat(manual.bun) || 0,
           cholesterol: parseFloat(manual.cholesterol) || 0,
           hdl: parseFloat(manual.hdl) || 0,
           ldl: parseFloat(manual.ldl) || 0,
           triglycerides: parseFloat(manual.triglycerides) || 0,
           t3: parseFloat(manual.t3) || 0,
           t4: parseFloat(manual.t4) || 0,
           tsh: parseFloat(manual.tsh) || 0,
           glucose: parseFloat(manual.glucose) || 0,
           hba1c: parseFloat(manual.hba1c) || 0,
           vit_b12: parseFloat(manual.vit_b12) || 0,
           vit_d: parseFloat(manual.vit_d) || 0
      };
      
      setOcrData(parsedData);
      
      try {
             const mlRes = await fetch("http://localhost:8000/ai/final-engine", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify(parsedData)
             }).then(r => r.json());
             setResult(mlRes);
             setAnalyzeStep(3);
      } catch(err) {
             setResult({ status: "REVIEW_REQUIRED", conditions: ["API Error"], risk_score: 99.9, confidence: 0.0, channel: "RED", reason: String(err), recommendation: "Manual Mode Network failure." });
             setAnalyzeStep(3);
      }
  };

  const getVisualStatus = (val: number, range: [number, number]) => {
     if (val === 0) return "bg-muted/50 text-muted-foreground border-border";
     if (val < range[0] || val > range[1]) return "bg-destructive/10 text-destructive border-destructive/20";
     return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  }

  // Dynamic Array Charts
  const cbcChart = [
     { name: "Hb", value: ocrData?.hb || 0, optimal: 13.5 },
     { name: "RBC", value: ocrData?.rbc || 0, optimal: 5.0 },
     { name: "WBC", value: ocrData?.wbc || 0, optimal: 7.5 },
     { name: "MCV", value: ocrData?.mcv || 0, optimal: 90.0 }
  ].filter(d => d.value > 0);

  const lftChart = [
     { name: "ALT", value: ocrData?.alt || 0, optimal: 25.0 },
     { name: "AST", value: ocrData?.ast || 0, optimal: 25.0 },
     { name: "Bilirubin", value: ocrData?.bilirubin || 0, optimal: 1.0 }
  ].filter(d => d.value > 0);

  const metaChart = [
     { name: "Glucose", value: ocrData?.glucose || 0, optimal: 90.0 },
     { name: "HbA1c", value: ocrData?.hba1c || 0, optimal: 5.0 },
     { name: "Creatinine", value: ocrData?.creatinine || 0, optimal: 0.9 },
     { name: "TSH", value: ocrData?.tsh || 0, optimal: 2.0 }
  ].filter(d => d.value > 0);
  
  const hasMultiplePanels = lftChart.length > 0 || metaChart.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Multi-Panel <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Diagnosis.</span>
            </h1>

            <motion.div initial={{y: 30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5, ease: "easeOut"}} className="relative w-full max-w-6xl mt-8">
               <div className="bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-3 flex flex-col relative z-10 transition-all duration-300">
                
                {/* Entry Toggle */}
                {!result && analyzeStep === 0 && (
                  <div className="flex bg-muted/50 p-1 rounded-2xl mb-4 w-full max-w-md mx-auto relative border border-border">
                     <button onClick={() => setEntryMode('upload')} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${entryMode === 'upload' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}><UploadCloud className="w-4 h-4"/> PDF Document OCR</button>
                     <button onClick={() => setEntryMode('manual')} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${entryMode === 'manual' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}><Edit3 className="w-4 h-4"/> Multi-Panel Force</button>
                  </div>
                )}

                {/* Upload Mode UI */}
                {!result && analyzeStep === 0 && entryMode === 'upload' && (
                    <label className="w-full h-64 border-2 border-dashed border-primary/50 hover:border-primary bg-background/50 hover:bg-primary/10 transition-all duration-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer p-6 relative overflow-hidden group">
                       <UploadCloud className="w-14 h-14 text-primary mb-4 drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                       <div className="font-extrabold text-2xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">Analyze Patient Lab Results</div>
                       <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleDrop} />
                       <div className="mt-4 px-6 py-2 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">Supports CBC, LFT, KFT, LIPIDS, THYROID</div>
                    </label>
                )}

                {/* Manual Mode UI */}
                {!result && analyzeStep === 0 && entryMode === 'manual' && (
                    <form onSubmit={submitManual} className="w-full bg-background/50 rounded-2xl p-8 border border-border text-left overflow-y-auto max-h-[70vh]">
                       <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Edit3 className="w-5 h-5 text-primary"/> Advanced Multi-Panel Injector</h3>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                           <div className="space-y-1"><label className="text-xs font-bold uppercase opacity-70">Patient Name</label><input required value={manual.patient_name} onChange={e=>setManual({...manual, patient_name: e.target.value})} className="w-full bg-muted p-2 rounded-lg border outline-none focus:ring-1" /></div>
                           <div className="space-y-1"><label className="text-xs font-bold uppercase opacity-70">Age</label><input required value={manual.patient_age} onChange={e=>setManual({...manual, patient_age: e.target.value})} type="number" className="w-full bg-muted p-2 rounded-lg border outline-none focus:ring-1" /></div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                           {/* Blood Component */}
                           <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                              <h4 className="font-black text-sm uppercase mb-4 text-emerald-500 flex items-center gap-2"><Droplets className="w-4 h-4"/> CBC Panel</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <input placeholder="Hb" value={manual.hb} onChange={e=>setManual({...manual, hb: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="RBC" value={manual.rbc} onChange={e=>setManual({...manual, rbc: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="WBC" value={manual.wbc} onChange={e=>setManual({...manual, wbc: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="Platelets" value={manual.platelets} onChange={e=>setManual({...manual, platelets: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="MCV" value={manual.mcv} onChange={e=>setManual({...manual, mcv: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                              </div>
                           </div>
                           
                           {/* LFT Component */}
                           <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                              <h4 className="font-black text-sm uppercase mb-4 text-rose-500 flex items-center gap-2"><Activity className="w-4 h-4"/> Liver Panel</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <input placeholder="ALT" value={manual.alt} onChange={e=>setManual({...manual, alt: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="AST" value={manual.ast} onChange={e=>setManual({...manual, ast: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="Bilirubin" value={manual.bilirubin} onChange={e=>setManual({...manual, bilirubin: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="Albumin" value={manual.albumin} onChange={e=>setManual({...manual, albumin: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                              </div>
                           </div>

                           {/* Metabolic Component */}
                           <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                              <h4 className="font-black text-sm uppercase mb-4 text-blue-500 flex items-center gap-2"><HeartPulse className="w-4 h-4"/> Metabolic & Thyroid</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <input placeholder="Glucose" value={manual.glucose} onChange={e=>setManual({...manual, glucose: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="HbA1c" value={manual.hba1c} onChange={e=>setManual({...manual, hba1c: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="Creatinine" value={manual.creatinine} onChange={e=>setManual({...manual, creatinine: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="TSH" value={manual.tsh} onChange={e=>setManual({...manual, tsh: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                                <input placeholder="Cholesterol" value={manual.cholesterol} onChange={e=>setManual({...manual, cholesterol: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border outline-none" />
                              </div>
                           </div>
                       </div>
                       
                       <input value={manual.context} onChange={e=>setManual({...manual, context: e.target.value})} placeholder="Optional NLP Context (e.g. chronic bleeding)" className="w-full bg-muted p-3 mb-6 rounded-lg border outline-none focus:ring-1" />
                       <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"><ActivitySquare className="w-5 h-5"/> Compute Comprehensive Health Triage</button>
                    </form>
                )}

                {/* Analysis Loading State */}
                {analyzeStep < 3 && analyzeStep > 0 && (
                     <div className="w-full bg-card rounded-2xl p-6 text-center py-32">
                         <div className={`font-bold flex items-center justify-center gap-2 mb-6 ${analyzeStep === 1 ? 'text-blue-500' : 'text-primary'}`}><ActivitySquare className="w-8 h-8 animate-spin" /> {analyzeStep === 1 ? 'Mapping 30+ potential extraction points...' : 'Evaluating PyTorch Limits...'}</div>
                         <div className="w-full max-w-md mx-auto bg-muted rounded-full h-3 mb-4 overflow-hidden">
                            <div className={`bg-primary h-3 rounded-full transition-all duration-500 ${analyzeStep === 1 ? 'w-1/3' : 'w-2/3'}`} />
                         </div>
                     </div>
                )}

                {/* Output Dashboard */}
                {analyzeStep === 3 && result && (
                    <div className="w-full text-left flex flex-col gap-6 p-4">
                        {/* Summary Ribbon */}
                        <div className={`w-full rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between border shadow-sm ${result.status === 'NORMAL' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : result.status === 'BORDERLINE' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                           <div className="mb-4 md:mb-0">
                               <div className="text-2xl font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                  {result.status} {result.status === "NORMAL" ? <CheckCircle2 className="w-6 h-6"/> : <AlertTriangle className="w-6 h-6" />}
                               </div>
                               <div className="text-sm font-bold opacity-90 leading-relaxed flex flex-wrap gap-2">
                                 {result.conditions?.map((c: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-background/50 rounded-lg border border-border shadow-sm">{c}</span>
                                 )) || <span className="px-3 py-1 bg-background/50 rounded-lg border border-border shadow-sm">{result.conditions}</span>}
                               </div>
                           </div>
                           <div className="text-right flex flex-col md:items-end w-full md:w-auto mt-4 md:mt-0 p-4 border md:border-0 rounded-xl bg-background/30">
                               <div className="text-xl font-bold flex items-center gap-2"><UserCircle className="w-5 h-5 opacity-50"/> {ocrData?.patient_name || 'Unknown Patient'}</div>
                               <div className="text-sm opacity-80 uppercase tracking-widest font-bold">{ocrData?.patient_age || '--'} YRS</div>
                           </div>
                        </div>

                        {/* Middle Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Graphic Chart Array */}
                            <div className="md:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                                <h3 className="font-bold text-lg flex items-center gap-2"><ActivitySquare className="w-4 h-4"/> Physical Matrix Visualization</h3>
                                
                                <div className={`grid ${hasMultiplePanels ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 flex-1`}>
                                   
                                   {cbcChart.length > 0 && (
                                     <div className="flex-1 min-h-[200px] border border-border/50 rounded-xl p-4 bg-muted/10">
                                         <h4 className="text-xs font-black uppercase text-emerald-500 mb-4 tracking-widest">Blood Panel</h4>
                                         <ResponsiveContainer width="100%" height="100%" minHeight={150}>
                                             <BarChart data={cbcChart} margin={{top: 5, right: 0, left: -30, bottom: 0}}>
                                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                                                 <YAxis axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                                                 <Tooltip cursor={{fill: "transparent"}} contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "10px", color: "hsl(var(--foreground))"}} />
                                                 <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                                   {cbcChart.map((entry, index) => (
                                                     <Cell key={`cell-${index}`} fill={entry.value < (entry.optimal * 0.6) ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
                                                   ))}
                                                 </Bar>
                                             </BarChart>
                                         </ResponsiveContainer>
                                     </div>
                                   )}

                                   {lftChart.length > 0 && (
                                     <div className="flex-1 min-h-[200px] border border-border/50 rounded-xl p-4 bg-muted/10">
                                         <h4 className="text-xs font-black uppercase text-rose-500 mb-4 tracking-widest">Liver Panel</h4>
                                         <ResponsiveContainer width="100%" height="100%" minHeight={150}>
                                             <BarChart data={lftChart} margin={{top: 5, right: 0, left: -30, bottom: 0}}>
                                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                                                 <YAxis axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                                                 <Tooltip cursor={{fill: "transparent"}} />
                                                 <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                                   {lftChart.map((entry, index) => (
                                                     <Cell key={`cell-${index}`} fill={entry.value > (entry.optimal * 1.5) ? "hsl(var(--destructive))" : "hsl(var(--emerald-500))"} />
                                                   ))}
                                                 </Bar>
                                             </BarChart>
                                         </ResponsiveContainer>
                                     </div>
                                   )}

                                   {metaChart.length > 0 && (
                                     <div className="flex-1 min-h-[200px] border border-border/50 rounded-xl p-4 bg-muted/10">
                                         <h4 className="text-xs font-black uppercase text-blue-500 mb-4 tracking-widest">Metabolic & Thyroid</h4>
                                         <ResponsiveContainer width="100%" height="100%" minHeight={150}>
                                             <BarChart data={metaChart} margin={{top: 5, right: 0, left: -30, bottom: 0}}>
                                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                                                 <YAxis axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 12}} />
                                                 <Tooltip cursor={{fill: "transparent"}} />
                                                 <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                                   {metaChart.map((entry, index) => (
                                                     <Cell key={`cell-${index}`} fill={"hsl(var(--blue-500))"} />
                                                   ))}
                                                 </Bar>
                                             </BarChart>
                                         </ResponsiveContainer>
                                     </div>
                                   )}
                                </div>
                            </div>

                            {/* Values Column (Dynamic Priority Cards) */}
                            <div className="flex flex-col gap-3">
                               {ocrData?.platelets > 0 && (
                                   <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${getVisualStatus(ocrData?.platelets, [150, 450])}`}>
                                      <div><div className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">Platelets</div><div className="font-black text-xl">{ocrData?.platelets}</div></div>
                                   </div>
                               )}
                               {ocrData?.hba1c > 0 && (
                                   <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${getVisualStatus(ocrData?.hba1c, [4.0, 5.7])}`}>
                                      <div><div className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">HbA1c Diabeteics</div><div className="font-black text-xl">{ocrData?.hba1c} <span className="text-xs font-normal">%</span></div></div>
                                   </div>
                               )}
                               {ocrData?.cholesterol > 0 && (
                                   <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${getVisualStatus(ocrData?.cholesterol, [0, 200])}`}>
                                      <div><div className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">Tot. Cholesterol</div><div className="font-black text-xl">{ocrData?.cholesterol}</div></div>
                                   </div>
                               )}
                               {ocrData?.alt > 0 && (
                                   <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${getVisualStatus(ocrData?.alt, [0, 45])}`}>
                                      <div><div className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">Liver (ALT)</div><div className="font-black text-xl">{ocrData?.alt}</div></div>
                                   </div>
                               )}
                               {ocrData?.tsh > 0 && (
                                   <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${getVisualStatus(ocrData?.tsh, [0.4, 4.5])}`}>
                                      <div><div className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">Thyroid (TSH)</div><div className="font-black text-xl">{ocrData?.tsh}</div></div>
                                   </div>
                               )}
                               
                               <div className="p-4 border border-border rounded-xl mt-auto">
                                    <button onClick={() => {setResult(null); setFile(null); setAnalyzeStep(0);}} className="w-full py-2 font-bold text-primary hover:underline flex items-center justify-center gap-2"><UploadCloud className="w-4 h-4"/> Reset Engine</button>
                               </div>
                            </div>
                        </div>

                        {/* AI Explanation Box */}
                        <div className="w-full bg-muted/30 border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1">
                                <h3 className="font-bold flex items-center gap-2 mb-4"><Bot className="w-5 h-5 text-primary"/> AI Clinical Synthesis </h3>
                                <div className="text-sm font-medium leading-relaxed text-foreground mb-4">
                                    <span className="font-bold text-primary mr-2">Calculated Reason:</span> 
                                    {result.reason}
                                </div>
                                {result.recommendation && (
                                    <div className={`p-4 rounded-xl border text-sm font-bold shadow-sm ${result.status === 'NORMAL' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-background border-border text-foreground'}`}>
                                        {result.recommendation}
                                    </div>
                                )}
                            </div>
                            <div className="md:w-1/3 flex flex-col text-right gap-3 justify-center">
                               <div className="text-xs font-bold px-3 py-3 bg-background border border-border rounded-xl text-center shadow-sm">NLP CONFIDENCE BOUND: <br/><span className="text-2xl mt-1 block">{(result.confidence * 100).toFixed(1)}%</span></div>
                               <div className={`text-xs font-bold px-3 py-2 border rounded-xl text-center shadow-sm ${result.channel === 'RED' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-background border-border'}`}>PRIORITY INDEX: {result.channel}</div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
