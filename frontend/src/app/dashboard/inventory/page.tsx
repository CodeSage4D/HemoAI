"use client";

import { useEffect, useState } from "react";
import { Droplet, Plus, Loader2, RefreshCw } from "lucide-react";
import { metricsApi } from "@/lib/api";

interface InventoryItem {
  id: string;
  bloodBankId: string;
  bloodGroup: string;
  units: number;
  expiryDate: string;
  bloodBank: {
    name: string;
  };
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metricsApi.getInventory();
      setInventory(data);
    } catch (err: any) {
      console.error("Failed to load inventory:", err);
      setError(err.message || "Unable to retrieve real-time inventory reserves.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStatus = (units: number) => {
    if (units < 10) return "Critical";
    if (units < 30) return "Low";
    return "Stable";
  };

  const getExpiryDays = (expiryDateStr: string) => {
    const timeDiff = new Date(expiryDateStr).getTime() - new Date().getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days <= 0 ? "Expired" : `${days} Days`;
  };

  const formatBloodGroup = (bg: string) => {
    return bg.replace('_POS', '+').replace('_NEG', '-');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2"><Droplet className="w-8 h-8 text-primary" /> Inventory Management</h1>
            <p className="text-muted-foreground text-sm">Real-time local tracking of physically available blood reserves.</p>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={fetchInventory}
              disabled={loading}
              className="px-4 py-2 border border-border bg-card font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
            >
               {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>} Sync Live
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-primary/90 transition-colors">
               <Plus className="w-4 h-4"/> Register Blood Batch
            </button>
         </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm font-semibold text-muted-foreground">Loading blood reserves...</span>
        </div>
      ) : inventory.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
          <Droplet className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-1">No Inventory Tracked</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            There are currently no blood reserves registered in your district's system.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
           <div className="grid grid-cols-5 p-4 border-b border-border font-bold text-sm text-muted-foreground bg-muted/30">
              <div>Blood Group</div>
              <div>Bank Location</div>
              <div>Tracked Units</div>
              <div>Supply Status</div>
              <div>Earliest Expiration</div>
           </div>
           {inventory.map((inv, idx) => {
             const status = getStatus(inv.units);
             return (
               <div key={idx} className="grid grid-cols-5 p-4 border-b border-border/50 hover:bg-muted/20 transition-colors items-center text-sm font-medium">
                  <div className="flex items-center gap-2 font-bold">
                     <div className={`w-3 h-3 rounded-full ${status === 'Critical' ? 'bg-destructive' : status === 'Low' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                     {formatBloodGroup(inv.bloodGroup)}
                  </div>
                  <div className="text-muted-foreground font-semibold">{inv.bloodBank?.name || "Unknown Hub"}</div>
                  <div>{inv.units} Units</div>
                  <div>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                       status === 'Critical' ? 'bg-transparent border border-destructive text-destructive' : 
                       status === 'Low' ? 'bg-transparent border border-yellow-500 text-yellow-500' : 
                       'bg-transparent border border-emerald-500 text-emerald-500'
                     }`}>
                       {status}
                     </span>
                  </div>
                  <div className="opacity-80 font-semibold">{getExpiryDays(inv.expiryDate)}</div>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
}
