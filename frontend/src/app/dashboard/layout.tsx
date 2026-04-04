import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Droplet, 
  ActivitySquare, 
  Settings,
  LogOut,
  Bell
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-card border-r border-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="font-bold text-lg text-primary flex items-center gap-2">
            <ActivitySquare className="w-5 h-5" />
            Hemo-Sync SaaS
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1">
            <SidebarItem href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" active />
            <SidebarItem href="/dashboard/inventory" icon={<Droplet className="w-5 h-5" />} label="Inventory" />
            <SidebarItem href="/dashboard/donors" icon={<Users className="w-5 h-5" />} label="Donors" />
            <SidebarItem href="/dashboard/requests" icon={<ActivitySquare className="w-5 h-5" />} label="Requests" />
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <SidebarItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
          <div className="mt-2 text-sm text-red-500 font-medium px-3 py-2 flex items-center gap-3 hover:bg-destructive/10 rounded-md cursor-pointer transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <h1 className="font-semibold text-lg">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary border border-primary/30">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
