import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { destImages } from "@/lib/destinations";
import { MapPin, Calendar, Wallet, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/trips")({ component: TripsPage });

function TripsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trips, setTrips] = useState<any[]>([]);
  useEffect(() => {
    supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setTrips(data ?? []));
  }, []);
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>
      {trips.length === 0 ? (
        <GlassCard className="text-center !p-12">
          <Sparkles className="h-10 w-10 mx-auto text-primary mb-3" />
          <p className="text-muted-foreground">No trips yet. Generate your first AI itinerary.</p>
          <Link
            to="/app/plan"
            className="inline-block mt-4 gradient-aurora text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium"
          >
            Plan a trip
          </Link>
        </GlassCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((t) => (
            <GlassCard key={t.id} hover className="!p-0 overflow-hidden">
              <img
                src={t.cover_image || destImages.tropical}
                alt=""
                className="aspect-video w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {t.destination}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3 w-3" />${Number(t.budget || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t.travelers} pax
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
