"use client";

import { User, Lock, Bell, Sun, Moon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

type Tab = "profile" | "security" | "notifications";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Personal Profile", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security & JWT", icon: <Lock className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/20 p-4 sm:p-6 lg:p-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Account &amp; Preferences</h1>
          <p className="text-muted-foreground text-sm">Manage your security architecture and UI behaviors.</p>
        </div>

        {/* Tab Navigation — horizontal scroll on mobile */}
        <div className="flex gap-2 border-b border-border overflow-x-auto pb-0 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-lg border-b border-border pb-4">Personal Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
                <input
                  disabled
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-medium h-11"
                  value={user?.full_name || "Unknown"}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Email Address</label>
                <input
                  disabled
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-medium h-11"
                  value={user?.email || "Unknown"}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Assigned Clearance Role</label>
              <div className="inline-flex px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg text-sm uppercase tracking-wider">
                {user?.role || "GUEST"} TIER
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 className="font-bold text-lg border-b border-border pb-4 mb-5">Security &amp; JWT</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="p-4 bg-muted/40 rounded-xl border border-border">
                JWT token rotation is managed server-side. Sessions expire automatically after 24 hours of inactivity. Your credentials are protected with AES-256 encryption in transit.
              </p>
              <button className="w-full sm:w-auto px-5 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 font-bold rounded-xl text-sm hover:bg-destructive/20 transition-colors">
                Invalidate All Active Sessions
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 className="font-bold text-lg border-b border-border pb-4 mb-5">Notification Logic</h3>
            <p className="text-sm text-muted-foreground p-4 bg-muted/40 rounded-xl border border-border">
              Push notifications and SMS alerts are managed through the RAKTAVA logistics engine. Alert thresholds are configurable per institutional tier.
            </p>
          </div>
        )}

        {/* Appearance Card */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg">System Appearance</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Adjust the semantic UI variables to match your environment.</p>
          </div>
          <div className="flex bg-muted rounded-xl p-1 border border-border shrink-0 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-card text-foreground font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 text-sm">
              <Sun className="w-4 h-4" /> Light
            </button>
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-muted-foreground font-medium rounded-lg flex items-center justify-center gap-2 text-sm hover:text-foreground transition-colors">
              <Moon className="w-4 h-4" /> Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
