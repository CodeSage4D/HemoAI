"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, ActivitySquare, AlertTriangle, Loader2 } from "lucide-react";
import { metricsApi } from "@/lib/api";

export default function DiagnosisPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | any>(null);
  const [error, setError] = useState("");
  
  const [hemo, setHemo] = useState("");
  const [diseaseType, setDiseaseType] = useState("Trauma/Accident");

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      // Hit actual Fast-API backend ML node
      const payload = {
        blood_type: "UNKNOWN", // Defaults for simple triage query
        disease_type: diseaseType.toUpperCase(),
        units_required: 1,
        hemoglobin_level: parseFloat(hemo)
      };
      const res = await metricsApi.submitRequest(payload);
      
      setResult({
        score: res.priority_score.toFixed(1),
        classification: res.urgency_channel,
        recommendation: res.urgency_channel === "RED" 
           ? "Immediate Transfusion Requested. Data logged to emergency dispatch." 
           : res.urgency_channel === "GREEN" 
           ? "Special Track Logged. Chronic condition prioritized." 
           : "Logged into queue. Status non-critical.",
      });
    } catch (err: any) {
      if (err.message?.includes("401")) {
         setError("Authentication Required: Please login to the Portal to submit live ML queries.");
      } else {
         setError(err.message || "Failed to route to Fast-API Prediction Engine.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen">
       <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Patient Intelligence Triage</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Test our internal ML-Triage algorithms directly against the Python API. Authentication is required to prevent data poisoning.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="bg-card border border-border shadow-md rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-primary" /> Input Parameters</h2>
          
          <AnimatePresence>
              {error && (
                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mb-6 text-sm font-bold text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                  {error}
                </motion.div>
              )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSimulate}>
             <div className="space-y-2">
                <label className="text-sm font-medium">Hemoglobin Level (g/dL)</label>
                <input required value={hemo} onChange={e => setHemo(e.target.value)} type="number" step="0.1" max="20" placeholder="e.g. 5.4" className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Disease Category</label>
                <select value={diseaseType} onChange={e => setDiseaseType(e.target.value)} className="w-full bg-muted px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Trauma/Accident</option>
                  <option>Surgery</option>
                  <option>Leukemia</option>
                  <option>Anemia</option>
                  <option>Routine</option>
                </select>
             </div>
             <button disabled={loading} className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex items-center justify-center disabled:opacity-50 transition-colors">
               {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2"/> Analyzing Engine...</> : "Calculate Live AI Priority Score"}
             </button>
          </form>
        </div>

        <div className="bg-muted/20 border border-border rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ActivitySquare className="w-5 h-5 text-primary" /> Prediction Output</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl bg-card">
            
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center text-primary">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                  <span className="font-semibold animate-pulse">Computing FastAPI Algorithms...</span>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-6 ${result.classification === 'RED' ? 'bg-destructive/10 text-destructive' : result.classification === 'GREEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    <AlertTriangle className="w-4 h-4" /> {result.classification}
                  </div>
                  <div className="text-6xl font-black mb-2 text-foreground">{result.score}</div>
                  <div className="text-muted-foreground font-medium mb-8">Generated Fast-API Priority</div>
                  <div className={`p-4 rounded-xl border text-sm font-bold ${result.classification === 'RED' ? 'bg-destructive/5 border-destructive/20 text-destructive' : result.classification === 'GREEN' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500'}`}>
                    {result.recommendation}
                  </div>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div key="empty" className="text-muted-foreground text-center">
                  Output will be directly synchronized with your active institutional database instance.
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
