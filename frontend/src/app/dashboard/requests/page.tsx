"use client";

import { useEffect, useState } from "react";
import { ActivitySquare, RefreshCw, X, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { metricsApi } from "@/lib/api";

interface RequestItem {
  id: string;
  patientId: string;
  unitsRequired: number;
  urgencyChannel: "RED" | "YELLOW" | "GREEN";
  priorityScore: number;
  status: string;
  createdAt: string;
  patient: {
    name: string;
    bloodGroup: string;
  };
}

export default function RequestsPage() {
  const { user } = useAuth();
  const isHospital = user?.role === "HOSPITAL" || user?.role === "ADMIN";

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metricsApi.getRequests();
      setRequests(data);
    } catch (err: any) {
      console.error("Failed to load requests:", err);
      setError(err.message || "Unable to retrieve priority blood requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await metricsApi.updateRequestStatus(id, status);
      await fetchRequests();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError(err.message || "Unable to update request status.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <ActivitySquare className="w-8 h-8 text-primary" /> 
              {isHospital ? "System Requisitions" : "My Blood Requests"}
            </h1>
            <p className="text-muted-foreground text-sm">
               {isHospital ? "Logistical routing requests broadcasted across local network." : "Track the status of your current or historical blood requests."}
            </p>
         </div>
         <button 
           onClick={fetchRequests}
           disabled={loading}
           className="px-4 py-2 border border-border bg-card font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
         >
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>} Sync Live
         </button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm font-semibold text-muted-foreground">Loading active requests...</span>
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
          <ActivitySquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-1">No Active Requisitions</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are currently no priority blood routing requests in the queue.
          </p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="grid gap-4 mt-4">
          {requests.map((d) => (
             <div key={d.id} className="p-6 bg-card border border-border rounded-2xl shadow-sm flex items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                   <div className={`p-4 rounded-xl ${d.urgencyChannel === 'RED' ? 'bg-destructive/10 text-destructive' : d.urgencyChannel === 'YELLOW' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      <ActivitySquare className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg">REQ-{d.id.substring(0, 8).toUpperCase()}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Patient: <span className="font-medium text-foreground">{d.patient?.name || "Unknown"}</span> | 
                        Group: <span className="font-medium text-foreground">{d.patient?.bloodGroup || "Unknown"}</span> | 
                        Required: <span className="font-medium text-primary">{d.unitsRequired} Units</span>
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-xs font-bold px-3 py-1 bg-muted border border-border rounded-lg">
                     Score: {d.priorityScore.toFixed(1)}
                   </span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      d.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                      d.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-500' :
                      d.status === 'CANCELLED' ? 'bg-destructive/20 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }`}>
                       {d.status}
                    </span>
                    {isHospital && d.status === 'PENDING' && (
                       <div className="flex gap-2">
                          <button 
                            disabled={updatingId !== null}
                            onClick={() => handleUpdateStatus(d.id, 'APPROVED')}
                            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors hover:border-emerald-500 disabled:opacity-50"
                          >
                            {updatingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5"/>}
                          </button>
                          <button 
                            disabled={updatingId !== null}
                            onClick={() => handleUpdateStatus(d.id, 'CANCELLED')}
                            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-destructive hover:text-white transition-colors hover:border-destructive disabled:opacity-50"
                          >
                            {updatingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5"/>}
                          </button>
                       </div>
                    )}
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

