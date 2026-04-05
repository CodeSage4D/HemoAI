"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, MapPin, Phone, Car, Navigation, ShieldAlert, HeartPulse, Hospital } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicSOSPage() {
  const [gpsLoading, setGpsLoading] = useState(true);
  const [location, setLocation] = useState<string>("Locating...");

  useEffect(() => {
    // Simulate browser secure geolocation lock on Madhya Pradesh Hub
    const timer = setTimeout(() => {
      setLocation("AB Road, Indore, MP 452001");
      setGpsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const emergencyContacts = [
    { title: "Air Ambulance (Helicopter)", phone: "+91 9999-111-AIR", urgency: "RED" },
    { title: "Ground ICU Ambulance", phone: "108 / 102", urgency: "RED" },
    { title: "Regional Police Control", phone: "100", urgency: "YELLOW" },
  ];

  const nearbyHospitals = [
    { name: "MY Hospital Regional Hub", distance: "2.1 km", estTime: "4 mins", accepting: true },
    { name: "Choithram Hospital", distance: "5.4 km", estTime: "9 mins", accepting: false },
    { name: "Apollo Rajshree", distance: "6.8 km", estTime: "12 mins", accepting: true },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Heavy Red Pulse Background for SOS Identity */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-destructive/20 to-background z-0 pointer-events-none" />

      {/* Top Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border bg-background/50 backdrop-blur-md">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <ActivitySquareIcon className="w-6 h-6 text-primary" /> Hemo-Sync
        </Link>
        <Link href="/login" className="text-sm font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg">
           Patient Login
        </Link>
      </header>

      <main className="relative z-10 flex-1 px-4 lg:px-12 py-8 max-w-6xl mx-auto w-full flex flex-col space-y-6 animate-in fade-in duration-500">
        
        {/* Header Alert */}
        <div className="text-center space-y-3 mb-4">
           <div className="inline-flex items-center justify-center p-4 bg-destructive/10 text-destructive rounded-full mb-2 animate-pulse">
              <ShieldAlert className="w-12 h-12" />
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-foreground drop-shadow-sm">SOS Emergency Support</h1>
           <p className="text-lg text-muted-foreground font-medium">Instant routing to regional ambulances and trauma centers.</p>
        </div>

        {/* Geolocation Tag */}
        <div className="bg-card border border-border shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                 <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                 <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Detected Dispatch Origin</div>
                 {gpsLoading ? (
                   <div className="flex items-center gap-2 text-foreground font-bold">
                     <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Calibrating GPS...
                   </div>
                 ) : (
                   <div className="font-bold text-lg text-foreground">{location}</div>
                 )}
              </div>
           </div>
           <button disabled={gpsLoading} className="w-full md:w-auto px-8 py-4 bg-destructive text-destructive-foreground font-bold tracking-wide rounded-xl shadow-xl shadow-destructive/20 hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5"/> SEND AUTO-DISPATCH
           </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full">
           
           {/* Direct Contacts */}
           <div className="space-y-4">
             <h3 className="font-bold text-lg border-b border-border pb-2">Direct Emergency Lines</h3>
             {emergencyContacts.map((c, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${c.urgency === 'RED' ? 'bg-destructive/5 border-destructive/20' : 'bg-card border-border'}`}>
                   <div>
                      <h4 className="font-bold flex items-center gap-2"><Phone className="w-4 h-4"/> {c.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 text-xs">Tap to dial instantly</p>
                   </div>
                   <a href={`tel:${c.phone}`} className={`px-4 py-2 font-black rounded-lg ${c.urgency === 'RED' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-foreground'}`}>
                      {c.phone}
                   </a>
                </div>
             ))}
           </div>

           {/* Nearby Hospitals (Live Distance) */}
           <div className="space-y-4">
             <h3 className="font-bold text-lg border-b border-border pb-2 flex items-center justify-between">
               Nearest Hubs
               <span className="text-xs font-normal text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full animate-pulse">Live</span>
             </h3>
             {nearbyHospitals.map((h, i) => (
                <div key={i} className="p-4 bg-card border border-border shadow-sm rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div>
                      <h4 className="font-bold flex items-center gap-2 text-primary"><Hospital className="w-4 h-4"/> {h.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-muted-foreground">
                         <span className="flex items-center gap-1"><Car className="w-3 h-3"/> {h.distance}</span>
                         <span className="flex items-center gap-1"><Navigation className="w-3 h-3"/> {h.estTime} Route</span>
                      </div>
                   </div>
                   <div className="flex sm:flex-col items-center sm:items-end justify-between font-medium">
                      {h.accepting ? (
                         <span className="text-emerald-500 text-xs flex items-center gap-1"><HeartPulse className="w-3 h-3"/> Accepting Trauma</span>
                      ) : (
                         <span className="text-destructive text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> At Capacity</span>
                      )}
                      <button disabled={!h.accepting} className="mt-2 sm:mt-1 px-4 py-1.5 bg-foreground text-background text-xs rounded-lg hover:opacity-90 disabled:opacity-50">Route EMS</button>
                   </div>
                </div>
             ))}
           </div>

        </div>
      </main>
    </div>
  );
}

function ActivitySquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M17 12h-2l-2 5-2-10-2 5H7" />
    </svg>
  )
}
