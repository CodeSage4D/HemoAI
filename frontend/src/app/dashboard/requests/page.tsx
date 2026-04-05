"use client";

import { ActivitySquare, RefreshCw, X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RequestsPage() {
  const { user } = useAuth();
  const isHospital = user?.role === "HOSPITAL" || user?.role === "ADMIN";

  const demands = [
    { id: "REQ-901", patient: "PT-04", required: "O-", status: "PENDING", urgency: "RED" },
    { id: "REQ-902", patient: "PT-19", required: "A+", status: "FULFILLED", urgency: "GREEN" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2"><ActivitySquare className="w-8 h-8 text-primary" /> {isHospital ? "System Requisitions" : "My Blood Requests"}</h1>
            <p className="text-muted-foreground text-sm">
               {isHospital ? "Logistical routing requests broadcasted across local network." : "Track the status of your current or historical blood requests."}
            </p>
         </div>
         <button className="px-4 py-2 border border-border bg-card font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-muted transition-colors">
            <RefreshCw className="w-4 h-4"/> Sync Live
         </button>
      </div>

      <div className="grid gap-4 mt-4">
        {demands.map((d, i) => (
           <div key={i} className="p-6 bg-card border border-border rounded-2xl shadow-sm flex items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                 <div className={`p-4 rounded-xl ${d.urgency === 'RED' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <ActivitySquare className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg">{d.id}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Beneficiary: <span className="font-medium text-foreground">{d.patient}</span> | Requested Profile: <span className="font-medium text-foreground">{d.required}</span></p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${d.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {d.status}
                 </span>
                 {isHospital && d.status === 'PENDING' && (
                    <div className="flex gap-2">
                       <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors hover:border-emerald-500"><Check className="w-5 h-5"/></button>
                       <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-destructive hover:text-white transition-colors hover:border-destructive"><X className="w-5 h-5"/></button>
                    </div>
                 )}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
