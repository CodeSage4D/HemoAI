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

const urgencyColors = {
  RED: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", icon: "text-destructive" },
  YELLOW: { bg: "bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-500/30", icon: "text-yellow-500" },
  GREEN: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/30", icon: "text-emerald-500" },
};

const statusBadge = (status: string) => {
  if (status === "PENDING") return "bg-yellow-500/20 text-yellow-600";
  if (status === "APPROVED") return "bg-emerald-500/20 text-emerald-600";
  if (status === "CANCELLED") return "bg-destructive/20 text-destructive";
  return "bg-muted text-muted-foreground";
};

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

  useEffect(() => { fetchRequests(); }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
            <ActivitySquare className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            {isHospital ? "System Requisitions" : "My Blood Requests"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isHospital
              ? "Logistical routing requests broadcasted across local network."
              : "Track the status of your current or historical blood requests."}
          </p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 border border-border bg-card font-medium rounded-xl flex items-center gap-2 text-sm shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Sync Live
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
        <div className="grid gap-4">
          {requests.map((d) => {
            const colors = urgencyColors[d.urgencyChannel] || urgencyColors.GREEN;
            return (
              <div
                key={d.id}
                className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5"
              >
                {/* Top row: urgency icon + req ID + status badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${colors.bg}`}>
                      <ActivitySquare className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base sm:text-lg leading-tight truncate">
                        REQ-{d.id.substring(0, 8).toUpperCase()}
                      </h3>
                      <div className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${colors.text}`}>
                        {d.urgencyChannel} PRIORITY
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${statusBadge(d.status)}`}
                  >
                    {d.status}
                  </span>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="bg-muted/40 rounded-lg p-2.5">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Patient</div>
                    <div className="font-semibold text-xs sm:text-sm truncate">{d.patient?.name || "Unknown"}</div>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-2.5">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Blood Group</div>
                    <div className="font-semibold text-xs sm:text-sm">{d.patient?.bloodGroup || "—"}</div>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-2.5">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Units</div>
                    <div className="font-bold text-primary text-xs sm:text-sm">{d.unitsRequired} Units</div>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-2.5">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Risk Score</div>
                    <div className={`font-black text-xs sm:text-sm ${colors.text}`}>{d.priorityScore.toFixed(1)}</div>
                  </div>
                </div>

                {/* Hospital action buttons */}
                {isHospital && d.status === "PENDING" && (
                  <div className="flex gap-3 pt-2 border-t border-border/50">
                    <button
                      disabled={updatingId !== null}
                      onClick={() => handleUpdateStatus(d.id, "APPROVED")}
                      className="flex-1 h-11 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-bold text-sm hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {updatingId === d.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      disabled={updatingId !== null}
                      onClick={() => handleUpdateStatus(d.id, "CANCELLED")}
                      className="flex-1 h-11 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {updatingId === d.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
