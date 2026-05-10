import tropical from "@/assets/hero-tropical.jpg";
import mountains from "@/assets/dest-mountains.jpg";
import santorini from "@/assets/dest-santorini.jpg";
import tokyo from "@/assets/dest-tokyo.jpg";
import bali from "@/assets/dest-bali.jpg";
import iceland from "@/assets/dest-iceland.jpg";
import dubai from "@/assets/dest-dubai.jpg";

export const destImages = { tropical, mountains, santorini, tokyo, bali, iceland, dubai };

export const popularDestinations = [
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    image: santorini,
    cost: "$$$",
    weather: "26°C ☀️",
    tags: ["Beach", "Romantic"],
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    image: tokyo,
    cost: "$$$$",
    weather: "18°C 🌸",
    tags: ["Cultural", "Food"],
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: bali,
    cost: "$$",
    weather: "29°C 🌴",
    tags: ["Nature", "Spiritual"],
  },
  {
    id: "iceland",
    name: "Reykjavík",
    country: "Iceland",
    image: iceland,
    cost: "$$$$",
    weather: "-2°C ❄️",
    tags: ["Adventure", "Nature"],
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    image: dubai,
    cost: "$$$$",
    weather: "32°C 🌇",
    tags: ["Luxury", "Shopping"],
  },
  {
    id: "swiss",
    name: "Swiss Alps",
    country: "Switzerland",
    image: mountains,
    cost: "$$$$",
    weather: "5°C 🏔️",
    tags: ["Mountains", "Adventure"],
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    image: tropical,
    cost: "$$$$",
    weather: "30°C 🏝️",
    tags: ["Luxury", "Beach"],
  },
];

export function pickImageForDestination(dest: string): string {
  const d = (dest || "").toLowerCase();
  if (d.includes("santorini") || d.includes("greece")) return santorini;
  if (d.includes("tokyo") || d.includes("japan") || d.includes("kyoto")) return tokyo;
  if (d.includes("bali") || d.includes("indonesia")) return bali;
  if (d.includes("iceland") || d.includes("reykjavik")) return iceland;
  if (d.includes("dubai") || d.includes("uae")) return dubai;
  if (d.includes("alps") || d.includes("swiss") || d.includes("mountain")) return mountains;
  return tropical;
}
