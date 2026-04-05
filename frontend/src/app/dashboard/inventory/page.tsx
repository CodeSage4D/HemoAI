"use client";

import { Droplet, Plus, Filter } from "lucide-react";

export default function InventoryPage() {
  const mockInventory = [
    { type: "O- Negative", units: 142, status: "Critical", expiry: "2 Days" },
    { type: "A+ Positive", units: 890, status: "Stable", expiry: "14 Days" },
    { type: "AB+ Positive", units: 54, status: "Low", expiry: "5 Days" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2"><Droplet className="w-8 h-8 text-primary" /> Inventory Management</h1>
            <p className="text-muted-foreground text-sm">Real-time local tracking of physically available blood reserves.</p>
         </div>
         <div className="flex gap-4">
            <button className="px-4 py-2 border border-border bg-card font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-muted transition-colors">
               <Filter className="w-4 h-4"/> Filter Types
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-primary/90 transition-colors">
               <Plus className="w-4 h-4"/> Register Blood Batch
            </button>
         </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
         <div className="grid grid-cols-4 p-4 border-b border-border font-bold text-sm text-muted-foreground bg-muted/30">
            <div>Blood Profile</div>
            <div>Tracked Units</div>
            <div>Supply Status</div>
            <div>Earliest Expiration</div>
         </div>
         {mockInventory.map((inv, idx) => (
           <div key={idx} className="grid grid-cols-4 p-4 border-b border-border/50 hover:bg-muted/20 transition-colors items-center text-sm font-medium">
              <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${inv.status === 'Critical' ? 'bg-destructive' : inv.status === 'Low' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                 {inv.type}
              </div>
              <div>{inv.units} Units</div>
              <div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                   inv.status === 'Critical' ? 'bg-transparent border border-destructive text-destructive' : 
                   inv.status === 'Low' ? 'bg-transparent border border-yellow-500 text-yellow-500' : 
                   'bg-transparent border border-emerald-500 text-emerald-500'
                 }`}>
                   {inv.status}
                 </span>
              </div>
              <div className="opacity-80">{inv.expiry}</div>
           </div>
         ))}
      </div>
    </div>
  );
}
