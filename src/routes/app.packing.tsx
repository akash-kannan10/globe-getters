import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";

export const Route = createFileRoute("/app/packing")({ component: PackingPage });

const initial = {
  Clothes: ["T-shirts (5)", "Jeans", "Light jacket", "Swimwear", "Sleepwear"],
  Electronics: ["Phone charger", "Power bank", "Adapter", "Camera"],
  Documents: ["Passport", "Visa", "Tickets", "Travel insurance"],
  Medical: ["First aid kit", "Sunscreen", "Personal meds"],
  Essentials: ["Toiletries", "Reusable bottle", "Sunglasses"],
};

function PackingPage() {
  const [items, setItems] = useState(initial);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const total = Object.values(items).flat().length;
  const done = Object.values(checked).filter(Boolean).length;
  const pct = total ? (done / total) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Smart Packing Checklist</h1>
        <p className="text-muted-foreground">AI-curated essentials for your trip.</p>
      </div>
      <GlassCard>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall progress</span>
          <span className="text-sm text-muted-foreground">
            {done}/{total}
          </span>
        </div>
        <div className="h-2 glass rounded-full overflow-hidden">
          <div className="h-full gradient-aurora transition-all" style={{ width: `${pct}%` }} />
        </div>
      </GlassCard>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(items).map(([cat, list]) => (
          <GlassCard key={cat} className="!p-5">
            <h4 className="font-bold mb-3">{cat}</h4>
            <ul className="space-y-1.5">
              {list.map((it) => {
                const k = `${cat}-${it}`;
                return (
                  <li key={it}>
                    <button
                      onClick={() => setChecked((c) => ({ ...c, [k]: !c[k] }))}
                      className="flex items-start gap-2 text-sm w-full text-left hover:text-primary transition"
                    >
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 shrink-0 ${checked[k] ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <span className={checked[k] ? "line-through text-muted-foreground" : ""}>
                        {it}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => {
                const v = prompt(`Add to ${cat}`);
                if (v)
                  setItems((p) => ({ ...p, [cat]: [...(p as Record<string, string[]>)[cat], v] }));
              }}
              className="mt-3 text-xs text-primary flex items-center gap-1 hover:underline"
            >
              <Plus className="h-3 w-3" /> Add item
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
