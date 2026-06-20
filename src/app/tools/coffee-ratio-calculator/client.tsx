"use client";
import { useState } from "react";

const BREW_METHODS = [
  { name: "Espresso", ratioMin: 1 / 2, ratioMax: 1 / 2, note: "1:2 — dense, concentrated", coffeeG: 18 },
  { name: "Pour Over / V60", ratioMin: 1 / 17, ratioMax: 1 / 15, note: "1:15–17 — bright, clean", coffeeG: 20 },
  { name: "French Press", ratioMin: 1 / 15, ratioMax: 1 / 12, note: "1:12–15 — full-bodied", coffeeG: 30 },
  { name: "AeroPress", ratioMin: 1 / 15, ratioMax: 1 / 6, note: "1:6–15 — versatile", coffeeG: 18 },
  { name: "Cold Brew", ratioMin: 1 / 8, ratioMax: 1 / 4, note: "1:4–8 — concentrate", coffeeG: 100 },
  { name: "Drip Machine", ratioMin: 1 / 18, ratioMax: 1 / 15, note: "1:15–18 — everyday", coffeeG: 60 },
  { name: "Moka Pot", ratioMin: 1 / 7, ratioMax: 1 / 7, note: "1:7 — espresso-style", coffeeG: 20 },
  { name: "Turkish Coffee", ratioMin: 1 / 10, ratioMax: 1 / 10, note: "1:10 — fine grind, unfiltered", coffeeG: 8 },
];

export function CoffeeRatioCalculatorClient() {
  const [methodIdx, setMethodIdx] = useState(1);
  const [mode, setMode] = useState<"coffee" | "water">("coffee");
  const [coffeeG, setCoffeeG] = useState(20);
  const [waterMl, setWaterMl] = useState(340);

  const method = BREW_METHODS[methodIdx];
  const ratio = (method.ratioMin + method.ratioMax) / 2;

  const derivedWater = coffeeG / ratio;
  const derivedCoffee = waterMl * ratio;

  const resultWater = mode === "coffee" ? Math.round(derivedWater) : waterMl;
  const resultCoffee = mode === "water" ? Math.round(derivedCoffee) : coffeeG;

  const cups = resultWater / 237;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div>
          <p className="text-[12px] font-medium text-muted-foreground mb-2">Brew Method</p>
          <div className="grid grid-cols-4 gap-1.5">
            {BREW_METHODS.map((m, i) => (
              <button key={m.name} onClick={() => setMethodIdx(i)}
                className={`rounded-xl py-2 px-1 text-[11px] font-medium text-center transition-colors ${methodIdx === i ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
                {m.name}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-muted-foreground mt-2">{method.note}</p>
        </div>

        <div>
          <p className="text-[12px] font-medium text-muted-foreground mb-2">I know my…</p>
          <div className="flex gap-2">
            <button onClick={() => setMode("coffee")}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${mode === "coffee" ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
              Coffee amount → find water
            </button>
            <button onClick={() => setMode("water")}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${mode === "water" ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
              Water amount → find coffee
            </button>
          </div>
        </div>

        {mode === "coffee" ? (
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Coffee (grams)</label>
            <input type="number" min={1} value={coffeeG} onChange={e => setCoffeeG(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        ) : (
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Water (ml)</label>
            <input type="number" min={1} value={waterMl} onChange={e => setWaterMl(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
            <p className="text-[11px] text-emerald-700 font-medium mb-1">Coffee</p>
            <p className="text-[20px] font-semibold text-emerald-800">{resultCoffee}g</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
            <p className="text-[11px] text-emerald-700 font-medium mb-1">Water</p>
            <p className="text-[20px] font-semibold text-emerald-800">{resultWater}ml</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">≈ Cups (8 oz)</p>
            <p className="text-[20px] font-semibold text-foreground">{cups.toFixed(1)}</p>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">All Brew Methods at a Glance</p>
          <div className="space-y-1">
            {BREW_METHODS.map((m, i) => {
              const r = (m.ratioMin + m.ratioMax) / 2;
              return (
                <div key={m.name}
                  className={`flex items-center justify-between py-1.5 text-[13px] border-b border-neutral-100 last:border-0 cursor-pointer hover:bg-neutral-50 rounded px-1 ${methodIdx === i ? "font-semibold" : ""}`}
                  onClick={() => setMethodIdx(i)}>
                  <span className={methodIdx === i ? "text-foreground" : "text-muted-foreground"}>{m.name}</span>
                  <span className={methodIdx === i ? "text-foreground" : "text-muted-foreground"}>{m.note.split("—")[0].trim()}</span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">Coffee-to-water ratios by mass (g:ml). Click a method row to select it. Adjust to taste.</p>
      </div>
    </div>
  );
}
