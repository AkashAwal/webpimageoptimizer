"use client";
import { useState } from "react";

const CATEGORIES_MALE = [
  { min: 55, label: "Superior" },
  { min: 51, label: "Excellent" },
  { min: 45, label: "Good" },
  { min: 38, label: "Fair" },
  { min: 0, label: "Poor" },
];
const CATEGORIES_FEMALE = [
  { min: 49, label: "Superior" },
  { min: 45, label: "Excellent" },
  { min: 38, label: "Good" },
  { min: 31, label: "Fair" },
  { min: 0, label: "Poor" },
];

function getCategory(vo2: number, sex: "male" | "female") {
  const cats = sex === "male" ? CATEGORIES_MALE : CATEGORIES_FEMALE;
  return cats.find(c => vo2 >= c.min)?.label ?? "Poor";
}
function getCategoryColor(cat: string) {
  if (cat === "Superior") return "text-emerald-700 bg-emerald-50 border-emerald-100";
  if (cat === "Excellent") return "text-emerald-700 bg-emerald-50 border-emerald-100";
  if (cat === "Good") return "text-blue-700 bg-blue-50 border-blue-100";
  if (cat === "Fair") return "text-amber-700 bg-amber-50 border-amber-100";
  return "text-red-700 bg-red-50 border-red-100";
}

export function OneMileRunTestClient() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState(75);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  const weightKg = unit === "lbs" ? weight * 0.453592 : weight;
  const timeMinutes = minutes + seconds / 60;
  const sexFactor = sex === "male" ? 1 : 0;

  const vo2max = 88.02 + (3.716 * sexFactor) - (0.1656 * weightKg) - (2.767 * timeMinutes);
  const vo2maxClamped = Math.max(0, vo2max);
  const category = getCategory(vo2maxClamped, sex);
  const catColor = getCategoryColor(category);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="flex gap-2">
          {(["male", "female"] as const).map(s => (
            <button key={s} onClick={() => setSex(s)}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${sex === s ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-medium text-muted-foreground">Body Weight</label>
              <div className="flex gap-1">
                {(["kg", "lbs"] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${unit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground"}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input type="number" min={30} value={weight} onChange={e => setWeight(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">1-Mile Run Time</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input type="number" min={5} max={30} value={minutes} onChange={e => setMinutes(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <p className="text-[11px] text-muted-foreground text-center mt-0.5">min</p>
              </div>
              <div className="flex-1">
                <input type="number" min={0} max={59} value={seconds} onChange={e => setSeconds(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <p className="text-[11px] text-muted-foreground text-center mt-0.5">sec</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-5 text-center ${catColor}`}>
          <p className="text-[11px] font-semibold mb-1">Estimated VO₂max</p>
          <p className="text-[32px] font-semibold">{vo2maxClamped.toFixed(1)}</p>
          <p className="text-[12px] font-medium">ml/kg/min — {category}</p>
        </div>

        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">VO₂max Fitness Categories ({sex})</p>
          <div className="space-y-1">
            {(sex === "male" ? CATEGORIES_MALE : CATEGORIES_FEMALE).map(c => (
              <div key={c.label} className={`flex justify-between items-center py-1.5 text-[13px] border-b border-neutral-100 last:border-0 ${category === c.label ? "font-semibold text-foreground" : ""}`}>
                <span className={category === c.label ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                <span className={category === c.label ? "text-foreground" : "text-muted-foreground"}>≥ {c.min} ml/kg/min{category === c.label ? " ← you" : ""}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">George et al. (1993) non-exercise formula. Most accurate for adults aged 18–65. Not a substitute for clinical testing.</p>
      </div>
    </div>
  );
}
