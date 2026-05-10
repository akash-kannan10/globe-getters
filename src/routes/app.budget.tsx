import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const Route = createFileRoute("/app/budget")({ component: BudgetPage });

const data = [
  { name: "Hotel", value: 1200 },
  { name: "Food", value: 600 },
  { name: "Transport", value: 800 },
  { name: "Activities", value: 400 },
];
const daily = Array.from({ length: 7 }, (_, i) => ({
  day: `D${i + 1}`,
  spend: 200 + Math.random() * 400,
}));
const colors = [
  "oklch(0.78 0.16 200)",
  "oklch(0.74 0.18 35)",
  "oklch(0.7 0.2 295)",
  "oklch(0.8 0.18 140)",
];

function BudgetPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Budget Analytics</h1>
      <div className="grid sm:grid-cols-4 gap-4">
        {data.map((d, i) => (
          <GlassCard key={d.name} hover delay={i * 0.05}>
            <p className="text-xs text-muted-foreground">{d.name}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: colors[i] }}>
              ${d.value}
            </p>
          </GlassCard>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-bold mb-4">Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={colors[i]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.19 0.03 265)",
                    border: "1px solid oklch(1 0 0/0.1)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-bold mb-4">Daily spending</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={daily}>
                <XAxis dataKey="day" stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.19 0.03 265)",
                    border: "1px solid oklch(1 0 0/0.1)",
                    borderRadius: 12,
                  }}
                  cursor={{ fill: "oklch(1 0 0/0.05)" }}
                />
                <Bar dataKey="spend" fill="oklch(0.78 0.16 200)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      <GlassCard className="bg-gradient-to-br from-primary/10 to-accent/10">
        <h3 className="font-bold mb-2">💡 Smart savings</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>→ Switch to train for Day 3 transit and save $120.</li>
          <li>→ Local eateries on Days 4–5 could cut food costs by 30%.</li>
          <li>→ Off-peak hotel rates are available for your dates.</li>
        </ul>
      </GlassCard>
    </div>
  );
}
