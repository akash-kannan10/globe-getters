import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";

export const Route = createFileRoute("/app/journal")({ component: JournalPage });

function JournalPage() {
  const [entries, setEntries] = useState([
    { day: 1, date: "Day 1", text: "Touched down in paradise. The air smelled like adventure." },
    { day: 2, date: "Day 2", text: "Sunrise over the cliffs — speechless. Best chai of my life." },
  ]);
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Travel Journal</h1>
        <button
          onClick={() =>
            setEntries((e) => [...e, { day: e.length + 1, date: `Day ${e.length + 1}`, text: "" }])
          }
          className="gradient-aurora text-primary-foreground rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> New entry
        </button>
      </div>
      <div className="relative space-y-4 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary before:to-accent">
        {entries.map((e, i) => (
          <div key={i} className="relative pl-14">
            <div className="absolute left-0 top-3 h-10 w-10 rounded-full gradient-aurora flex items-center justify-center text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <GlassCard className="!p-5">
              <p className="text-xs text-primary uppercase tracking-wider">{e.date}</p>
              <textarea
                defaultValue={e.text}
                placeholder="Write your memories…"
                rows={3}
                className="bg-transparent outline-none w-full mt-2 resize-none text-sm leading-relaxed"
              />
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}
