"use client";

import { motion } from "framer-motion";
import { Droplet, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const demandData = [
  { name: 'Mon', A: 4000, B: 2400 },
  { name: 'Tue', A: 3000, B: 1398 },
  { name: 'Wed', A: 2000, B: 9800 },
  { name: 'Thu', A: 2780, B: 3908 },
  { name: 'Fri', A: 1890, B: 4800 },
  { name: 'Sat', A: 2390, B: 3800 },
  { name: 'Sun', A: 3490, B: 4300 },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8 min-h-[calc(100vh-120px)]">
      
      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Blood Units" 
          value="1,248" 
          change="+12% from last week" 
          icon={<Droplet className="w-5 h-5 text-primary" />} 
          trend="up"
          delay={0}
        />
        <StatCard 
          title="Critical Requests" 
          value="24" 
          change="AI identified 4 high-risk" 
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />} 
          trend="up"
          delay={0.1}
        />
        <StatCard 
          title="Active Donors" 
          value="892" 
          change="+34 new this week" 
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} 
          trend="up"
          delay={0.2}
        />
        <StatCard 
          title="System Accuracy" 
          value="98.4%" 
          change="ML Prediction Rate" 
          icon={<TrendingUp className="w-5 h-5 text-blue-500" />} 
          trend="up"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Demand Forecasting</h3>
              <p className="text-sm text-muted-foreground">AI predicted blood requirement vs actuals for O- and A+</p>
            </div>
            <select className="bg-muted px-3 py-1.5 rounded-lg text-sm border-none outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)'}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Area type="monotone" dataKey="A" stroke="oklch(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorA)" />
                <Area type="monotone" dataKey="B" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Patient Queue */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.5 }}
           className="bg-card rounded-2xl border border-border p-6 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              Critical AI Triage
            </h3>
            <p className="text-sm text-muted-foreground">Patients prioritized by ML severity score.</p>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            
            <TriageItem name="John Doe" group="O-" hb="4.2" priority="98%" disease="Trauma/Accident" isCritical />
            <TriageItem name="Sarah Smith" group="A+" hb="6.1" priority="87%" disease="Surgery" isCritical />
            <TriageItem name="Mike Johnson" group="B-" hb="8.4" priority="62%" disease="Anemia" />
            <TriageItem name="Emma Davis" group="AB+" hb="9.2" priority="41%" disease="Routine" />
            
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, trend, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-muted-foreground text-sm font-medium">{title}</h4>
        <div className="p-2 bg-muted rounded-xl">{icon}</div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-1">{value}</h2>
        <p className={`text-xs ${trend === 'up' ? "text-emerald-500" : "text-destructive"}`}>
          {change}
        </p>
      </div>
    </motion.div>
  )
}

function TriageItem({ name, group, hb, priority, disease, isCritical = false }: any) {
  return (
    <div className={`p-4 rounded-xl border ${isCritical ? "bg-destructive/5 border-destructive/20" : "bg-muted/50 border-transparent"} transition-colors hover:bg-muted`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{name}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCritical ? "bg-destructive text-destructive-foreground" : "bg-primary/20 text-primary"}`}>
          Score {priority}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Group: <strong className="text-foreground">{group}</strong></span>
        <span>Hb: <strong className={isCritical ? "text-destructive font-bold" : "text-foreground"}>{hb} g/dL</strong></span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Condition: {disease}
      </div>
    </div>
  )
}
