"use client";

import { useState } from "react";

const GOALS = [
  { label: "Sedentary / general health", gPerKg: 0.8, desc: "WHO minimum for adults" },
  { label: "Light activity", gPerKg: 1.0, desc: "Light exercise 1–2×/week" },
  { label: "Moderate fitness", gPerKg: 1.3, desc: "Exercise 3–4×/week" },
  { label: "Active / endurance sport", gPerKg: 1.6, desc: "Regular cardio training" },
  { label: "Muscle building", gPerKg: 2.0, desc: "Strength training, gaining mass" },
  { label: "Cutting (fat loss, preserve muscle)", gPerKg: 2.4, desc: "High protein during caloric deficit" },
];

export function ProteinIntakeCalculatorClient() {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [weight, setWeight] = useState("");
  const [goalIdx, setGoalIdx] = useState(4);

  const kg = unit === "kg" ? parseFloat(weight) : (parseFloat(weight) / 2.20462);
  const valid = !isNaN(kg) && kg > 20 && kg < 300;

  const goal = GOALS[goalIdx];
  const grams = valid ? kg * goal.gPerKg : 0;
  const calories = grams * 4;

  const sources = [
    { food: "Chicken breast (cooked)", gPer100g: 31 },
    { food: "Eggs (1 large)", gPer100g: 6 },
    { food: "Greek yoghurt (full fat)", gPer100g: 10 },
    { food: "Canned tuna", gPer100g: 25 },
    { food: "Cottage cheese", gPer100g: 11 },
    { food: "Whey protein (1 scoop)", gPer100g: 25 },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-muted-foreground">Body weight</label>
            <div className="flex gap-1">
              <button onClick={() => setUnit("kg")} className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${unit === "kg" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-600"}`}>kg</button>
              <button onClick={() => setUnit("lbs")} className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${unit === "lbs" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-600"}`}>lbs</button>
            </div>
          </div>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "kg" ? "75" : "165"}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Goal / activity level</label>
          <div className="space-y-1.5">
            {GOALS.map((g, i) => (
              <button key={i} onClick={() => setGoalIdx(i)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${goalIdx === i ? "border-foreground bg-foreground text-background" : "border-neutral-200 bg-neutral-50 text-foreground hover:bg-neutral-100"}`}>
                <p className="text-[13px] font-medium">{g.label}</p>
                <p className={`text-[11px] mt-0.5 ${goalIdx === i ? "text-neutral-400" : "text-muted-foreground"}`}>{g.desc} · {g.gPerKg} g/kg</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {valid && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">Daily protein target</p>
            <p className="text-[56px] font-bold">{Math.round(grams)}g</p>
            <p className="text-[11px] text-neutral-500 mt-1">{goal.gPerKg} g/kg · {Math.round(calories)} kcal from protein</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <p className="text-[12px] font-medium text-muted-foreground mb-2">How many servings to hit your target?</p>
            {sources.map(({ food, gPer100g }) => (
              <div key={food} className="flex justify-between py-1.5 border-b border-neutral-50 last:border-0 text-[12px]">
                <span className="text-muted-foreground">{food}</span>
                <span className="font-medium text-foreground">{(grams / gPer100g).toFixed(1)} servings</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
