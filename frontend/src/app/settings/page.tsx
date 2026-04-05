"use client";

import { User, Lock, Bell, Moon, Sun, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-muted/20 p-6 lg:p-12 animate-in fade-in duration-500">
      
      <div className="max-w-4xl mx-auto space-y-8">
         <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4"/> Back to Dashboard
         </Link>

         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold mb-1">Account & Preferences</h1>
               <p className="text-muted-foreground text-sm">Manage your security architecture and UI behaviors.</p>
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-2">
               <button className="w-full text-left px-4 py-3 bg-card border border-border text-primary shadow-sm rounded-xl font-medium text-sm flex items-center gap-3"><User className="w-5 h-5"/> Personal Profile</button>
               <button className="w-full text-left px-4 py-3 bg-transparent text-muted-foreground hover:bg-muted rounded-xl font-medium text-sm transition-colors flex items-center gap-3"><Lock className="w-5 h-5"/> Security & JWT</button>
               <button className="w-full text-left px-4 py-3 bg-transparent text-muted-foreground hover:bg-muted rounded-xl font-medium text-sm transition-colors flex items-center gap-3"><Bell className="w-5 h-5"/> Notification Logic</button>
            </div>

            <div className="col-span-2 space-y-6">
               <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-6 border-b border-border pb-4">Personal Configuration</h3>
                  
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
                           <input disabled className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-medium" value={user?.full_name || "Unknown"} />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Email Address</label>
                           <input disabled className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm font-medium" value={user?.email || "Unknown"} />
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Assigned Clearance Role</label>
                        <div className="inline-flex px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg text-sm uppercase tracking-wider">
                           {user?.role || "GUEST"} TIER
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                     <h3 className="font-bold text-lg">System Appearance</h3>
                     <p className="text-sm text-muted-foreground">Adjust the semantic UI variables to match your environment.</p>
                  </div>
                  <div className="flex bg-muted rounded-xl p-1 border border-border">
                     <button className="px-4 py-2 bg-card text-foreground font-medium rounded-lg shadow-sm flex items-center gap-2 text-sm"><Sun className="w-4 h-4"/> Glacial Mode</button>
                     <button className="px-4 py-2 text-muted-foreground font-medium rounded-lg flex items-center gap-2 text-sm"><Moon className="w-4 h-4"/> Deep Night</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
