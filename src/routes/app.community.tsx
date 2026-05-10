import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { Heart, MessageCircle, Copy } from "lucide-react";
import { popularDestinations } from "@/lib/destinations";

export const Route = createFileRoute("/app/community")({ component: CommunityPage });

const posts = popularDestinations.slice(0, 5).map((d, i) => ({
  ...d,
  user: ["Maya R.", "Jordan K.", "Aiko T.", "Liam P.", "Sofia M."][i],
  caption: [
    "7 magical days under the sun ✨",
    "A trip that changed me 🌸",
    "Hidden gems and good food 🍜",
    "Adventure of a lifetime 🏔️",
    "City lights and dreams 🌇",
  ][i],
  likes: 120 + i * 47,
  comments: 8 + i * 3,
}));

function CommunityPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-3xl font-bold">Community</h1>
      {posts.map((p, i) => (
        <GlassCard key={p.id} delay={i * 0.05} className="!p-0 overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full gradient-aurora flex items-center justify-center text-xs font-bold text-primary-foreground">
              {p.user[0]}
            </div>
            <div>
              <p className="text-sm font-medium">{p.user}</p>
              <p className="text-xs text-muted-foreground">visited {p.name}</p>
            </div>
          </div>
          <img src={p.image} alt="" className="aspect-video w-full object-cover" />
          <div className="p-4">
            <p className="text-sm">{p.caption}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <button className="flex items-center gap-1 hover:text-primary">
                <Heart className="h-3.5 w-3.5" /> {p.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-primary">
                <MessageCircle className="h-3.5 w-3.5" /> {p.comments}
              </button>
              <button className="ml-auto flex items-center gap-1 text-primary hover:underline">
                <Copy className="h-3.5 w-3.5" /> Copy this trip
              </button>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
