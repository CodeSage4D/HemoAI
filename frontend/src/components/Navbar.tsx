"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize above md breakpoint
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Report Analysis", href: "/analyze" },
    { name: "Hospitals", href: "/hospitals" },
    { name: "Patients", href: "/patients" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-lg border-b border-border/60 py-2.5 shadow-sm"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Logo iconSize={34} />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 lg:gap-4 border-l border-border pl-4 lg:pl-6">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile: Theme toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            id="mobile-menu-toggle"
            className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 sm:w-80 bg-background border-l border-border shadow-2xl z-50 flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
                <Logo iconSize={30} />
                <button
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-3 text-center text-base font-semibold rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-3.5 text-center text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="px-6 py-5 border-t border-border shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Appearance</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
