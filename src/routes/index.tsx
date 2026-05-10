import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Map, Wallet, Globe2, Plane } from "lucide-react";
import hero from "@/assets/hero-tropical.jpg";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) navigate({ to: "/app/dashboard" });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero bg */}
      <div className="absolute inset-0 -z-10">
        <img
          src={hero}
          alt=""
          className="h-full w-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Nav */}
      <header className="relative z-20 px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-aurora flex items-center justify-center glow">
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">Traveloop</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="text-sm gradient-aurora text-primary-foreground px-4 py-2 rounded-full font-medium hover:opacity-90 transition glow"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-12 pt-12 lg:pt-24 pb-24 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs"
        >
          <Sparkles className="h-3 w-3 text-primary" />
          Powered by Gemini AI
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-bold tracking-tight"
        >
          Your next journey,
          <br />
          <span className="text-gradient-aurora">planned in seconds.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Tell us your vibe, budget, and dates. Our AI crafts a complete itinerary — destinations,
          day-by-day plans, hotels, food, and budgets — instantly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/signup"
            className="gradient-aurora text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 glow hover:scale-105 transition"
          >
            Start planning free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="glass px-6 py-3 rounded-full font-medium text-sm hover:bg-white/10 transition"
          >
            I have an account
          </Link>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-24 grid sm:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: Sparkles,
              title: "AI Itineraries",
              desc: "Day-by-day plans tailored to your mood.",
            },
            { icon: Wallet, title: "Smart Budgets", desc: "Live cost breakdowns + savings tips." },
            { icon: Globe2, title: "Curated Spots", desc: "Hidden gems, food, and photo ops." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition"
            >
              <f.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
