"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileScan, UploadCloud, FileText, CheckCircle2, 
  AlertTriangle, ArrowRight, Bot, ActivitySquare, 
  UserCircle, Edit3, Droplets, Activity, HeartPulse,
  Loader2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { metricsApi } from "@/lib/api";

interface OcrData {
  hb: number;
  rbc: number;
  wbc: number;
  platelets: number;
  mcv: number;
  hct: number;
  mch: number;
  mchc: number;
  rdw: number;
  alt: number;
  ast: number;
  bilirubin: number;
  albumin: number;
  creatinine: number;
  urea: number;
  bun: number;
  cholesterol: number;
  hdl: number;
  ldl: number;
  triglycerides: number;
  t3: number;
  t4: number;
  tsh: number;
  glucose: number;
  hba1c: number;
  vit_b12: number;
  vit_d: number;
  patient_name?: string;
  patient_age?: string;
  raw_text?: string;
}

interface AnalysisResult {
  status: string;
  conditions: string[] | string;
  risk_score: number;
  confidence: number;
  channel: string;
  reason: string;
  recommendation: string;
}

export default function AnalyzerPage() {
  const [entryMode, setEntryMode] = useState<'upload' | 'manual'>('upload');
  const [analyzeStep, setAnalyzeStep] = useState(0); 
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [ocrData, setOcrData] = useState<OcrData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [submittingLogistics, setSubmittingLogistics] = useState(false);
  const [logisticsSuccess, setLogisticsSuccess] = useState(false);
  const [bloodGroupConfirm, setBloodGroupConfirm] = useState("O-");
  const [unitsReq, setUnitsReq] = useState("1");

  const handleDispatchLogistics = async () => {
    setSubmittingLogistics(true);
    setErrorMsg(null);
    try {
      const name = ocrData?.patient_name || manual.patient_name || "John Doe";
      const age = parseInt(ocrData?.patient_age || manual.patient_age || "45");
      const hb = ocrData?.hb || parseFloat(manual.hb) || 13.5;
      const conditionsStr = result?.conditions 
        ? (Array.isArray(result.conditions) ? result.conditions.join(', ') : result.conditions) 
        : "General panel analysis";

      await metricsApi.submitRequest({
        patientName: name,
        patientAge: age,
        gender: manual.gender || "Male",
        bloodGroup: bloodGroupConfirm,
        unitsRequired: parseInt(unitsReq) || 1,
        hemoglobinLevel: hb,
        diseaseType: conditionsStr
      });
      setLogisticsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to dispatch request to logistics engine.");
    } finally {
      setSubmittingLogistics(false);
    }
  };

  const [manual, setManual] = useState({ 
    patient_name: "John Doe", patient_age: "45", context: "", gender: "Male",
    hb: "", rbc: "", wbc: "", platelets: "", mcv: "", hct: "", mch: "", mchc: "", rdw: "", 
    alt: "", ast: "", bilirubin: "", albumin: "", 
    creatinine: "", urea: "", bun: "", 
    cholesterol: "", hdl: "", ldl: "", triglycerides: "", 
    t3: "", t4: "", tsh: "", 
    glucose: "", hba1c: "", 
    vit_b12: "", vit_d: "" 
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAnalyzeStep(1);
      setResult(null);
      setOcrData(null);
      setErrorMsg(null);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        // Step 1: Call OCR Service
        const ocrResponse = await fetch(`${apiUrl}/ai/ocr-service`, {
          method: "POST",
          body: formData,
        });

        if (!ocrResponse.ok) {
          const errData = await ocrResponse.json().catch(() => null);
          throw new Error(errData?.message || "OCR Service parsing failed.");
        }
        
        const ocrResponseJson = await ocrResponse.json();
        const ocrPayload = ocrResponseJson.status === "success" ? ocrResponseJson.data : ocrResponseJson;
        setOcrData(ocrPayload);
        setAnalyzeStep(2);

        // Step 2: Call Final AI Engine
        const engineResponse = await fetch(`${apiUrl}/ai/final-engine`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ocrPayload),
        });

        if (!engineResponse.ok) {
          const errData = await engineResponse.json().catch(() => null);
          throw new Error(errData?.message || "AI decision engine failed.");
        }

        const engineResponseJson = await engineResponse.json();
        const finalResult = engineResponseJson.status === "success" ? engineResponseJson.data : engineResponseJson;
        setResult(finalResult);
        setAnalyzeStep(3);
      } catch (err: any) {
        console.error("ANALYSIS_ERROR:", err);
        setErrorMsg(err.message || "Failed to complete AI report parsing pipeline.");
        setAnalyzeStep(0);
        setFile(null);
      }
    }
  };

  const submitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzeStep(2);
    setResult(null);
    setErrorMsg(null);

    const parsedData: OcrData = {
      raw_text: manual.context || "Manual Override. No qualitative context provided.",
      patient_name: manual.patient_name || "Unknown Patient",
      patient_age: manual.patient_age || "Unknown",
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
      const response = await fetch(`${apiUrl}/ai/final-engine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "AI manual triage pipeline failed.");
      }

      const resJson = await response.json();
      const finalResult = resJson.status === "success" ? resJson.data : resJson;
      setResult(finalResult);
      setAnalyzeStep(3);
    } catch (err: any) {
      console.error("MANUAL_ERROR:", err);
      setErrorMsg(err.message || "Manual triage execution pipeline failed.");
      setAnalyzeStep(0);
    }
  };

  const getVisualStatus = (val: number | undefined, range: [number, number]) => {
    if (!val || val === 0) return "bg-muted/50 text-muted-foreground border-border";
    if (val < range[0] || val > range[1]) return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  };

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
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileScan className="w-6 h-6 text-primary" /> RAKTAVA Medical Intelligence Engine
          </h2>
          <p className="text-muted-foreground text-sm max-w-3xl mt-1">
            Ingest clinical blood panel PDF/Images. The system extracts parameters, performs rule validation, and assigns priority triages.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-destructive/15 text-destructive rounded-xl border border-destructive/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm font-medium">{errorMsg}</div>
        </div>
      )}

      <div className="bg-card border border-border shadow-sm rounded-2xl p-6 transition-all duration-300 flex-1 flex flex-col min-h-[450px]">
        {/* Toggle Mode */}
        {!result && analyzeStep === 0 && (
          <div className="flex bg-muted/50 p-1 rounded-2xl mb-6 w-full max-w-md mx-auto border border-border">
            <button 
              onClick={() => setEntryMode('upload')} 
              className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${entryMode === 'upload' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              <UploadCloud className="w-4 h-4"/> Document OCR
            </button>
            <button 
              onClick={() => setEntryMode('manual')} 
              className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${entryMode === 'manual' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              <Edit3 className="w-4 h-4"/> Manual Entry
            </button>
          </div>
        )}

        {/* Upload Form */}
        {!result && analyzeStep === 0 && entryMode === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <label className="w-full max-w-2xl h-64 border-2 border-dashed border-primary/50 hover:border-primary bg-background/50 hover:bg-primary/5 transition-all duration-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer p-6 text-center group">
              <UploadCloud className="w-12 h-12 text-primary mb-4 group-hover:scale-105 transition-transform" />
              <div className="font-extrabold text-xl mb-1 text-foreground">Ingest Lab Report File</div>
              <div className="text-sm text-muted-foreground mb-4">Drag & drop or click to upload PDF/Image (Max 10MB)</div>
              <div className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider">Select Report File</div>
              <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleUpload} />
            </label>
          </div>
        )}

        {/* Manual Form */}
        {!result && analyzeStep === 0 && entryMode === 'manual' && (
          <form onSubmit={submitManual} className="w-full bg-background/50 rounded-xl p-6 border border-border text-left overflow-y-auto max-h-[70vh]">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Edit3 className="w-5 h-5 text-primary"/> Direct Telemetry Injector</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-75">Patient Name</label>
                <input required value={manual.patient_name} onChange={e => setManual({...manual, patient_name: e.target.value})} className="w-full bg-muted p-2 rounded-lg border outline-none focus:ring-1 border-border" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase opacity-75">Age</label>
                <input required value={manual.patient_age} onChange={e => setManual({...manual, patient_age: e.target.value})} type="number" className="w-full bg-muted p-2 rounded-lg border outline-none focus:ring-1 border-border" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* CBC Panel */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <h4 className="font-black text-sm uppercase mb-3 text-emerald-500 flex items-center gap-2"><Droplets className="w-4 h-4"/> CBC (Hemoglobin & Cells)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Hb (g/dL)" value={manual.hb} onChange={e => setManual({...manual, hb: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="RBC (M/uL)" value={manual.rbc} onChange={e => setManual({...manual, rbc: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="WBC (K/uL)" value={manual.wbc} onChange={e => setManual({...manual, wbc: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="Platelets (K)" value={manual.platelets} onChange={e => setManual({...manual, platelets: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="MCV (fL)" value={manual.mcv} onChange={e => setManual({...manual, mcv: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                </div>
              </div>
              
              {/* Liver Panel */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <h4 className="font-black text-sm uppercase mb-3 text-rose-500 flex items-center gap-2"><Activity className="w-4 h-4"/> Liver Panel (LFT)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="ALT (U/L)" value={manual.alt} onChange={e => setManual({...manual, alt: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="AST (U/L)" value={manual.ast} onChange={e => setManual({...manual, ast: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="Bilirubin" value={manual.bilirubin} onChange={e => setManual({...manual, bilirubin: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="Albumin" value={manual.albumin} onChange={e => setManual({...manual, albumin: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                </div>
              </div>

              {/* Metabolic Panel */}
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <h4 className="font-black text-sm uppercase mb-3 text-blue-500 flex items-center gap-2"><HeartPulse className="w-4 h-4"/> Kidney & Glucose</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Glucose (mg/dL)" value={manual.glucose} onChange={e => setManual({...manual, glucose: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="HbA1c (%)" value={manual.hba1c} onChange={e => setManual({...manual, hba1c: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="Creatinine" value={manual.creatinine} onChange={e => setManual({...manual, creatinine: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                  <input placeholder="TSH (uIU/mL)" value={manual.tsh} onChange={e => setManual({...manual, tsh: e.target.value})} type="number" step="0.1" className="w-full bg-muted p-2 text-sm rounded border border-border outline-none" />
                </div>
              </div>
            </div>
            
            <input value={manual.context} onChange={e => setManual({...manual, context: e.target.value})} placeholder="Optional NLP qualitative context (e.g. chronic anemia, bleeding)..." className="w-full bg-muted p-3 mb-4 rounded-lg border border-border outline-none focus:ring-1" />
            <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-2"><ActivitySquare className="w-5 h-5"/> Compute Diagnostic Risk Matrix</button>
          </form>
        )}

        {/* Loading Progress State */}
        {analyzeStep < 3 && analyzeStep > 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <ActivitySquare className="w-10 h-10 text-primary animate-spin mb-4" />
            <div className="font-bold text-lg text-primary animate-pulse mb-2">
              {analyzeStep === 1 ? 'Parsing unstructured telemetry OCR...' : 'Offloading to multi-model decision matrix...'}
            </div>
            {file && <div className="text-xs text-muted-foreground mb-4 font-mono">File: {file.name}</div>}
            <div className="w-full max-w-md bg-muted rounded-full h-2.5 overflow-hidden border border-border">
              <div className={`bg-primary h-full rounded-full transition-all duration-500 ${analyzeStep === 1 ? 'w-1/3' : 'w-2/3'}`} />
            </div>
          </div>
        )}

        {/* Completed Output Dashboard */}
        {analyzeStep === 3 && result && (
          <div className="w-full text-left flex flex-col gap-6">
            {/* Status Header Ribbon */}
            <div className={`w-full rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between border shadow-sm ${result.status === 'NORMAL' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : result.status === 'BORDERLINE' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
              <div>
                <div className="text-xl font-black uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  System Status: {result.status} {result.status === "NORMAL" ? <CheckCircle2 className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div className="text-xs font-bold opacity-90 flex flex-wrap gap-2">
                  {Array.isArray(result.conditions) ? (
                    result.conditions.map((c: string, i: number) => (
                      <span key={i} className="px-2.5 py-0.5 bg-background/50 rounded border border-border">{c}</span>
                    ))
                  ) : (
                    <span className="px-2.5 py-0.5 bg-background/50 rounded border border-border">{result.conditions}</span>
                  )}
                </div>
              </div>
              <div className="mt-4 md:mt-0 p-3 rounded-lg bg-background/30 border border-border/30 text-right w-full md:w-auto">
                <div className="text-sm font-bold flex items-center gap-1.5 justify-end"><UserCircle className="w-4 h-4 opacity-75"/> {ocrData?.patient_name || 'Unknown Patient'}</div>
                <div className="text-xs opacity-75 mt-0.5">AGE: {ocrData?.patient_age || '--'} YRS</div>
              </div>
            </div>

            {/* Grid for Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Graphic Chart */}
              <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-1.5"><ActivitySquare className="w-4 h-4"/> Telemetry Matrix (Excludes Isolated Platelet Count)</h3>
                
                <div className={`grid ${hasMultiplePanels ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-6 min-h-[220px]`}>
                  {cbcChart.length > 0 && (
                    <div className="h-[220px] border border-border/50 rounded-lg p-3 bg-muted/5 flex flex-col">
                      <span className="text-[10px] font-black uppercase text-emerald-500 mb-2 tracking-wider">CBC Blood Levels</span>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={cbcChart} margin={{top: 5, right: 0, left: -30, bottom: 0}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 10}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 10}} />
                          <Tooltip contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 11}} />
                          <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={30}>
                            {cbcChart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.value < (entry.optimal * 0.7) ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {lftChart.length > 0 && (
                    <div className="h-[220px] border border-border/50 rounded-lg p-3 bg-muted/5 flex flex-col">
                      <span className="text-[10px] font-black uppercase text-rose-500 mb-2 tracking-wider">Liver Panel</span>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={lftChart} margin={{top: 5, right: 0, left: -30, bottom: 0}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 10}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 10}} />
                          <Tooltip contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 11}} />
                          <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={30}>
                            {lftChart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.value > (entry.optimal * 1.5) ? "hsl(var(--destructive))" : "hsl(var(--emerald-500))"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {metaChart.length > 0 && (
                    <div className="h-[220px] border border-border/50 rounded-lg p-3 bg-muted/5 flex flex-col">
                      <span className="text-[10px] font-black uppercase text-blue-500 mb-2 tracking-wider">Kidney & Glucose</span>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={metaChart} margin={{top: 5, right: 0, left: -30, bottom: 0}}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 10}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: "hsl(var(--muted-foreground))", fontSize: 10}} />
                          <Tooltip contentStyle={{backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 11}} />
                          <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={30}>
                            {metaChart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill="hsl(var(--blue-500))" />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* Isolated Platelets & Details */}
              <div className="flex flex-col gap-3">
                {/* Platelet Isolated Card */}
                <div className={`p-4 border rounded-xl shadow-sm flex flex-col ${getVisualStatus(ocrData?.platelets, [150, 450])}`}>
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-80">Isolated Platelet Count</span>
                  <div className="font-black text-2xl mt-1">{ocrData?.platelets ? `${ocrData.platelets} K` : '0'}</div>
                  <span className="text-[10px] opacity-75 mt-1">Normal Range: 150 - 450 K/uL</span>
                </div>

                {ocrData?.hb && (
                  <div className={`p-3 border rounded-xl flex justify-between items-center ${getVisualStatus(ocrData?.hb, [12.0, 17.5])}`}>
                    <span className="text-xs font-bold">Hemoglobin:</span>
                    <span className="text-sm font-black">{ocrData.hb} g/dL</span>
                  </div>
                )}

                {ocrData?.creatinine && (
                  <div className={`p-3 border rounded-xl flex justify-between items-center ${getVisualStatus(ocrData?.creatinine, [0.6, 1.3])}`}>
                    <span className="text-xs font-bold">Creatinine:</span>
                    <span className="text-sm font-black">{ocrData.creatinine} mg/dL</span>
                  </div>
                )}

                {ocrData?.glucose && (
                  <div className={`p-3 border rounded-xl flex justify-between items-center ${getVisualStatus(ocrData?.glucose, [70, 100])}`}>
                    <span className="text-xs font-bold">Glucose:</span>
                    <span className="text-sm font-black">{ocrData.glucose} mg/dL</span>
                  </div>
                )}

                {/* Logistics Dispatch Form */}
                <div className="p-4 bg-muted/30 border border-border rounded-xl flex flex-col gap-3 mt-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Logistics Triage Dispatch</span>
                  
                  {logisticsSuccess ? (
                    <div className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 py-2">
                      <CheckCircle2 className="w-4 h-4" /> Requisition broadcasted successfully!
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-muted-foreground uppercase">Blood Group</label>
                          <select 
                            value={bloodGroupConfirm} 
                            onChange={(e) => setBloodGroupConfirm(e.target.value)} 
                            className="bg-background border border-border p-1.5 rounded text-xs font-bold outline-none focus:ring-1"
                          >
                            <option>O-</option>
                            <option>O+</option>
                            <option>A-</option>
                            <option>A+</option>
                            <option>B-</option>
                            <option>B+</option>
                            <option>AB-</option>
                            <option>AB+</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-muted-foreground uppercase">Units Req.</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={unitsReq}
                            onChange={(e) => setUnitsReq(e.target.value)}
                            className="bg-background border border-border p-1.5 rounded text-xs font-bold outline-none focus:ring-1"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleDispatchLogistics}
                        disabled={submittingLogistics}
                        className="w-full mt-1 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {submittingLogistics ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <ActivitySquare className="w-3.5 h-3.5"/>}
                        Dispatch Requisition
                      </button>
                    </>
                  )}
                </div>

                <button 
                  onClick={() => { 
                    setResult(null); 
                    setFile(null); 
                    setAnalyzeStep(0); 
                    setLogisticsSuccess(false);
                    setSubmittingLogistics(false);
                    setUnitsReq("1");
                  }} 
                  className="w-full mt-2 py-2.5 font-bold border border-border rounded-xl text-xs hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5"/> Analyze New Report
                </button>
              </div>
            </div>

            {/* AI Explanation Ribbon */}
            <div className="bg-muted/30 border border-border rounded-xl p-5 flex flex-col md:flex-row gap-5 items-center">
              <div className="flex-1 text-sm leading-relaxed">
                <h4 className="font-bold flex items-center gap-1.5 mb-2 text-foreground"><Bot className="w-4 h-4 text-primary"/> Clinical NLP Explanation</h4>
                <div className="font-medium text-muted-foreground">
                  <span className="font-bold text-primary mr-1">Synthesis:</span>
                  {result.reason}
                </div>
                {result.recommendation && (
                  <div className="mt-3 p-3 bg-card border border-border rounded-lg text-xs font-bold text-foreground">
                    Action Plan: {result.recommendation}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col items-center gap-2 bg-background border border-border rounded-lg p-3 w-full md:w-36 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">NLP Confidence</span>
                <span className="text-xl font-black text-primary">{(result.confidence * 100).toFixed(0)}%</span>
                <span className={`px-2 py-0.5 text-[9px] font-black rounded ${result.channel === 'RED' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>{result.channel} Triage</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
