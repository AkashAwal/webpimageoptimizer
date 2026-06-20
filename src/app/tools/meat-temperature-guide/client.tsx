"use client";
import { useState } from "react";

const MEAT_TEMPS = [
  {
    category: "Beef & Lamb",
    items: [
      { name: "Steaks & Roasts — Rare", f: 125, c: 52, note: "Cool red center", color: "bg-red-100 text-red-800 border-red-200" },
      { name: "Steaks & Roasts — Medium Rare", f: 135, c: 57, note: "Warm red center", color: "bg-rose-100 text-rose-800 border-rose-200" },
      { name: "Steaks & Roasts — Medium", f: 145, c: 63, note: "Warm pink center · USDA minimum", color: "bg-pink-100 text-pink-800 border-pink-200" },
      { name: "Steaks & Roasts — Medium Well", f: 155, c: 68, note: "Slightly pink center", color: "bg-orange-100 text-orange-800 border-orange-200" },
      { name: "Steaks & Roasts — Well Done", f: 165, c: 74, note: "No pink", color: "bg-amber-100 text-amber-800 border-amber-200" },
      { name: "Ground Beef / Burgers", f: 160, c: 71, note: "USDA minimum — no pink test", color: "bg-amber-100 text-amber-800 border-amber-200" },
    ],
  },
  {
    category: "Poultry",
    items: [
      { name: "Whole chicken / turkey", f: 165, c: 74, note: "USDA minimum — juices run clear", color: "bg-amber-100 text-amber-800 border-amber-200" },
      { name: "Chicken breast", f: 165, c: 74, note: "USDA minimum", color: "bg-amber-100 text-amber-800 border-amber-200" },
      { name: "Chicken thighs / legs", f: 165, c: 74, note: "Better at 175°F / 79°C", color: "bg-amber-100 text-amber-800 border-amber-200" },
      { name: "Ground turkey / chicken", f: 165, c: 74, note: "USDA minimum", color: "bg-amber-100 text-amber-800 border-amber-200" },
    ],
  },
  {
    category: "Pork",
    items: [
      { name: "Pork chops / roast / loin", f: 145, c: 63, note: "USDA minimum (2011 update) + 3 min rest", color: "bg-pink-100 text-pink-800 border-pink-200" },
      { name: "Ground pork", f: 160, c: 71, note: "USDA minimum", color: "bg-amber-100 text-amber-800 border-amber-200" },
      { name: "Pork ribs", f: 190, c: 88, note: "Best for fall-off-bone tenderness", color: "bg-amber-100 text-amber-800 border-amber-200" },
      { name: "Pulled pork / shoulder", f: 203, c: 95, note: "Best for pulling", color: "bg-amber-100 text-amber-800 border-amber-200" },
    ],
  },
  {
    category: "Fish & Seafood",
    items: [
      { name: "Fish (finfish)", f: 145, c: 63, note: "USDA minimum — flesh flakes with fork", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { name: "Salmon (medium)", f: 125, c: 52, note: "Moist; not USDA minimum", color: "bg-sky-100 text-sky-800 border-sky-200" },
      { name: "Shrimp / scallops", f: 145, c: 63, note: "Opaque and firm", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { name: "Lobster / crab", f: 145, c: 63, note: "Opaque and firm", color: "bg-blue-100 text-blue-800 border-blue-200" },
    ],
  },
  {
    category: "Eggs & Other",
    items: [
      { name: "Whole eggs (cooked dishes)", f: 160, c: 71, note: "Firm yolk and white", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      { name: "Ham (fresh)", f: 145, c: 63, note: "USDA minimum + 3 min rest", color: "bg-pink-100 text-pink-800 border-pink-200" },
      { name: "Ham (pre-cooked, reheating)", f: 140, c: 60, note: "Just to heat through", color: "bg-pink-100 text-pink-800 border-pink-200" },
      { name: "Stuffing (inside or outside bird)", f: 165, c: 74, note: "Must reach poultry temp", color: "bg-amber-100 text-amber-800 border-amber-200" },
    ],
  },
];

export function MeatTemperatureGuideClient() {
  const [displayUnit, setDisplayUnit] = useState<"f" | "c">("f");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = MEAT_TEMPS.filter(g => !activeCategory || g.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setActiveCategory(null)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${!activeCategory ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>
              All
            </button>
            {MEAT_TEMPS.map(g => (
              <button key={g.category} onClick={() => setActiveCategory(activeCategory === g.category ? null : g.category)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${activeCategory === g.category ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>
                {g.category}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-3 shrink-0">
            {(["f", "c"] as const).map(u => (
              <button key={u} onClick={() => setDisplayUnit(u)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${displayUnit === u ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700"}`}>
                °{u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {filtered.map(group => (
            <div key={group.category}>
              <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">{group.category}</p>
              <div className="space-y-1.5">
                {group.items.map(item => (
                  <div key={item.name} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${item.color}`}>
                    <span className="text-[13px] font-semibold w-10 shrink-0">
                      {displayUnit === "f" ? `${item.f}°F` : `${item.c}°C`}
                    </span>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium">{item.name}</p>
                      <p className="text-[11px] opacity-75">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">Based on USDA safe minimum internal temperatures. Always use a calibrated meat thermometer. Rest meat 3–5 minutes after cooking.</p>
      </div>
    </div>
  );
}
