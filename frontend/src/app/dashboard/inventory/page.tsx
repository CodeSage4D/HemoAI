"use client";

import { useEffect, useState } from "react";
import { Droplet, Plus, Loader2, RefreshCw, TrendingDown, TrendingUp, Minus } from "lucide-react";
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

  useEffect(() => { fetchInventory(); }, []);

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

  const formatBloodGroup = (bg: string) =>
    bg.replace("_POS", "+").replace("_NEG", "-");

  const statusColor = (status: string) => {
    if (status === "Critical") return "bg-destructive/10 text-destructive border-destructive/30";
    if (status === "Low") return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
  };

  const dotColor = (status: string) => {
    if (status === "Critical") return "bg-destructive";
    if (status === "Low") return "bg-yellow-500";
    return "bg-emerald-500";
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
            <Droplet className="w-7 h-7 sm:w-8 sm:h-8 text-primary" /> Inventory Management
          </h1>
          <p className="text-muted-foreground text-sm">Real-time local tracking of physically available blood reserves.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={fetchInventory}
            disabled={loading}
            className="px-3 sm:px-4 py-2 border border-border bg-card font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span className="hidden sm:inline">Sync Live</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Register Blood Batch</span>
            <span className="sm:hidden">Add</span>
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
            There are currently no blood reserves registered in your district&apos;s system.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table — hidden on mobile */}
          <div className="hidden md:block bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-3 border-b border-border font-bold text-xs text-muted-foreground bg-muted/30 uppercase tracking-wider">
              <div>Blood Group</div>
              <div>Bank Location</div>
              <div>Tracked Units</div>
              <div>Supply Status</div>
              <div>Earliest Expiration</div>
            </div>
            {inventory.map((inv, idx) => {
              const status = getStatus(inv.units);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-5 px-5 py-4 border-b border-border/50 last:border-b-0 hover:bg-muted/20 transition-colors items-center text-sm font-medium"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor(status)}`} />
                    {formatBloodGroup(inv.bloodGroup)}
                  </div>
                  <div className="text-muted-foreground font-semibold truncate pr-2">
                    {inv.bloodBank?.name || "Unknown Hub"}
                  </div>
                  <div>{inv.units} Units</div>
                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                  <div className="opacity-80 font-semibold">{getExpiryDays(inv.expiryDate)}</div>
                </div>
              );
            })}
          </div>

          {/* Mobile Cards — hidden on desktop */}
          <div className="md:hidden grid gap-3">
            {inventory.map((inv, idx) => {
              const status = getStatus(inv.units);
              const expiry = getExpiryDays(inv.expiryDate);
              const expiryIsExpired = expiry === "Expired";
              return (
                <div key={idx} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full ${dotColor(status)}`} />
                      <span className="font-black text-xl text-foreground">{formatBloodGroup(inv.bloodGroup)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted/40 rounded-lg p-2.5">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Bank</div>
                      <div className="font-semibold truncate">{inv.bloodBank?.name || "Unknown Hub"}</div>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2.5">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Units</div>
                      <div className="font-bold">{inv.units} Units</div>
                    </div>
                    <div className={`col-span-2 rounded-lg p-2.5 ${expiryIsExpired ? "bg-destructive/10" : "bg-muted/40"}`}>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Expiry</div>
                      <div className={`font-semibold ${expiryIsExpired ? "text-destructive" : ""}`}>{expiry}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
