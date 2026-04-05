"use client";

import { useState, useEffect } from "react";
import { AlertCircle, MapPin, Phone, Car, Navigation, ShieldAlert, HeartPulse, Hospital, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PatientSOSDashboard() {
  const { user } = useAuth();
  const [gpsLoading, setGpsLoading] = useState(true);
  const [location, setLocation] = useState<string>("Locating...");
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    // Simulate secure browser geolocation lock
    const timer = setTimeout(() => {
      setLocation("AB Road, Indore, MP 452001");
      setGpsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const emergencyContacts = [
    { title: "Air Ambulance Fleet", phone: "+91 9999-111-AIR", urgency: "RED" },
    { title: "Ground ICU Disbatch", phone: "108 / 102", urgency: "RED" },
  ];

  const handleDispatch = () => {
    setDispatched(true);
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black mb-1 flex items-center gap-3 text-destructive"><ShieldAlert className="w-8 h-8" /> Emergency SOS Engine</h1>
            <p className="text-muted-foreground text-sm">Priority dispatch network. Misuse of this module is subject to institutional penalties.</p>
         </div>
      </div>

      {!dispatched ? (
        <div className="bg-destructive/10 border-2 border-destructive/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg shadow-destructive/5">
           <div className="flex items-center gap-6 z-10 w-full relative">
              <div className="hidden md:flex w-24 h-24 rounded-full bg-destructive/20 items-center justify-center shrink-0">
                 <ShieldAlert className="w-10 h-10 text-destructive animate-pulse" />
              </div>
              <div className="flex-1 w-full">
                 <div className="text-xs text-destructive font-black uppercase tracking-widest mb-2">Authenticated Medical SOS Override</div>
                 
                 <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
                       <span className="text-[10px] text-muted-foreground block uppercase">Linked Profile</span>
                       <span className="font-bold text-sm truncate block">{user?.full_name || "Unknown"}</span>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
                       <span className="text-[10px] text-muted-foreground block uppercase">Profile ID</span>
                       <span className="font-bold text-sm truncate block">PT-ID-{user?.id || "N/A"}</span>
                    </div>
                 </div>

                 {gpsLoading ? (
                   <div className="flex items-center gap-2 text-destructive font-bold text-lg">
                     <span className="w-5 h-5 rounded-full border-2 border-destructive border-t-transparent animate-spin" /> Extracting GPS Node...
                   </div>
                 ) : (
                   <div className="font-bold text-xl text-foreground flex items-center gap-2"><MapPin className="w-5 h-5 text-destructive"/> {location}</div>
                 )}
              </div>
           </div>
           <button onClick={handleDispatch} disabled={gpsLoading} className="shrink-0 w-full md:w-auto px-10 py-6 bg-destructive text-destructive-foreground font-black tracking-widest text-lg rounded-xl shadow-xl shadow-destructive/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 z-10">
              DISPATCH AMBULANCE
           </button>
           
           {/* Decorative bg pulses */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-destructive blur-3xl opacity-10 rounded-full animate-pulse pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-destructive/50 blur-3xl opacity-10 rounded-full pointer-events-none" />
        </div>
      ) : (
         <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
               <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-emerald-500">Ambulance Dispatched</h2>
            <p className="font-medium max-w-md mx-auto">Unit #7082 is en route to your location (<span className="font-bold text-foreground">{location}</span>). Estimated arrival is 4 minutes.</p>
            <p className="text-sm text-muted-foreground mt-2">Paramedics have been granted immediate access to your Hemo-Sync medical profile.</p>
         </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-2">
         {/* Direct Contacts */}
         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold text-lg border-b border-border pb-3 mb-4">Direct Communication Links</h3>
           <div className="space-y-3">
             {emergencyContacts.map((c, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${c.urgency === 'RED' ? 'bg-destructive/5 border-destructive/20' : 'bg-muted border-border'}`}>
                   <div>
                      <h4 className="font-bold flex items-center gap-2 text-sm"><Phone className="w-4 h-4"/> {c.title}</h4>
                   </div>
                   <a href={`tel:${c.phone}`} className={`px-4 py-2 font-black rounded-lg text-sm ${c.urgency === 'RED' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-muted-foreground text-background hover:bg-foreground'}`}>
                      {c.phone}
                   </a>
                </div>
             ))}
           </div>
         </div>

         {/* Nearby Hospitals Hub */}
         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
           <h3 className="font-bold text-lg border-b border-border pb-3 mb-4 flex items-center justify-between">
             Nearest Hubs
             <span className="text-xs font-normal text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full animate-pulse">Live Radar</span>
           </h3>
           <div className="space-y-3">
             <div className="p-3 bg-muted/50 rounded-xl flex items-center justify-between border border-border/50">
                 <div>
                    <h4 className="font-bold text-sm text-primary flex items-center gap-1.5"><Hospital className="w-4 h-4"/> MY Hospital Regional Hub</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                       <span className="flex items-center gap-1"><Car className="w-3 h-3"/> 2.1 km</span>
                       <span className="flex items-center gap-1"><Navigation className="w-3 h-3"/> 4 mins</span>
                    </div>
                 </div>
                 <span className="text-emerald-500 text-xs font-bold flex items-center gap-1"><HeartPulse className="w-3 h-3"/> Active</span>
             </div>
             
             <div className="p-3 bg-muted/50 rounded-xl flex items-center justify-between border border-border/50">
                 <div>
                    <h4 className="font-bold text-sm flex items-center gap-1.5"><Hospital className="w-4 h-4"/> Choithram Med Center</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                       <span className="flex items-center gap-1"><Car className="w-3 h-3"/> 5.4 km</span>
                       <span className="flex items-center gap-1"><Navigation className="w-3 h-3"/> 9 mins</span>
                    </div>
                 </div>
                 <span className="text-destructive text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Full</span>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
