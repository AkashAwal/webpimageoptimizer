"use client";
import { useState } from "react";

function calcBMR(weight: number, height: number, age: number, sex: "male" | "female") {
  if (sex === "male") return 10 * weight + 6.25 * height - 5 * age + 5;
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

const ACTIVITY = [
  { label: "Sedentary", sub: "Little/no exercise", factor: 1.2 },
  { label: "Light", sub: "1–3 days/week", factor: 1.375 },
  { label: "Moderate", sub: "3–5 days/week", factor: 1.55 },
  { label: "Active", sub: "6–7 days/week", factor: 1.725 },
  { label: "Very Active", sub: "Physical job + exercise", factor: 1.9 },
];

export function KetoMacroCalculatorClient() {
  const [weight, setWeight] = useState(75);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [height, setHeight] = useState(170);
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<"male" | "female">("male");
  const [activityIdx, setActivityIdx] = useState(2);
  const [goal, setGoal] = useState<"maintain" | "lose" | "aggressive">("lose");

  const weightKg = unit === "lbs" ? weight * 0.453592 : weight;
  const heightCm = heightUnit === "in" ? height * 2.54 : height;
  const bmr = calcBMR(weightKg, heightCm, age, sex);
  const tdee = bmr * ACTIVITY[activityIdx].factor;
  const targetCalories = goal === "maintain" ? tdee : goal === "lose" ? tdee - 500 : tdee - 1000;

  const carbsPct = 0.05, proteinPct = 0.25, fatPct = 0.70;
  const carbsG = (targetCalories * carbsPct) / 4;
  const proteinG = (targetCalories * proteinPct) / 4;
  const fatG = (targetCalories * fatPct) / 9;

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
              <label className="text-[12px] font-medium text-muted-foreground">Weight</label>
              <div className="flex gap-1">
                {(["kg", "lbs"] as const).map(u => (
                  <button key={u} onClick={() => setUnit(u)}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${unit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground"}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input type="number" min={20} value={weight} onChange={e => setWeight(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-medium text-muted-foreground">Height</label>
              <div className="flex gap-1">
                {(["cm", "in"] as const).map(u => (
                  <button key={u} onClick={() => setHeightUnit(u)}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${heightUnit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground"}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <input type="number" min={100} value={height} onChange={e => setHeight(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Age</label>
            <input type="number" min={10} max={100} value={age} onChange={e => setAge(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium text-muted-foreground mb-2">Activity Level</p>
          <div className="grid grid-cols-5 gap-1.5">
            {ACTIVITY.map((a, i) => (
              <button key={i} onClick={() => setActivityIdx(i)}
                className={`rounded-xl py-2 px-1 text-center text-[11px] font-medium transition-colors ${activityIdx === i ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium text-muted-foreground mb-2">Goal</p>
          <div className="flex gap-2">
            {[
              { v: "maintain", l: "Maintain" },
              { v: "lose", l: "Lose (−500 kcal)" },
              { v: "aggressive", l: "Aggressive (−1000 kcal)" },
            ].map(g => (
              <button key={g.v} onClick={() => setGoal(g.v as "maintain" | "lose" | "aggressive")}
                className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${goal === g.v ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
                {g.l}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <p className="text-[12px] font-semibold text-emerald-700 mb-3">Daily Keto Targets — {Math.round(targetCalories)} kcal/day</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Carbs (5%)", g: carbsG, color: "text-emerald-800", sub: "Max net carbs: 20–50g/day" },
              { label: "Protein (25%)", g: proteinG, color: "text-emerald-800", sub: null },
              { label: "Fat (70%)", g: fatG, color: "text-emerald-800", sub: null },
            ].map(m => (
              <div key={m.label} className="text-center">
                <p className="text-[11px] text-emerald-700 font-medium mb-1">{m.label}</p>
                <p className={`text-[20px] font-semibold ${m.color}`}>{Math.round(m.g)}g</p>
                {m.sub && <p className="text-[10px] text-emerald-600">{m.sub}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-[13px]">
          {[
            { label: "BMR (Mifflin-St Jeor)", val: `${Math.round(bmr)} kcal` },
            { label: `TDEE (${ACTIVITY[activityIdx].label})`, val: `${Math.round(tdee)} kcal` },
            { label: "Target calories", val: `${Math.round(targetCalories)} kcal` },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-neutral-100 last:border-0">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-medium text-foreground">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
