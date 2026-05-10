import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Loader2,
  MapPin,
  Wallet,
  Calendar,
  Users,
  Plane,
  Train,
  Car,
  Globe2,
  Mountain,
  Waves,
  Heart,
  Crown,
  User as UserIcon,
  Users2,
  Sprout,
  Flame,
  Camera,
  Snowflake,
  Sun,
  Cloud,
  CloudSnow,
  Zap,
  Compass,
  Hotel,
  Save,
  Share2,
  Download,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { generateTrip } from "@/lib/trip-ai.functions";
import { pickImageForDestination } from "@/lib/destinations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
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

export const Route = createFileRoute("/app/plan")({ component: PlanPage });

const moods = [
  { id: "Adventure", icon: Mountain },
  { id: "Relaxation", icon: Waves },
  { id: "Nature", icon: Sprout },
  { id: "Spiritual", icon: Heart },
  { id: "Luxury", icon: Crown },
  { id: "Solo Travel", icon: UserIcon },
  { id: "Family Trip", icon: Users2 },
  { id: "Friends Trip", icon: Users },
  { id: "Romantic", icon: Heart },
  { id: "Cultural", icon: Compass },
];
const climates = [
  { id: "Cold", icon: Snowflake },
  { id: "Moderate", icon: Cloud },
  { id: "Tropical", icon: Sun },
  { id: "Snowy", icon: CloudSnow },
];
const transports = [
  { id: "Flight", icon: Plane },
  { id: "Train", icon: Train },
  { id: "Road Trip", icon: Car },
  { id: "Any", icon: Globe2 },
];
const paces = ["Relaxed", "Balanced", "Fast-paced"];
const interestsList = [
  "Beaches",
  "Mountains",
  "Temples",
  "Food",
  "Nightlife",
  "Trekking",
  "Shopping",
  "Wildlife",
  "Photography",
  "Historical",
  "Festivals",
];
const hotelTiers = ["Budget", "Standard", "Premium", "Luxury"];

const loadingMessages = [
  "Analyzing travel preferences…",
  "Finding budget-friendly destinations…",
  "Planning optimal routes…",
  "Calculating travel costs…",
  "Curating local experiences…",
  "Generating personalized itinerary…",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Plan = any;

function PlanPage() {
  const { user } = useAuth();
  const generate = useServerFn(generateTrip);

  // form state
  const [budget, setBudget] = useState(2000);
  const [currency, setCurrency] = useState("USD");
  const [days, setDays] = useState(5);
  const [mood, setMood] = useState("Adventure");
  const [climate, setClimate] = useState("Tropical");
  const [transport, setTransport] = useState("Flight");
  const [pace, setPace] = useState("Balanced");
  const [interests, setInterests] = useState<string[]>(["Food", "Photography"]);
  const [departure, setDeparture] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [hotelTier, setHotelTier] = useState("Standard");
  const [notes, setNotes] = useState("");

  const [phase, setPhase] = useState<"form" | "loading" | "results">("form");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [progressMsg, setProgressMsg] = useState(0);

  const toggleInterest = (i: string) =>
    setInterests((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  async function submit() {
    setPhase("loading");
    setProgressMsg(0);
    const interval = setInterval(
      () => setProgressMsg((p) => (p + 1) % loadingMessages.length),
      1800,
    );
    try {
      const res = await generate({
        data: {
          budget,
          currency,
          days,
          mood,
          climate,
          transport,
          pace,
          interests,
          departure,
          travelers,
          hotelTier,
          notes,
        },
      });
      clearInterval(interval);
      if (res.error || !res.plan) {
        toast.error(res.error || "Failed to generate trip");
        setPhase("form");
        return;
      }
      setPlan(res.plan);
      setPhase("results");
    } catch (e: unknown) {
      clearInterval(interval);
      toast.error((e as Error).message || "Something went wrong");
      setPhase("form");
    }
  }

  async function saveTrip() {
    if (!plan || !user) return;
    const cover = pickImageForDestination(plan.destination);
    const { error } = await supabase.from("trips").insert({
      user_id: user.id,
      name: `${plan.destination} adventure`,
      destination: plan.destination,
      budget,
      travelers,
      mood,
      ai_plan: plan,
      cover_image: cover,
      inputs: {
        budget,
        currency,
        days,
        mood,
        climate,
        transport,
        pace,
        interests,
        departure,
        travelers,
        hotelTier,
        notes,
      },
    });
    if (error) toast.error(error.message);
    else toast.success("Trip saved to your collection!");
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 text-xs">
                <Sparkles className="h-3 w-3 text-primary" /> AI Smart Planner
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold">
                Design your <span className="text-gradient-aurora">dream trip</span>
              </h1>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                Tell us your vibe — our AI will craft a complete itinerary in seconds.
              </p>
            </div>

            <div className="space-y-6">
              {/* Budget + days row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard>
                  <Label icon={Wallet}>Total Budget</Label>
                  <div className="flex items-center gap-3 mt-3">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="glass rounded-lg px-3 py-2 text-sm bg-card"
                    >
                      {["USD", "EUR", "GBP", "INR", "JPY"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="glass rounded-lg px-3 py-2 text-sm bg-transparent flex-1 outline-none focus:ring-2 ring-primary/50"
                    />
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={20000}
                    step={100}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full mt-4 accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$200</span>
                    <span>$20,000</span>
                  </div>
                </GlassCard>

                <GlassCard>
                  <Label icon={Calendar}>Number of Days</Label>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setDays(Math.max(1, days - 1))}
                      className="glass h-9 w-9 rounded-lg hover:bg-white/10"
                    >
                      −
                    </button>
                    <div className="text-2xl font-bold w-12 text-center">{days}</div>
                    <button
                      onClick={() => setDays(days + 1)}
                      className="glass h-9 w-9 rounded-lg hover:bg-white/10"
                    >
                      +
                    </button>
                    <div className="flex gap-2 ml-auto flex-wrap">
                      {[
                        { l: "Weekend", v: 2 },
                        { l: "3 Days", v: 3 },
                        { l: "5 Days", v: 5 },
                        { l: "1 Week", v: 7 },
                      ].map((q) => (
                        <button
                          key={q.l}
                          onClick={() => setDays(q.v)}
                          className={`text-xs px-3 py-1.5 rounded-full glass transition ${days === q.v ? "gradient-aurora text-primary-foreground" : "hover:bg-white/10"}`}
                        >
                          {q.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Mood */}
              <GlassCard>
                <Label icon={Flame}>Travel Mood</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                  {moods.map((m) => {
                    const active = mood === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setMood(m.id)}
                        className={`glass rounded-xl p-3 text-xs font-medium flex flex-col items-center gap-2 transition ${active ? "gradient-aurora text-primary-foreground glow scale-105" : "hover:bg-white/10"}`}
                      >
                        <m.icon className="h-4 w-4" /> {m.id}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard>
                  <Label icon={Sun}>Climate</Label>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {climates.map((c) => (
                      <Pill
                        key={c.id}
                        active={climate === c.id}
                        onClick={() => setClimate(c.id)}
                        icon={c.icon}
                      >
                        {c.id}
                      </Pill>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard>
                  <Label icon={Plane}>Transport</Label>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {transports.map((t) => (
                      <Pill
                        key={t.id}
                        active={transport === t.id}
                        onClick={() => setTransport(t.id)}
                        icon={t.icon}
                      >
                        {t.id}
                      </Pill>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard>
                  <Label icon={Zap}>Travel Pace</Label>
                  <div className="flex gap-2 mt-3">
                    {paces.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPace(p)}
                        className={`glass flex-1 rounded-xl py-2.5 text-sm font-medium transition ${pace === p ? "gradient-aurora text-primary-foreground" : "hover:bg-white/10"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard>
                  <Label icon={Hotel}>Hotel Preference</Label>
                  <div className="flex gap-2 mt-3">
                    {hotelTiers.map((h) => (
                      <button
                        key={h}
                        onClick={() => setHotelTier(h)}
                        className={`glass flex-1 rounded-xl py-2.5 text-sm font-medium transition ${hotelTier === h ? "gradient-aurora text-primary-foreground" : "hover:bg-white/10"}`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <GlassCard>
                <Label icon={Camera}>Interests</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {interestsList.map((i) => {
                    const active = interests.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleInterest(i)}
                        className={`text-xs px-3 py-1.5 rounded-full glass transition ${active ? "gradient-aurora text-primary-foreground" : "hover:bg-white/10"}`}
                      >
                        {i}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard>
                  <Label icon={MapPin}>Departure Location</Label>
                  <input
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    placeholder="e.g. New York, USA"
                    className="glass rounded-lg px-3 py-2.5 text-sm bg-transparent w-full mt-3 outline-none focus:ring-2 ring-primary/50"
                  />
                </GlassCard>
                <GlassCard>
                  <Label icon={Users}>Travelers</Label>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="glass h-9 w-9 rounded-lg hover:bg-white/10"
                    >
                      −
                    </button>
                    <div className="text-2xl font-bold w-12 text-center">{travelers}</div>
                    <button
                      onClick={() => setTravelers(travelers + 1)}
                      className="glass h-9 w-9 rounded-lg hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </GlassCard>
              </div>

              <GlassCard>
                <Label icon={Sparkles}>Anything else?</Label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Special requests, must-sees, dietary needs…"
                  className="glass rounded-lg px-3 py-2.5 text-sm bg-transparent w-full mt-3 outline-none focus:ring-2 ring-primary/50 resize-none"
                />
              </GlassCard>

              <button
                onClick={submit}
                className="w-full gradient-aurora text-primary-foreground font-bold py-4 rounded-2xl glow text-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition"
              >
                <Sparkles className="h-5 w-5" /> Generate Smart Trip
              </button>
            </div>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[70vh] flex flex-col items-center justify-center text-center relative"
          >
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full gradient-aurora opacity-20 blur-3xl"
              />
            </div>
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="h-32 w-32 rounded-full border-2 border-primary/30 border-t-primary"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border-2 border-accent/30 border-b-accent"
              />
              <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mt-10 text-gradient-aurora">Crafting your journey</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={progressMsg}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-muted-foreground mt-3 text-sm h-5"
              >
                {loadingMessages[progressMsg]}
              </motion.p>
            </AnimatePresence>
            <div className="mt-8 w-72 h-1.5 glass rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-aurora"
                initial={{ width: "5%" }}
                animate={{ width: "95%" }}
                transition={{ duration: 12, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}

        {phase === "results" && plan && (
          <Results
            key="results"
            plan={plan}
            budget={budget}
            days={days}
            onSave={saveTrip}
            onNew={() => {
              setPhase("form");
              setPlan(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Label({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <Icon className="h-4 w-4 text-primary" /> {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`glass rounded-xl py-2.5 text-xs font-medium flex flex-col items-center gap-1.5 transition ${active ? "gradient-aurora text-primary-foreground glow" : "hover:bg-white/10"}`}
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
  );
}

const PIE_COLORS = [
  "oklch(0.78 0.16 200)",
  "oklch(0.74 0.18 35)",
  "oklch(0.7 0.2 295)",
  "oklch(0.8 0.18 140)",
];

function Results({
  plan,
  budget,
  days,
  onSave,
  onNew,
}: {
  plan: Plan;
  budget: number;
  days: number;
  onSave: () => void;
  onNew: () => void;
}) {
  const cover = pickImageForDestination(plan.destination);
  const checkRef = useRef<Record<string, boolean>>({});
  const [, force] = useState(0);

  const parseAmt = (s: string) => Number(String(s ?? "").replace(/[^0-9.]/g, "")) || 0;
  const breakdown = [
    { name: "Transport", value: parseAmt(plan.budgetBreakdown?.transport) },
    { name: "Hotel", value: parseAmt(plan.budgetBreakdown?.hotel) },
    { name: "Food", value: parseAmt(plan.budgetBreakdown?.food) },
    { name: "Activities", value: parseAmt(plan.budgetBreakdown?.activities) },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dailySpend = (plan.days || []).map((d: any) => ({
    day: `D${d.day}`,
    spend: parseAmt(d.estimatedCost),
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden h-[420px]"
      >
        <img
          src={cover}
          alt={plan.destination}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-3">
            <span className="glass-strong rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" /> {plan.matchScore ?? 95}% AI Match
            </span>
            <span className="glass-strong rounded-full px-3 py-1 text-xs">
              {plan.weatherSummary}
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold">{plan.destination}</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">{plan.destinationReason}</p>
          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm">
            <Badge icon={Wallet}>{plan.totalEstimatedCost}</Badge>
            <Badge icon={Calendar}>{days} days</Badge>
            <Badge icon={MapPin}>{plan.days?.length ?? 0} stops</Badge>
          </div>
        </div>
      </motion.section>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onSave}
          className="glass rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/10"
        >
          <Save className="h-4 w-4" /> Save Trip
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
            toast.success("Itinerary copied");
          }}
          className="glass rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/10"
        >
          <Copy className="h-4 w-4" /> Copy
        </button>
        <button
          onClick={() => toast.info("Sharing soon")}
          className="glass rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/10"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        <button
          onClick={() => window.print()}
          className="glass rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/10"
        >
          <Download className="h-4 w-4" /> PDF
        </button>
        <button
          onClick={onNew}
          className="ml-auto gradient-aurora text-primary-foreground rounded-full px-4 py-2 text-sm font-medium"
        >
          New trip
        </button>
      </div>

      {/* Timeline */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Day-by-day itinerary</h2>
        <div className="relative space-y-4 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary before:via-accent before:to-secondary">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(plan.days || []).map((d: any, i: number) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-16"
            >
              <div className="absolute left-0 top-2 h-12 w-12 rounded-full gradient-aurora flex items-center justify-center font-bold glow text-primary-foreground">
                {d.day}
              </div>
              <div className="glass rounded-2xl p-5 hover:bg-white/[0.06] transition">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs text-primary uppercase tracking-wider">{d.city}</p>
                    <h3 className="text-lg font-bold">{d.title}</h3>
                  </div>
                  <span className="text-sm font-semibold glass px-3 py-1 rounded-full">
                    {d.estimatedCost}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(d.activities || []).map((a: any, idx: number) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className="text-primary font-mono shrink-0 w-20">{a.time}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{a.activity}</p>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {a.estimatedCost}
                      </span>
                    </div>
                  ))}
                </div>
                {d.foodSuggestions?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground">🍽️ Food: </span>
                    <span>{d.foodSuggestions.join(" · ")}</span>
                  </div>
                )}
                {d.travelNotes && (
                  <p className="mt-3 text-xs text-muted-foreground italic">{d.travelNotes}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Budget analytics */}
      <section className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-bold mb-4">Budget breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.19 0.03 265)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {breakdown.map((b, i) => (
              <div key={b.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span className="flex-1">{b.name}</span>
                <span className="font-mono">${b.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-bold mb-4">Daily spending</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={dailySpend}>
                <XAxis dataKey="day" stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.03 250)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.19 0.03 265)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                  cursor={{ fill: "oklch(1 0 0 / 0.05)" }}
                />
                <Bar dataKey="spend" fill="oklch(0.78 0.16 200)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

      {/* AI insights */}
      <GlassCard className="bg-gradient-to-br from-primary/[0.06] to-accent/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" /> <h3 className="font-bold">AI insights</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {(plan.travelTips || []).slice(0, 6).map((t: string, i: number) => (
            <div key={i} className="flex gap-2">
              <span className="text-primary">→</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Insights cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard title="📸 Photo spots" items={plan.photoSpots} />
        <InsightCard title="✨ Hidden gems" items={plan.hiddenGems} />
        <InsightCard title="🍜 Foods to try" items={plan.foodsToTry} />
        <InsightCard
          title="🏨 Hotels"
          items={(plan.hotelSuggestions || []).map(
            (h: Record<string, string>) => `${h.name} · ${h.priceRange}`,
          )}
        />
      </div>

      {/* Packing checklist */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Smart packing checklist</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(plan.packingChecklist || []).map((cat: any) => {
            const total = cat.items.length;
            const done = cat.items.filter(
              (it: string) => checkRef.current[`${cat.category}-${it}`],
            ).length;
            const pct = total ? (done / total) * 100 : 0;
            return (
              <GlassCard key={cat.category} className="!p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold">{cat.category}</h4>
                  <span className="text-xs text-muted-foreground">
                    {done}/{total}
                  </span>
                </div>
                <div className="h-1 glass rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full gradient-aurora transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <ul className="space-y-1.5">
                  {cat.items.map((it: string) => {
                    const k = `${cat.category}-${it}`;
                    const checked = !!checkRef.current[k];
                    return (
                      <li key={it}>
                        <button
                          onClick={() => {
                            checkRef.current[k] = !checked;
                            force((x) => x + 1);
                          }}
                          className="flex items-start gap-2 text-sm w-full text-left hover:text-primary transition"
                        >
                          <CheckCircle2
                            className={`h-4 w-4 mt-0.5 shrink-0 transition ${checked ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span className={checked ? "line-through text-muted-foreground" : ""}>
                            {it}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}

function Badge({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="glass-strong rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-primary" /> {children}
    </span>
  );
}

function InsightCard({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <GlassCard className="!p-5" hover>
      <h4 className="font-bold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.slice(0, 5).map((i, idx) => (
          <li key={idx} className="leading-snug">
            • {i}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
