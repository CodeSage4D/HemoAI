"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-24 px-6 max-w-7xl mx-auto min-h-screen grid lg:grid-cols-2 gap-16">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Let's Connect.</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-md">
          Whether you're an institutional hospital looking for an integration package, or a donor wanting to help, we're here.
        </p>
        
        <div className="space-y-8 mb-12">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Email Us</h3>
              <p className="text-muted-foreground">hello@hemo-sync.ai</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Call Support</h3>
              <p className="text-muted-foreground">1-800-HEMOSYNC</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Headquarters</h3>
              <p className="text-muted-foreground">1200 Innovation Drive, Silicon Valley, CA</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border shadow-2xl rounded-3xl p-8 lg:p-10"
      >
        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <input type="text" className="w-full bg-muted px-4 py-3 rounded-xl border border-transparent focus:border-primary outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <input type="text" className="w-full bg-muted px-4 py-3 rounded-xl border border-transparent focus:border-primary outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="w-full bg-muted px-4 py-3 rounded-xl border border-transparent focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea rows={4} className="w-full bg-muted px-4 py-3 rounded-xl border border-transparent focus:border-primary outline-none resize-none" />
          </div>
          <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            Send Message <Send className="w-4 h-4"/>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
