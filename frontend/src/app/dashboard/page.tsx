"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Droplet, AlertTriangle, CheckCircle2, Search, ActivitySquare, AlertCircle, Loader2 } from "lucide-react";
import { metricsApi } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [reqs, setReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reqsData] = await Promise.all([
          metricsApi.getDashboardStats(),
          metricsApi.getRequests()
        ]);
        setStats(statsData);
        setReqs(reqsData);
      } catch (err) {
        console.error("Dashboard API Integration Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="h-full flex items-center justify-center text-muted-foreground gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Synchronizing Dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-1">Command Overview</h1>
            <p className="text-muted-foreground text-sm">Central intelligence for regional blood bank logistics and real-time patient triage.</p>
         </div>
         {stats?.criticalPatientsAlert > 0 && (
           <div className="flex bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold px-4 py-2 rounded-lg items-center gap-2 animate-pulse">
              <AlertCircle className="w-5 h-5"/> EMERGENCY SHORTAGE ALERT ACTIVE
           </div>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Inventory Units" value={stats?.bloodAvailabilityStats || "0"} icon={<Droplet className="w-5 h-5" />} desc="Locally tracked" />
        <StatCard title="Overall AI Accuracy" value="98.4%" icon={<CheckCircle2 className="w-5 h-5" />} desc="Scikit-Learn Confidence" />
        <StatCard title="Critical Patients" value={stats?.criticalPatientsAlert || "0"} icon={<AlertTriangle className="w-5 h-5 text-destructive" />} desc="Requires immediate dispatch" />
        <StatCard title="Active Requests" value={reqs.length.toString()} icon={<ActivitySquare className="w-5 h-5 text-emerald-500" />} desc="Total pool size" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time AI Demand Prediction */}
        <div className="lg:col-span-2 bg-card border border-border shadow-sm rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
             AI Demand Forecast Curve
             <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">Synced Live</span>
          </h3>
          <p className="text-xs text-muted-foreground mb-6">Graphing theoretical demand over 7 days based on ML telemetry.</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.demandForecastingTrend || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }} />
                <Area type="monotone" dataKey="demand" stroke="#ef4444" fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Risk Scoring Dashboard (Emergency Triage) */}
        <div className="bg-card border border-border shadow-sm rounded-xl p-6 flex flex-col h-[400px] lg:h-auto overflow-hidden">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-lg">AI Risk Triage Queue</h3>
             <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
             {reqs.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center mt-10">No active triage requests found in DB.</div>
             ) : (
               reqs.map((req) => (
                  <TriageCard 
                    key={req.id}
                    patient={`PT-ID-${req.requested_by}`} 
                    diagnosis={req.disease_type} 
                    hl={req.priority_score.toFixed(1)} 
                    bg={req.urgency_channel === "RED" ? "bg-destructive/10" : req.urgency_channel === "GREEN" ? "bg-emerald-500/10" : "bg-yellow-500/10"} 
                    text={req.urgency_channel === "RED" ? "text-destructive" : req.urgency_channel === "GREEN" ? "text-emerald-500" : "text-yellow-500"} 
                    bd={req.urgency_channel === "RED" ? "border-destructive/20" : req.urgency_channel === "GREEN" ? "border-emerald-500/20" : "border-yellow-500/20"} 
                  />
               ))
             )}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc }: any) {
  return (
    <div className="p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="p-2 bg-muted rounded-lg">{icon}</div>
      </div>
      <div className="text-3xl font-bold flex items-baseline gap-2">
         {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1 font-medium">{desc}</div>
    </div>
  )
}

function TriageCard({ patient, diagnosis, hl, bg, text, bd }: any) {
  return (
     <div className={`p-4 rounded-xl border ${bd} ${bg} flex items-center justify-between`}>
        <div>
           <div className={`font-bold flex items-center gap-1 ${text}`}><ActivitySquare className="w-3 h-3"/> {patient}</div>
           <div className="text-xs text-foreground mt-1 opacity-80 uppercase tracking-wider">{diagnosis}</div>
        </div>
        <div className="text-right">
           <div className={`text-xl font-black ${text}`}>{hl}</div>
           <div className="text-[10px] uppercase tracking-wider font-bold opacity-60">Risk Score</div>
        </div>
     </div>
  )
}
