"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Droplet, AlertTriangle, CheckCircle2, Search, ActivitySquare, AlertCircle } from "lucide-react";

// Mock Data for Forecast
const data = [
  { name: "Mon", stock: 4000, demand: 2400 },
  { name: "Tue", stock: 3000, demand: 1398 },
  { name: "Wed", stock: 2000, demand: 9800 },
  { name: "Thu", stock: 2780, demand: 3908 },
  { name: "Fri", stock: 1890, demand: 4800 },
  { name: "Sat", stock: 2390, demand: 3800 },
  { name: "Sun", stock: 3490, demand: 4300 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-1">Command Overview</h1>
            <p className="text-muted-foreground text-sm">Central intelligence for regional blood bank logistics and real-time patient triage.</p>
         </div>
         <div className="flex bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold px-4 py-2 rounded-lg items-center gap-2 animate-pulse">
            <AlertCircle className="w-5 h-5"/> EMERGENCY SHORTAGE ALERT: O- NEGATIVE
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Inventory" value="23,492" icon={<Droplet className="w-5 h-5" />} desc="+4% from last week" />
        <StatCard title="Dispatch Accuracy" value="99.2%" icon={<CheckCircle2 className="w-5 h-5" />} desc="Based on ML prediction" />
        <StatCard title="Critical Shortages" value="O-" icon={<AlertTriangle className="w-5 h-5 text-destructive" />} desc="Under 12% capacity target" />
        <StatCard title="Active Requests" value="142" icon={<ActivitySquare className="w-5 h-5 text-emerald-500" />} desc="4 critical pending" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time AI Demand Prediction */}
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="lg:col-span-2 bg-card border border-border shadow-sm rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
             AI Demand Forecast & Shortage Alert Matrix
             <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">Scikit-Learn Active</span>
          </h3>
          <p className="text-xs text-muted-foreground mb-6">Graphing theoretical depletion over 7 days based on upcoming scheduled surgeries and historic emergency frequency.</p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }} />
                <Area type="monotone" dataKey="stock" stroke="#10b981" fillOpacity={1} fill="url(#colorStock)" />
                <Area type="monotone" dataKey="demand" stroke="#ef4444" fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Patient Risk Scoring Dashboard (Emergency Triage) */}
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay: 0.1}} className="bg-card border border-border shadow-sm rounded-xl p-6 flex flex-col h-[400px] lg:h-auto overflow-hidden">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-lg">AI Risk Triage Queue</h3>
             <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
             <TriageCard patient="PT-99A" diagnosis="MVA Trauma" hl="5.2" bg="bg-destructive/10" text="text-destructive" bd="border-destructive/20" />
             <TriageCard patient="PT-12X" diagnosis="Leukemia" hl="6.8" bg="bg-orange-500/10" text="text-orange-500" bd="border-orange-500/20" />
             <TriageCard patient="PT-88C" diagnosis="Surgical Bleed" hl="7.1" bg="bg-yellow-500/10" text="text-yellow-600 dark:text-yellow-400" bd="border-yellow-500/20" />
             <TriageCard patient="PT-21L" diagnosis="Routine Anemia" hl="9.4" bg="bg-emerald-500/10" text="text-emerald-500" bd="border-emerald-500/20" />
             <TriageCard patient="PT-45Q" diagnosis="Observation" hl="10.2" bg="bg-muted" text="text-muted-foreground" bd="border-border" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc }: any) {
  return (
    <motion.div whileHover={{y: -5}} className="p-4 bg-card border border-border rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="p-2 bg-muted rounded-lg">{icon}</div>
      </div>
      <div className="text-3xl font-bold flex items-baseline gap-2">
         {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1 font-medium">{desc}</div>
    </motion.div>
  )
}

function TriageCard({ patient, diagnosis, hl, bg, text, bd }: any) {
  return (
     <div className={`p-4 rounded-xl border ${bd} ${bg} flex items-center justify-between`}>
        <div>
           <div className={`font-bold flex items-center gap-1 ${text}`}><ActivitySquare className="w-3 h-3"/> {patient}</div>
           <div className="text-xs text-foreground mt-1 opacity-80">{diagnosis}</div>
        </div>
        <div className="text-right">
           <div className={`text-xl font-black ${text}`}>{hl}</div>
           <div className="text-[10px] uppercase tracking-wider font-bold opacity-60">Hgb Score</div>
        </div>
     </div>
  )
}
