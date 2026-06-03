"use client";

import Link from "next/link";
import { Globe, ExternalLink, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border pt-12 md:pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <Logo iconSize={30} />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-xs">
            Intelligent Blood Management system leveraging predictive AI to save lives, prevent shortages, and streamline medical logistics.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors p-1" aria-label="Website">
              <Globe className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors p-1" aria-label="External link">
              <ExternalLink className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors p-1" aria-label="Email">
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/services" className="hover:text-primary transition-colors">AI Demand Forecasting</Link></li>
            <li><Link href="/patients" className="hover:text-primary transition-colors">Patient Intelligence</Link></li>
            <li><Link href="/diagnosis" className="hover:text-primary transition-colors">Triage Tools</Link></li>
            <li><Link href="/hospitals" className="hover:text-primary transition-colors">Hospital Integration</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Legal</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">HIPAA Compliance</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
        <p>© 2026 RAKTAVA. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>All systems operational</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
