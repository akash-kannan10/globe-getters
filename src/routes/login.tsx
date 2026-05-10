import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plane, Mail, Lock, Loader2 } from "lucide-react";
import hero from "@/assets/hero-tropical.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate({ to: "/app/dashboard" });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/app/dashboard" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/30 via-background/50 to-background/80" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-aurora flex items-center justify-center glow">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Traveloop</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Adventure is
              <br />
              <span className="text-gradient-aurora">one login away.</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-sm">
              Pick up your trips, jump back into planning, and keep the journey going.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md glass-strong rounded-3xl p-8 space-y-5 shadow-card"
        >
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl gradient-aurora flex items-center justify-center">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Traveloop</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to continue your journey.</p>
          </div>
          <Field
            icon={Mail}
            type="email"
            placeholder="you@traveloop.com"
            value={email}
            onChange={setEmail}
          />
          <Field
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-primary"
              />
              Remember me
            </label>
            <a href="#" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-aurora text-primary-foreground font-semibold py-3 rounded-xl glow hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </button>
          <p className="text-sm text-center text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="glass rounded-xl flex items-center gap-3 px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50 transition">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground"
      />
    </div>
  );
}
