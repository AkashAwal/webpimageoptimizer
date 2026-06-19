"use client";

import { useState } from "react";

const EXERCISES = [
  { label: "Walking (3.5 mph)", met: 4.3, category: "Cardio" },
  { label: "Walking (4.5 mph, brisk)", met: 6.0, category: "Cardio" },
  { label: "Running (5 mph / 8 min mile)", met: 8.3, category: "Running" },
  { label: "Running (6 mph / 10 kph)", met: 10.0, category: "Running" },
  { label: "Running (8 mph)", met: 13.5, category: "Running" },
  { label: "Cycling (12–14 mph, moderate)", met: 8.0, category: "Cycling" },
  { label: "Cycling (16–19 mph, vigorous)", met: 12.0, category: "Cycling" },
  { label: "Swimming laps (moderate)", met: 6.0, category: "Swimming" },
  { label: "Swimming laps (vigorous)", met: 9.8, category: "Swimming" },
  { label: "Rowing (moderate)", met: 7.0, category: "Cardio" },
  { label: "Jump rope", met: 11.8, category: "Cardio" },
  { label: "HIIT", met: 8.0, category: "Cardio" },
  { label: "Aerobics (general)", met: 7.3, category: "Cardio" },
  { label: "Weight training (moderate)", met: 3.5, category: "Strength" },
  { label: "Weight training (vigorous)", met: 6.0, category: "Strength" },
  { label: "Yoga", met: 3.0, category: "Flexibility" },
  { label: "Pilates", met: 3.5, category: "Flexibility" },
  { label: "Basketball", met: 8.0, category: "Sports" },
  { label: "Soccer", met: 10.0, category: "Sports" },
  { label: "Tennis", met: 8.0, category: "Sports" },
  { label: "Dancing (general)", met: 5.5, category: "Dance" },
  { label: "Elliptical (moderate)", met: 5.0, category: "Cardio" },
  { label: "Stair climbing", met: 9.0, category: "Cardio" },
  { label: "Hiking", met: 6.0, category: "Outdoor" },
  { label: "Rock climbing", met: 11.0, category: "Outdoor" },
];

export function CalorieBurnCalculatorClient() {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [exerciseIdx, setExerciseIdx] = useState(0);

  const kg = unit === "kg" ? parseFloat(weight) : (parseFloat(weight) / 2.20462);
  const mins = parseFloat(duration);
  const valid = !isNaN(kg) && !isNaN(mins) && kg > 0 && mins > 0;

  const met = EXERCISES[exerciseIdx].met;
  const calories = valid ? (met * 3.5 * kg / 200) * mins : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="grid grid-cols-2 gap-3">
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
            <label className="text-[12px] font-medium text-muted-foreground">Duration (minutes)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Exercise type (MET: {met})</label>
          <select value={exerciseIdx} onChange={(e) => setExerciseIdx(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors">
            {EXERCISES.map((ex, i) => (
              <option key={i} value={i}>{ex.label} (MET {ex.met})</option>
            ))}
          </select>
        </div>

        {valid && (
          <div className="rounded-xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">Estimated calories burned</p>
            <p className="text-[56px] font-bold">{Math.round(calories)}</p>
            <p className="text-[12px] text-neutral-400">kcal · {mins} min of {EXERCISES[exerciseIdx].label}</p>
          </div>
        )}
      </div>

      {valid && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <p className="text-[12px] font-medium text-muted-foreground mb-2">Equivalent food energy</p>
          {[
            { food: "Big Mac", kcal: 550 },
            { food: "Banana", kcal: 105 },
            { food: "Slice of pizza", kcal: 285 },
            { food: "Can of Coke", kcal: 140 },
          ].map(({ food, kcal }) => (
            <div key={food} className="flex justify-between py-1.5 border-b border-neutral-50 last:border-0 text-[12px]">
              <span className="text-muted-foreground">{food} ({kcal} kcal)</span>
              <span className="font-medium text-foreground">{(calories / kcal).toFixed(1)}×</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-[12px] text-muted-foreground">Formula: Calories = MET × 3.5 × weight(kg) / 200 × time(min). Estimates vary based on fitness level and individual metabolism.</p>
    </div>
  );
}
