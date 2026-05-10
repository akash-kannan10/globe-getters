import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  budget: z.number(),
  currency: z.string().default("USD"),
  days: z.number(),
  mood: z.string(),
  climate: z.string().optional(),
  transport: z.string().optional(),
  pace: z.string().optional(),
  interests: z.array(z.string()).default([]),
  departure: z.string().optional(),
  travelers: z.number().default(1),
  hotelTier: z.string().optional(),
  notes: z.string().optional(),
});

const TripPlanSchema = {
  type: "object",
  properties: {
    destination: { type: "string" },
    destinationReason: { type: "string" },
    matchScore: { type: "number" },
    weatherSummary: { type: "string" },
    totalEstimatedCost: { type: "string" },
    budgetBreakdown: {
      type: "object",
      properties: {
        transport: { type: "string" },
        hotel: { type: "string" },
        food: { type: "string" },
        activities: { type: "string" },
      },
      required: ["transport", "hotel", "food", "activities"],
      additionalProperties: false,
    },
    packingChecklist: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["category", "items"],
        additionalProperties: false,
      },
    },
    travelTips: { type: "array", items: { type: "string" } },
    hiddenGems: { type: "array", items: { type: "string" } },
    photoSpots: { type: "array", items: { type: "string" } },
    foodsToTry: { type: "array", items: { type: "string" } },
    hotelSuggestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          priceRange: { type: "string" },
          rating: { type: "number" },
        },
        required: ["name", "priceRange", "rating"],
        additionalProperties: false,
      },
    },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          title: { type: "string" },
          city: { type: "string" },
          estimatedCost: { type: "string" },
          travelNotes: { type: "string" },
          foodSuggestions: { type: "array", items: { type: "string" } },
          activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                time: { type: "string" },
                activity: { type: "string" },
                description: { type: "string" },
                estimatedCost: { type: "string" },
              },
              required: ["time", "activity", "description", "estimatedCost"],
              additionalProperties: false,
            },
          },
        },
        required: [
          "day",
          "title",
          "city",
          "estimatedCost",
          "travelNotes",
          "foodSuggestions",
          "activities",
        ],
        additionalProperties: false,
      },
    },
  },
  required: [
    "destination",
    "destinationReason",
    "matchScore",
    "weatherSummary",
    "totalEstimatedCost",
    "budgetBreakdown",
    "packingChecklist",
    "travelTips",
    "hiddenGems",
    "photoSpots",
    "foodsToTry",
    "hotelSuggestions",
    "days",
  ],
  additionalProperties: false,
} as const;

export const generateTrip = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.globegetters_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    const sys = `You are Traveloop's expert AI travel planner. Generate a complete personalized trip plan in strict JSON via the provided tool. Be realistic, specific, and inspiring. Costs should be in ${data.currency} and reflect the user's budget. Use real city/restaurant names. Day count must equal ${data.days}.`;

    const userPrompt = `Plan a trip with:
- Budget: ${data.budget} ${data.currency} total
- Duration: ${data.days} days
- Travelers: ${data.travelers}
- Mood: ${data.mood}
- Climate preference: ${data.climate ?? "any"}
- Transport: ${data.transport ?? "any"}
- Pace: ${data.pace ?? "balanced"}
- Interests: ${data.interests.join(", ") || "varied"}
- Departure from: ${data.departure ?? "unspecified"}
- Hotel tier: ${data.hotelTier ?? "standard"}
- Notes: ${data.notes ?? "none"}

Pick the SINGLE best destination matching these. Provide a match score 80-99.`;

    const res = await fetch("https://ai.gateway.globegetters.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "build_trip_plan",
              description: "Return the structured trip plan",
              parameters: TripPlanSchema,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "build_trip_plan" } },
      }),
    });

    if (!res.ok) {
      if (res.status === 429)
        return { error: "Rate limit reached. Please try again in a moment.", plan: null };
      if (res.status === 402)
        return { error: "AI credits exhausted. Add funds in Workspace settings.", plan: null };
      const txt = await res.text();
      console.error("AI gateway error", res.status, txt);
      return { error: "Failed to generate trip", plan: null };
    }

    const json = await res.json();
    const tool = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!tool) return { error: "AI returned no plan", plan: null };
    try {
      const plan = JSON.parse(tool.function.arguments);
      return { error: null, plan };
    } catch (e) {
      console.error("parse error", e);
      return { error: "Failed to parse AI response", plan: null };
    }
  });
