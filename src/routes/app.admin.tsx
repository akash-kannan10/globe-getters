import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { Users, Plane, TrendingUp, Activity } from "lucide-react";

export const Route = createFileRoute("/app/admin")({ component: AdminPage });

const growth = Array.from({ length: 12 }, (_, i) => ({
  m: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  users: 200 + i * 180 + Math.random() * 100,
}));
const popular = [
  { name: "Bali", trips: 480 },
  { name: "Tokyo", trips: 412 },
  { name: "Santorini", trips: 380 },
  { name: "Iceland", trips: 290 },
  { name: "Dubai", trips: 240 },
];

function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total users", v: "12,840", i: Users },
          { l: "Trips created", v: "5,210", i: Plane },
          { l: "Engagement", v: "+18%", i: TrendingUp },
          { l: "Active today", v: "1,432", i: Activity },
        ].map((s, i) => (
          <GlassCard key={s.l} delay={i * 0.05}>
            <s.i className="h-5 w-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">{s.l}</p>
            <p className="text-2xl font-bold mt-1">{s.v}</p>
          </GlassCard>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-bold mb-4">User growth</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={growth}>
                <XAxis dataKey="m" stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.19 0.03 265)",
                    border: "1px solid oklch(1 0 0/0.1)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="oklch(0.78 0.16 200)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-bold mb-4">Popular destinations</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={popular}>
                <XAxis dataKey="name" stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.19 0.03 265)",
                    border: "1px solid oklch(1 0 0/0.1)",
                    borderRadius: 12,
                  }}
                  cursor={{ fill: "oklch(1 0 0/0.05)" }}
                />
                <Bar dataKey="trips" fill="oklch(0.7 0.2 295)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
