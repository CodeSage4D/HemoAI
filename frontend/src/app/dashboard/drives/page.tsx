"use client";

import { motion } from "framer-motion";
import { HeartHandshake, MapPin, Users, Calendar, Megaphone, CheckCircle } from "lucide-react";

const drives = [
  { id: 1, name: "Silicon Valley Tech Drive", location: "San Jose Convention Center", target: 500, current: 312, date: "Oct 15, 2026", status: "Active", urgency: "High" },
  { id: 2, name: "Community College Outreach", location: "De Anza Main Campus", target: 200, current: 45, date: "Oct 18, 2026", status: "Upcoming", urgency: "Normal" },
  { id: 3, name: "City Hall Emergency Restock", location: "Civic Center Plaza", target: 1000, current: 890, date: "Completed", status: "Completed", urgency: "Low" }
];

export default function DrivesPage() {
  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><HeartHandshake className="w-6 h-6 text-primary" /> Community Donation Drives</h2>
          <p className="text-muted-foreground text-sm max-w-3xl mt-2">
            Manage regional blood drives and trigger AI-generated Smart Notifications to local high-probability donors.
          </p>
        </div>
        <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
           <Megaphone className="w-5 h-5"/> New Campaign
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Live Campaigns */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-lg mb-4">Active & Upcoming Campaigns</h3>
            {drives.map((d, i) => (
               <motion.div 
                 key={d.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
               >
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg">{d.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                           d.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 
                           d.status === 'Completed' ? 'bg-muted text-muted-foreground' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                           {d.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {d.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {d.date}</span>
                     </div>
                     
                     {/* Progress Bar */}
                     <div className="w-full">
                        <div className="flex justify-between text-xs font-medium mb-1">
                           <span>{d.current} Donors</span>
                           <span>Target: {d.target} Donors</span>
                        </div>
                        <div className="w-full h-2 rounded-full border border-border/50 bg-muted overflow-hidden">
                           <div 
                             className={`h-full ${d.status === 'Completed' ? 'bg-muted-foreground' : 'bg-primary'}`} 
                             style={{ width: `${Math.min((d.current / d.target) * 100, 100)}%` }} 
                           />
                        </div>
                     </div>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2">
                     <button disabled={d.status === 'Completed'} className="w-full px-4 py-2 border border-border rounded-lg text-sm font-bold bg-background shadow-sm hover:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" /> Manage Roster
                     </button>
                     <button disabled={d.status === 'Completed'} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        Broadcast SMS <ArrowRight className="w-4 h-4 -mr-1" />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>

         {/* Smart Notification AI Sidebar */}
         <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 h-max sticky top-6">
            <h3 className="font-bold text-lg mb-2 text-primary flex items-center gap-2">
               <Megaphone className="w-5 h-5"/> Smart AI Dispatch
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
               Hemo-Sync continuously scans local telemetry to identify users who are legally eligible to donate (56+ days post-donation).
            </p>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-4">
               <div className="font-bold text-sm mb-1">O-Negative Critical Pool</div>
               <div className="text-3xl font-black text-destructive mb-1">1,402</div>
               <p className="text-xs text-muted-foreground">Eligible local donors detected.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-8">
               <div className="font-bold text-sm mb-1">A-Positive Standard Pool</div>
               <div className="text-3xl font-black text-foreground mb-1">8,990</div>
               <p className="text-xs text-muted-foreground">Eligible local donors detected.</p>
            </div>

            <button className="w-full py-4 bg-foreground text-background font-bold rounded-xl shadow-lg hover:opacity-90 flex justify-center items-center gap-2">
               Trigger Area Notification <CheckCircle className="w-4 h-4"/>
            </button>
            <p className="text-xs text-center text-muted-foreground mt-3 italic">
               Will send localized SMS/Push to 10,392 users.
            </p>
         </div>
      </div>
    </div>
  );
}

// Ensure proper rendering of icons
import { ArrowRight } from "lucide-react";
