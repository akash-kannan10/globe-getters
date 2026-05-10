import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { popularDestinations } from "@/lib/destinations";

export const Route = createFileRoute("/app/explore")({ component: ExplorePage });

function ExplorePage() {
  const [q, setQ] = useState("");
  const filtered = popularDestinations.filter((d) =>
    (d.name + d.country).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Explore destinations</h1>
      <p className="text-muted-foreground mb-6">Discover places curated for travelers like you.</p>
      <div className="glass rounded-full px-4 py-3 flex items-center gap-3 mb-6 max-w-xl">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search cities, countries…"
          className="bg-transparent outline-none flex-1 text-sm"
        />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <GlassCard key={d.id} hover className="!p-0 overflow-hidden">
            <img src={d.image} alt={d.name} className="aspect-video w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{d.name}</h3>
                <span className="text-xs glass px-2 py-0.5 rounded-full">{d.cost}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {d.country} · {d.weather}
              </p>
              <button className="mt-4 w-full gradient-aurora text-primary-foreground rounded-full py-2 text-xs font-medium">
                Add to trip
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
