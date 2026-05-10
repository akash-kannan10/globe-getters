import { Link, useLocation, useNavigate, Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  Map,
  Compass,
  Wallet,
  Backpack,
  Users,
  User,
  BookOpen,
  BarChart3,
  LogOut,
  Plane,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/plan", label: "AI Planner", icon: Sparkles, highlight: true },
  { to: "/app/trips", label: "My Trips", icon: Map },
  { to: "/app/explore", label: "Explore", icon: Compass },
  { to: "/app/budget", label: "Budget", icon: Wallet },
  { to: "/app/packing", label: "Packing", icon: Backpack },
  { to: "/app/journal", label: "Journal", icon: BookOpen },
  { to: "/app/community", label: "Community", icon: Users },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/admin", label: "Admin", icon: BarChart3 },
] as { to: string; label: string; icon: typeof LayoutDashboard; highlight?: boolean }[];

export function AppShell() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 flex-col glass-strong border-r border-border/50 sticky top-0 h-screen">
        <SidebarBody onSignOut={signOut} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-72 h-full glass-strong border-r border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarBody onSignOut={signOut} onClose={() => setOpen(false)} />
          </motion.aside>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-40 glass-strong border-b border-border/50">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 flex-1 max-w-md">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search destinations, trips, activities…"
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex-1 md:hidden" />
            <button className="p-2 rounded-full glass hover:bg-white/10 transition">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 glass rounded-full pr-3 pl-1 py-1">
              <div className="h-8 w-8 rounded-full gradient-aurora flex items-center justify-center text-xs font-bold text-primary-foreground">
                {(user.email?.[0] ?? "T").toUpperCase()}
              </div>
              <span className="text-sm hidden sm:inline">{user.email?.split("@")[0]}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarBody({ onSignOut, onClose }: { onSignOut: () => void; onClose?: () => void }) {
  const location = useLocation();
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-8 px-2">
        <Link to="/app/dashboard" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-aurora flex items-center justify-center glow">
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Traveloop</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1">
        {nav.map((n) => {
          const active = location.pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? "glass text-foreground glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl gradient-aurora opacity-20"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4 relative z-10" />
              <span className="relative z-10 font-medium">{n.label}</span>
              {n.highlight && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full gradient-aurora text-primary-foreground font-bold relative z-10">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={onSignOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
