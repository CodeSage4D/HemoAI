"use client";

import Link from "next/link";
import { HeartPulse, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Report Analysis", href: "/analyze" },
    { name: "Hospitals", href: "/hospitals" },
    { name: "Patients", href: "/patients" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <HeartPulse className="w-6 h-6" />
          Hemo-Sync
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 border-l border-border pl-6">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Toggle & Theme Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button className="p-2 text-foreground" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full bg-background border-b border-border shadow-xl md:hidden flex flex-col p-6 h-screen"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 font-bold text-xl text-primary">
                <HeartPulse className="w-6 h-6" /> Hemo-Sync
              </div>
              <button className="p-2 text-foreground" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 text-lg font-medium">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">
                  {link.name}
                </Link>
              ))}
              <hr className="border-border my-2" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Login</Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="text-primary hover:text-emerald-500 transition-colors">Create Account</Link>
            </div>
            <div className="mt-auto pb-8">
               <div className="text-sm text-muted-foreground mb-4">Appearance</div>
               <div className="flex">
                  <ThemeToggle />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
