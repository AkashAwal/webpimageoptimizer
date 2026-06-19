"use client";

import { useState } from "react";

const GOALS = [
  { label: "Lose fat", protein: 0.35, carbs: 0.35, fat: 0.30, deficit: -500 },
  { label: "Maintain", protein: 0.30, carbs: 0.40, fat: 0.30, deficit: 0 },
  { label: "Build muscle", protein: 0.30, carbs: 0.45, fat: 0.25, deficit: 250 },
  { label: "Bulk (aggressive)", protein: 0.25, carbs: 0.50, fat: 0.25, deficit: 500 },
];

const ACTIVITY = [
  { label: "Sedentary", mult: 1.2 },
  { label: "Lightly active", mult: 1.375 },
  { label: "Moderately active", mult: 1.55 },
  { label: "Very active", mult: 1.725 },
  { label: "Extremely active", mult: 1.9 },
];

export function MacrosCalculatorClient() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState(2);
  const [goal, setGoal] = useState(1);

  const kg = unit === "metric" ? parseFloat(weight) : (parseFloat(weight) / 2.20462);
  const cm = unit === "metric" ? parseFloat(height) : (parseFloat(height) * 2.54);
  const a = parseInt(age);
  const valid = !isNaN(kg) && !isNaN(cm) && !isNaN(a) && kg > 0 && cm > 0 && a > 0;

  const bmr = valid ? (gender === "male"
    ? 10 * kg + 6.25 * cm - 5 * a + 5
    : 10 * kg + 6.25 * cm - 5 * a - 161) : 0;

  const tdee = bmr * ACTIVITY[activity].mult;
  const targetCals = tdee + GOALS[goal].deficit;
  const g = GOALS[goal];

  const proteinCals = targetCals * g.protein;
  const carbsCals = targetCals * g.carbs;
  const fatCals = targetCals * g.fat;

  const proteinG = proteinCals / 4;
  const carbsG = carbsCals / 4;
  const fatG = fatCals / 9;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setUnit("metric")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "metric" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Metric</button>
          <button onClick={() => setUnit("imperial")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "imperial" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Imperial</button>
          <button onClick={() => setGender("male")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${gender === "male" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Male</button>
          <button onClick={() => setGender("female")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${gender === "female" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Female</button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Age", val: age, set: setAge, ph: "30", type: "number" },
            { label: `Weight (${unit === "metric" ? "kg" : "lbs"})`, val: weight, set: setWeight, ph: unit === "metric" ? "75" : "165", type: "number" },
            { label: `Height (${unit === "metric" ? "cm" : "in"})`, val: height, set: setHeight, ph: unit === "metric" ? "175" : "69", type: "number" },
          ].map(({ label, val, set, ph }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Activity level</label>
          <div className="grid grid-cols-1 gap-1.5">
            {ACTIVITY.map((a, i) => (
              <button key={i} onClick={() => setActivity(i)}
                className={`rounded-xl border px-3 py-2 text-left text-[12px] transition-colors ${activity === i ? "border-foreground bg-foreground text-background" : "border-neutral-200 bg-neutral-50 text-foreground hover:bg-neutral-100"}`}
              >{a.label} (×{a.mult})</button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Goal</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GOALS.map((g, i) => (
              <button key={i} onClick={() => setGoal(i)}
                className={`rounded-xl border px-3 py-2 text-[12px] font-medium transition-colors ${goal === i ? "border-foreground bg-foreground text-background" : "border-neutral-200 bg-neutral-50 text-foreground hover:bg-neutral-100"}`}
              >{g.label}</button>
            ))}
          </div>
        </div>
      </div>

      {valid && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">Daily calorie target</p>
            <p className="text-[48px] font-bold">{Math.round(targetCals)} kcal</p>
            <p className="text-[11px] text-neutral-500 mt-1">TDEE: {Math.round(tdee)} kcal · BMR: {Math.round(bmr)} kcal</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Protein", g: proteinG, pct: Math.round(g.protein * 100), color: "text-blue-600 bg-blue-50 border-blue-200" },
              { label: "Carbs", g: carbsG, pct: Math.round(g.carbs * 100), color: "text-amber-600 bg-amber-50 border-amber-200" },
              { label: "Fat", g: fatG, pct: Math.round(g.fat * 100), color: "text-purple-600 bg-purple-50 border-purple-200" },
            ].map(({ label, g: grams, pct, color }) => (
              <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
                <p className="text-[11px] font-medium opacity-80">{label} ({pct}%)</p>
                <p className="text-[28px] font-bold mt-1">{Math.round(grams)}g</p>
                <p className="text-[10px] opacity-60 mt-0.5">{Math.round(grams * (label === "Fat" ? 9 : 4))} kcal</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
