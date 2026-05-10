import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Calendar, Wallet, TrendingUp, ArrowRight, Plane } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { GlassCard } from "@/components/GlassCard";
import { popularDestinations, destImages } from "@/lib/destinations";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/dashboard")({ component: Dashboard });

type Trip = {
  id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  cover_image: string | null;
  status: string | null;
};

function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Explorer";

  useEffect(() => {
    supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setTrips(data ?? []));
  }, []);

  const upcoming = trips.filter((t) => t.status !== "completed").slice(0, 3);
  const previous = trips.filter((t) => t.status === "completed").slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative glass rounded-3xl p-8 lg:p-10 overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full gradient-aurora opacity-20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full gradient-sunset opacity-15 blur-3xl" />
        <div className="relative">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl lg:text-5xl font-bold mt-1">
            {firstName} <span className="text-gradient-aurora">✨</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Where to next? Let our AI craft your perfect itinerary in seconds.
          </p>
          <Link
            to="/app/plan"
            className="inline-flex items-center gap-2 mt-6 gradient-aurora text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm glow hover:scale-105 transition"
          >
            <Sparkles className="h-4 w-4" /> Plan a new trip <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Trips",
            value: trips.length,
            icon: Plane,
            accent: "from-primary to-accent",
          },
          {
            label: "Countries",
            value: new Set(trips.map((t) => t.destination)).size,
            icon: MapPin,
            accent: "from-accent to-secondary",
          },
          {
            label: "Upcoming",
            value: upcoming.length,
            icon: Calendar,
            accent: "from-secondary to-primary",
          },
          {
            label: "Budget Tracked",
            value: `$${trips.reduce((s, t) => s + (Number(t.budget) || 0), 0).toLocaleString()}`,
            icon: Wallet,
            accent: "from-primary to-secondary",
          },
        ].map((s, i) => (
          <GlassCard key={s.label} delay={i * 0.05} hover className="!p-5">
            <div
              className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.accent} flex items-center justify-center mb-3 opacity-80`}
            >
              <s.icon className="h-4 w-4 text-primary-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Recommended */}
      <section>
        <SectionHeader
          title="Recommended for you"
          subtitle="Hand-picked by AI based on your vibes"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularDestinations.slice(0, 3).map((d, i) => (
            <DestinationCard key={d.id} d={d} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* Popular carousel */}
      <section>
        <SectionHeader title="Popular destinations" subtitle="Trending this week" />
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2 snap-x">
          {popularDestinations.map((d, i) => (
            <div key={d.id} className="snap-start shrink-0 w-72">
              <DestinationCard d={d} delay={i * 0.04} />
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming + Previous */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <SectionHeader title="Upcoming trips" />
          {upcoming.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No trips scheduled"
              cta={{ label: "Plan your first trip", to: "/app/plan" }}
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((t) => (
                <TripRow key={t.id} t={t} />
              ))}
            </div>
          )}
        </section>
        <section>
          <SectionHeader title="Previous trips" />
          {previous.length === 0 ? (
            <EmptyState icon={Plane} title="No completed trips yet" />
          ) : (
            <div className="space-y-3">
              {previous.map((t) => (
                <TripRow key={t.id} t={t} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* AI suggestions */}
      <GlassCard className="!p-8 bg-gradient-to-br from-primary/[0.06] to-accent/[0.06]">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl gradient-aurora flex items-center justify-center glow shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI suggests Bali for your next escape</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Based on your interest in nature and relaxation, Bali offers tropical beaches,
              spiritual retreats, and cultural depth — all within your typical budget.
            </p>
            <Link
              to="/app/plan"
              className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
            >
              Generate trip <TrendingUp className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function DestinationCard({
  d,
  delay = 0,
}: {
  d: (typeof popularDestinations)[number];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl overflow-hidden cursor-pointer group"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={d.image}
          alt={d.name}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-3 right-3 glass-strong rounded-full px-3 py-1 text-xs font-medium">
          {d.cost}
        </div>
        <div className="absolute bottom-3 left-3 glass-strong rounded-full px-3 py-1 text-xs">
          {d.weather}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold">{d.name}</h3>
        <p className="text-xs text-muted-foreground">{d.country}</p>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {d.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full glass border-primary/20 text-primary"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TripRow({ t }: { t: Trip }) {
  return (
    <Link
      to="/app/trips"
      className="glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.06] transition group"
    >
      <img
        src={t.cover_image || destImages.tropical}
        alt=""
        className="h-14 w-14 rounded-xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{t.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {t.destination ?? "—"} · ${Number(t.budget ?? 0).toLocaleString()}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  title,
  cta,
}: {
  icon: React.ElementType;
  title: string;
  cta?: { label: string; to: string };
}) {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <Icon className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">{title}</p>
      {cta && (
        <Link
          to={cta.to}
          className="inline-block mt-4 text-sm gradient-aurora text-primary-foreground px-4 py-2 rounded-full font-medium"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
