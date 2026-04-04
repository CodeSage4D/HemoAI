"use client";

import Link from "next/link";
import { HeartPulse, Globe, ExternalLink, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary mb-4">
            <HeartPulse className="w-6 h-6" />
            Hemo-Sync
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Intelligent Blood Management system leveraging predictive AI to save lives, prevent shortages, and streamline medical logistics.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors"><Globe className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-foreground transition-colors"><ExternalLink className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-foreground transition-colors"><Mail className="w-5 h-5" /></Link>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/services" className="hover:text-primary transition-colors">AI Demand Forecasting</Link></li>
            <li><Link href="/patients" className="hover:text-primary transition-colors">Patient Intelligence</Link></li>
            <li><Link href="/diagnosis" className="hover:text-primary transition-colors">Triage Tools</Link></li>
            <li><Link href="/hospitals" className="hover:text-primary transition-colors">Hospital Integration</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-foreground">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/hipaa" className="hover:text-primary transition-colors">HIPAA Compliance</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2026 Hemo-Sync Intelligence Systems. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
