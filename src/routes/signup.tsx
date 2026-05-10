import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plane, Mail, Lock, User as UserIcon, Globe2, Loader2 } from "lucide-react";
import hero from "@/assets/dest-santorini.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (user) navigate({ to: "/app/dashboard" });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    const redirectTo = `${window.location.origin}/app/dashboard`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { first_name: first, last_name: last, country },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! Redirecting…");
    navigate({ to: "/app/dashboard" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 order-2 lg:order-1">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md glass-strong rounded-3xl p-8 space-y-4 shadow-card"
        >
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="h-9 w-9 rounded-xl gradient-aurora flex items-center justify-center">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Traveloop</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start planning smarter trips today.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field icon={UserIcon} placeholder="First name" value={first} onChange={setFirst} />
            <Field icon={UserIcon} placeholder="Last name" value={last} onChange={setLast} />
          </div>
          <Field icon={Mail} type="email" placeholder="Email" value={email} onChange={setEmail} />
          <Field icon={Globe2} placeholder="Country" value={country} onChange={setCountry} />
          <Field
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
          <Field
            icon={Lock}
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={setConfirm}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-aurora text-primary-foreground font-semibold py-3 rounded-xl glow hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
          </button>
          <p className="text-sm text-center text-muted-foreground">
            Already have one?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>
      <div className="relative hidden lg:block order-1 lg:order-2">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          width={1024}
          height={768}
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-background/30 via-background/50 to-background/80" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 ml-auto">
            <div className="h-9 w-9 rounded-xl gradient-aurora flex items-center justify-center glow">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Traveloop</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Every great trip
              <br />
              <span className="text-gradient-aurora">starts with a click.</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-sm">
              Join travelers using AI to plan smarter, save more, and explore further.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  icon: React.ElementType;
  type?: string;
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
        className="bg-transparent outline-none flex-1 text-sm placeholder:text-muted-foreground min-w-0"
      />
    </div>
  );
}
