"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileScan, UploadCloud, FileText, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalyzing(true);
      setResults(null);

      // Simulate OCR NLP API Latency
      setTimeout(() => {
        setAnalyzing(false);
        setResults({
          patientId: "PT-94921-A",
          bloodType: "A Negative (A-)",
          hemoglobin: "7.1 g/dL",
          wbc: "11,500 /mcL",
          platelets: "140,000 /mcL",
          criticalRisk: true,
          recommendation: "Immediate transfusion required due to severe anemia thresholds."
        });
      }, 3500);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><FileScan className="w-6 h-6 text-primary" /> Med Analyzer OCR</h2>
        <p className="text-muted-foreground text-sm max-w-3xl mt-2">
          Upload unstructured medical PDFs or raw lab results. Our internal NLP extraction engine will parse the raw physical distress markers automatically to preemptively score trauma risks.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 flex-1">
        
        {/* Upload Zone */}
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {!file ? (
            <label className="w-full h-full min-h-[300px] border-2 border-dashed border-primary/50 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-colors rounded-xl flex flex-col items-center justify-center cursor-pointer p-6 text-center">
              <UploadCloud className="w-12 h-12 text-primary mb-4" />
              <div className="font-bold text-lg mb-1">Drag & Drop Medical Report</div>
              <div className="text-sm text-muted-foreground mb-4">Supports .pdf, .png, .jpg (Max 15MB)</div>
              <div className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">Browse Files</div>
              <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleUpload} />
            </label>
          ) : (
            <div className="w-full flex flex-col items-center justify-center">
              <FileText className="w-16 h-16 text-primary mb-4" />
              <div className="font-bold text-lg">{file.name}</div>
              <div className="text-sm text-muted-foreground mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              
              <button 
                onClick={() => { setFile(null); setResults(null); }} 
                className="text-xs font-medium text-destructive hover:underline"
              >
                Remove & Upload New
              </button>
            </div>
          )}
        </div>

        {/* Output Zone */}
        <div className="bg-card border border-border shadow-md rounded-2xl p-8 relative flex flex-col">
          <h3 className="font-bold text-lg mb-6 border-b border-border pb-4 w-full">AI Extraction Output</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <AnimatePresence mode="wait">
              {!file && (
                <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-muted-foreground text-sm text-center">
                  Output will appear here after document ingestion.
                </motion.div>
              )}

              {analyzing && (
                <motion.div key="analyzing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center w-full max-w-sm">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
                     <motion.div 
                       initial={{ width: "0%" }}
                       animate={{ width: "100%" }}
                       transition={{ duration: 3.5, ease: "linear" }}
                       className="h-full bg-primary"
                     />
                  </div>
                  <div className="text-sm font-bold text-primary animate-pulse w-full text-center mb-8">Parsing Medical Jargon...</div>
                  
                  {/* Skeleton loaders */}
                  <div className="w-full space-y-3">
                     <div className="h-8 bg-muted rounded animate-pulse w-full" />
                     <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                     <div className="h-8 bg-muted rounded animate-pulse w-5/6" />
                  </div>
                </motion.div>
              )}

              {results && !analyzing && (
                <motion.div key="results" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="w-full space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      
                      <div className="bg-muted px-4 py-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Patient ID</div>
                        <div className="font-mono font-bold text-sm text-foreground">{results.patientId}</div>
                      </div>

                      <div className="bg-muted px-4 py-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Detected Blood Type</div>
                        <div className="font-bold text-sm text-primary flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {results.bloodType}</div>
                      </div>

                      <div className="bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20 col-span-2 flex items-center justify-between">
                        <div>
                           <div className="text-xs text-destructive font-bold mb-1">Hemoglobin (CRITICAL OUTLIER)</div>
                           <div className="font-bold text-lg text-destructive">{results.hemoglobin}</div>
                        </div>
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                      </div>

                      <div className="bg-muted px-4 py-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">WBC Count</div>
                        <div className="font-mono font-bold text-sm text-foreground">{results.wbc}</div>
                      </div>

                      <div className="bg-muted px-4 py-3 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Platelet Count</div>
                        <div className="font-mono font-bold text-sm text-foreground">{results.platelets}</div>
                      </div>

                   </div>

                   <div className="mt-6 p-4 rounded-xl bg-primary text-primary-foreground">
                      <div className="font-bold text-sm mb-1 text-primary-foreground/80">AI NLP Synthesis:</div>
                      <div className="font-medium text-sm leading-relaxed">{results.recommendation}</div>
                   </div>

                   <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-border shadow-sm rounded-xl font-bold text-sm hover:bg-muted transition-colors">
                     Submit to Prediction Engine <ArrowRight className="w-4 h-4" />
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
