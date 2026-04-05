"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Navigation, Truck } from "lucide-react";

// Native Leaflet relies on the window object entirely, so Next.js SSR must be disabled for this specific chunk.
const DynamicClientMap = dynamic(() => import("./DynamicMap"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full bg-muted/50 rounded-2xl flex items-center justify-center animate-pulse text-muted-foreground">Initializing Geographic Triage Engine...</div> 
});

export default function LiveRadarPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><MapPin className="w-6 h-6 text-primary" /> Live Inventory Radar</h2>
          <p className="text-muted-foreground text-sm">Real-time geospatial tracking of institutional blood reserves and trauma centers.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/80 transition-colors flex items-center gap-2">
             <Navigation className="w-4 h-4" /> Recenter
           </button>
           <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2">
             <Truck className="w-4 h-4" /> Dispatch Drone
           </button>
        </div>
      </div>

      <div className="flex-1 min-h-[500px]">
         <DynamicClientMap />
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-card p-4 rounded-xl border border-border shadow-sm">
             <h4 className="font-bold text-sm mb-1 text-emerald-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Stable Sectors</h4>
             <p className="text-2xl font-black">4</p>
             <p className="text-xs text-muted-foreground mt-1">Hospitals reporting &gt; 90% target inventory.</p>
          </motion.div>
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="bg-card p-4 rounded-xl border border-border shadow-sm">
             <h4 className="font-bold text-sm mb-1 text-destructive flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-destructive animate-ping" /> Critical Zones</h4>
             <p className="text-2xl font-black">1</p>
             <p className="text-xs text-muted-foreground mt-1">Mass casualty event logged near AB Road.</p>
          </motion.div>
           <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.2}} className="bg-card p-4 rounded-xl border border-border shadow-sm">
             <h4 className="font-bold text-sm mb-1 text-primary flex items-center gap-2"><Truck className="w-4 h-4" /> Active Dispatches</h4>
             <p className="text-2xl font-black">14</p>
             <p className="text-xs text-muted-foreground mt-1">Autonomous logistical delivery units en route.</p>
          </motion.div>
       </div>
    </div>
  );
}
