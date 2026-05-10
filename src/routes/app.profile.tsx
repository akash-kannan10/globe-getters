import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/lib/auth";
import { Award, MapPin, Plane, Camera } from "lucide-react";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user, signOut } = useAuth();
  const name = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Traveler";
  const badges = [
    { icon: Plane, label: "First Flight" },
    { icon: MapPin, label: "Globe Trotter" },
    { icon: Camera, label: "Photographer" },
    { icon: Award, label: "Trail Blazer" },
  ];
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GlassCard className="flex items-center gap-5 !p-8">
        <div className="h-24 w-24 rounded-3xl gradient-aurora flex items-center justify-center text-3xl font-bold text-primary-foreground glow shrink-0">
          {name[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl font-bold truncate">{name}</h1>
          <p className="text-muted-foreground text-sm truncate">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="ml-auto glass rounded-full px-4 py-2 text-sm hover:bg-white/10"
        >
          Sign out
        </button>
      </GlassCard>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { l: "Trips", v: 12 },
          { l: "Days traveled", v: 84 },
          { l: "Destinations", v: 9 },
        ].map((s, i) => (
          <GlassCard key={s.l} delay={i * 0.05}>
            <p className="text-xs text-muted-foreground">{s.l}</p>
            <p className="text-3xl font-bold text-gradient-aurora mt-1">{s.v}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard>
        <h3 className="font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <div
              key={b.label}
              className="glass rounded-2xl p-4 text-center hover:scale-105 transition"
            >
              <div className="h-12 w-12 rounded-full gradient-aurora mx-auto flex items-center justify-center mb-2">
                <b.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-medium">{b.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
