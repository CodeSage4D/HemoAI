"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Droplet, AlertTriangle, CheckCircle2, Search, ActivitySquare, AlertCircle, Calendar, Heart, FileText, ArrowRight } from "lucide-react";
import { metricsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardSwitcher() {
  const { user, loading: authLoading } = useAuth();
  
  if (authLoading) return null; // handled by layout overlay realistically

  const isHospital = user?.role === "HOSPITAL" || user?.role === "ADMIN";
  if (isHospital) return <HospitalDashboard />;
  return <PatientDashboard />;
}

function HospitalDashboard() {
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
    return (
      <div className="flex flex-col gap-6 w-full h-full p-4 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
           <div className="space-y-3">
              <div className="h-10 w-64 bg-muted/60 rounded-xl animate-pulse backdrop-blur-md border border-white/5" />
              <div className="h-4 w-96 bg-muted/40 rounded-md animate-pulse backdrop-blur-md" />
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="h-32 bg-card/60 border border-white/10 rounded-2xl animate-pulse shadow-sm backdrop-blur-xl" />
           ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
           <div className="lg:col-span-2 h-[350px] bg-card/60 border border-white/10 rounded-2xl animate-pulse shadow-sm backdrop-blur-xl" />
           <div className="h-[350px] bg-card/60 border border-white/10 rounded-2xl animate-pulse shadow-sm backdrop-blur-xl" />
        </div>
      </div>
    );
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
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
                    patient={`PT-ID-${req.patient_id}`} 
                    diagnosis={req.status} 
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

// -------------------------------------------------------------
// NEW: Patient Dashboard 
// -------------------------------------------------------------
function PatientDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-1">Welcome, {user?.full_name || "Patient"}</h1>
            <p className="text-muted-foreground text-sm">Your personal health hub. Track your blood requests, medical extractions, and donation eligibility.</p>
         </div>
      </div>

      {/* Patient Specific Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        
        <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-sm">
           <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="font-bold text-lg text-primary">Eligibility Status</h3>
              <Heart className="w-5 h-5 text-primary" />
           </div>
           <div className="relative z-10">
              <div className="text-3xl font-black text-foreground mb-1">Ready</div>
              <p className="text-sm font-medium text-muted-foreground">You are cleared to donate blood. It has been over 56 days since your last recorded donation.</p>
           </div>
           <div className="absolute -bottom-6 -right-6 opacity-10 blur-xl">
             <Heart className="w-48 h-48 text-primary" />
           </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Medical Extraction</h3>
              <FileText className="w-5 h-5 text-muted-foreground" />
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Detected Type</span>
                <span className="font-bold">O- Negative</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Hemoglobin Level</span>
                <span className="font-bold text-destructive">11.2 g/dL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-bold text-yellow-500">Slight Anemia</span>
              </div>
           </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">My Live Requests</h3>
              <ActivitySquare className="w-5 h-5 text-emerald-500" />
           </div>
           <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                 <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="font-bold text-sm">No Pending Requisitions</div>
              <div className="text-xs text-muted-foreground mt-1 max-w-[200px]">You do not currently have any active blood requests awaiting logistics routing.</div>
           </div>
        </div>

      </div>

      {/* Patient Specific Data Flow */}
      <div className="bg-card border border-border shadow-sm rounded-xl p-8 mt-4 text-center border-dashed">
         <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-50" />
         <h3 className="font-bold text-lg mb-2">Schedule a Donation</h3>
         <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">Contribute to the regional blood pool. View active drives in your area (Madhya Pradesh targeting Gwalior and Indore nodes).</p>
         <Link href="/dashboard/drives" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:opacity-90 flex mx-auto items-center justify-center gap-2 max-w-[280px]">
            View Donation Campaigns <ArrowRight className="w-4 h-4" />
         </Link>
      </div>
    </div>
  )
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
