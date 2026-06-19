"use client";

import { useState } from "react";

const ACTIVITY_LEVELS = [
  { label: "Sedentary (office job, no exercise)", mult: 30 },
  { label: "Light activity (1–2 days/week)", mult: 33 },
  { label: "Moderate (3–5 days/week)", mult: 35 },
  { label: "Very active (6–7 days/week)", mult: 38 },
  { label: "Athlete (2× daily training)", mult: 40 },
];

export function WaterIntakeCalculatorClient() {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState(0);
  const [hotClimate, setHotClimate] = useState(false);

  const kg = unit === "kg" ? parseFloat(weight) : (parseFloat(weight) / 2.20462);
  const valid = !isNaN(kg) && kg > 20 && kg < 300;

  const mlPerKg = ACTIVITY_LEVELS[activity].mult;
  let ml = valid ? kg * mlPerKg : 0;
  if (hotClimate) ml += 500;

  const litres = ml / 1000;
  const cups = ml / 237;
  const floz = ml / 29.574;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setUnit("kg")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "kg" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>kg</button>
          <button onClick={() => setUnit("lbs")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "lbs" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>lbs</button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Body weight ({unit})</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "kg" ? "70" : "154"}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Activity level</label>
          <div className="space-y-1.5">
            {ACTIVITY_LEVELS.map((a, i) => (
              <button key={i} onClick={() => setActivity(i)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-[13px] transition-colors ${activity === i ? "border-foreground bg-foreground text-background" : "border-neutral-200 bg-neutral-50 text-foreground hover:bg-neutral-100"}`}
              >{a.label}</button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={hotClimate} onChange={(e) => setHotClimate(e.target.checked)} className="w-4 h-4 accent-neutral-900" />
          <span className="text-[13px] text-foreground">Hot/humid climate (+500 ml)</span>
        </label>
      </div>

      {valid && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center">
          <p className="text-[12px] text-neutral-400 mb-2">Recommended daily water intake</p>
          <p className="text-[56px] font-bold">{litres.toFixed(1)} L</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/10 p-3 text-center">
              <p className="text-[18px] font-bold">{Math.round(cups)} cups</p>
              <p className="text-[10px] text-neutral-400">8 fl oz cups</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3 text-center">
              <p className="text-[18px] font-bold">{Math.round(floz)} fl oz</p>
              <p className="text-[10px] text-neutral-400">fluid ounces</p>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3">{Math.round(ml).toLocaleString()} mL · {mlPerKg} mL/kg formula{hotClimate ? " + hot climate" : ""}</p>
        </div>
      )}
      <p className="text-[12px] text-muted-foreground">This estimate includes water from all sources (drinks and food). About 20% of water intake typically comes from food.</p>
    </div>
  );
}
