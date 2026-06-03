"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Droplet,
  ActivitySquare,
  Settings,
  LogOut,
  Bell,
  Map as MapIcon,
  FileScan,
  HeartHandshake,
  ShieldAlert,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth() as any;
  const pathname = usePathname();
  const isHospital = user?.role === "HOSPITAL" || user?.role === "ADMIN";

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Desktop sidebar collapsed state (persisted)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("raktava-sidebar-collapsed");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("raktava-sidebar-collapsed", String(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Close drawer on resize above md
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setDrawerOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hospitalLinks = [
    { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview" },
    { href: "/dashboard/inventory", icon: <Droplet className="w-5 h-5" />, label: "Inventory" },
    { href: "/dashboard/requests", icon: <ActivitySquare className="w-5 h-5" />, label: "System Requests" },
    { href: "/dashboard/map", icon: <MapIcon className="w-5 h-5" />, label: "Live Radar" },
    { href: "/dashboard/analyzer", icon: <FileScan className="w-5 h-5" />, label: "Med Analyzer" },
    { href: "/dashboard/drives", icon: <HeartHandshake className="w-5 h-5" />, label: "Donation Drives" },
  ];

  const patientLinks = [
    { href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview" },
    { href: "/dashboard/requests", icon: <ActivitySquare className="w-5 h-5" />, label: "My Requests" },
    { href: "/dashboard/drives", icon: <HeartHandshake className="w-5 h-5" />, label: "Donation Drives" },
  ];

  const navLinks = isHospital ? hospitalLinks : patientLinks;

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <nav className="space-y-1">
        {navLinks.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
            collapsed={false}
            onClick={onItemClick}
          />
        ))}

        {!isHospital && (
          <div className="pt-4">
            <Link
              href="/dashboard/sos"
              onClick={onItemClick}
              className="flex items-center gap-3 px-4 py-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-bold shadow-sm hover:bg-destructive hover:text-white transition-all w-full leading-none"
            >
              <ShieldAlert className="w-5 h-5 animate-pulse shrink-0" />
              <span>Emergency SOS</span>
            </Link>
          </div>
        )}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* ─── DESKTOP SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 shrink-0 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          {!sidebarCollapsed && <Logo iconSize={28} />}
          {sidebarCollapsed && (
            <Link href="/dashboard" aria-label="RAKTAVA Home" className="mx-auto">
              <svg width={28} height={28} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <path d="M20 4 C20 4 10 15 10 22 C10 27.5 14.5 32 20 32 C25.5 32 30 27.5 30 22 C30 15 20 4 20 4 Z" fill="url(#dg)" />
                <path d="M13 22 L16.5 17 L18.5 22 L20.5 19 L22.5 22 L25 18 L27 22" stroke="#6ee7b7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
              </svg>
            </Link>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <nav className="space-y-1">
            {navLinks.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
                collapsed={sidebarCollapsed}
              />
            ))}

            {!isHospital && (
              <div className="pt-4">
                <Link
                  href="/dashboard/sos"
                  className={`flex items-center gap-3 rounded-xl text-sm font-bold border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all leading-none ${
                    sidebarCollapsed ? "p-2.5 justify-center" : "px-4 py-3"
                  }`}
                  title={sidebarCollapsed ? "Emergency SOS" : undefined}
                >
                  <ShieldAlert className="w-5 h-5 animate-pulse shrink-0" />
                  {!sidebarCollapsed && <span>Emergency SOS</span>}
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className={`border-t border-border py-3 px-2 space-y-1 shrink-0`}>
          <SidebarItem
            href="/settings"
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            active={pathname === "/settings"}
            collapsed={sidebarCollapsed}
          />
          {typeof logout === "function" && (
            <button
              onClick={logout}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              title={sidebarCollapsed ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors mt-1 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 h-full w-72 sm:w-80 bg-card border-r border-border shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
                <Logo iconSize={28} />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3">
                <NavItems onItemClick={() => setDrawerOpen(false)} />
              </div>

              <div className="border-t border-border p-4 space-y-1 shrink-0">
                <Link
                  href="/settings"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Settings className="w-5 h-5" /> Settings
                </Link>
                {typeof logout === "function" && (
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT AREA ──────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 md:h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm z-10 gap-3">
          {/* Mobile: hamburger + page title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors shrink-0"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-sm md:text-base truncate">
              {isHospital ? "Command Overview" : "Patient Dashboard"}
            </h1>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary border border-primary/30 uppercase shrink-0">
              {user?.full_name?.substring(0, 2) || "AD"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

function SidebarItem({ href, icon, label, active, collapsed, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
        collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"
      } ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
