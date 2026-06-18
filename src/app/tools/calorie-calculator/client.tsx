"use client";

import { useState } from "react";

type Sex = "male" | "female";
type Unit = "metric" | "imperial";

const ACTIVITIES = [
  { id: "sedentary", label: "Sedentary", desc: "Little or no exercise", factor: 1.2 },
  { id: "light", label: "Lightly active", desc: "Exercise 1–3 days/week", factor: 1.375 },
  { id: "moderate", label: "Moderately active", desc: "Exercise 3–5 days/week", factor: 1.55 },
  { id: "very", label: "Very active", desc: "Hard exercise 6–7 days/week", factor: 1.725 },
  { id: "extra", label: "Extra active", desc: "Very hard exercise + physical job", factor: 1.9 },
];

export function CalorieCalculatorClient() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("metric");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("moderate");

  const a = parseFloat(age) || 0;
  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) || 0;
  const hin = parseFloat(heightIn) || 0;

  let bmr = 0;
  if (a > 0 && w > 0 && h > 0) {
    let weightKg = unit === "metric" ? w : w * 0.453592;
    let heightCm = unit === "metric" ? h : h * 30.48 + hin * 2.54;

    if (sex === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * a + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
    }
  }

  const activityFactor = ACTIVITIES.find((x) => x.id === activity)?.factor ?? 1.55;
  const tdee = bmr > 0 ? bmr * activityFactor : 0;

  const goals = bmr > 0
    ? [
        { label: "Lose weight (−500 kcal)", cal: tdee - 500, color: "text-blue-400" },
        { label: "Maintain weight", cal: tdee, color: "text-emerald-400" },
        { label: "Gain weight (+500 kcal)", cal: tdee + 500, color: "text-amber-400" },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            {(["male", "female"] as const).map((s) => (
              <button key={s} onClick={() => setSex(s)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium capitalize transition-colors ${sex === s ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
              >{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["metric", "imperial"] as const).map((u) => (
              <button key={u} onClick={() => { setUnit(u); setHeight(""); setHeightIn(""); setWeight(""); }}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === u ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
              >{u === "metric" ? "Metric" : "Imperial"}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Age (years)</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">
              {unit === "metric" ? "Height (cm)" : "Height (ft)"}
            </label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === "metric" ? "175" : "5"}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          {unit === "imperial" ? (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Inches</label>
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="10"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
            </div>
          ) : null}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">
              {unit === "metric" ? "Weight (kg)" : "Weight (lb)"}
            </label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "70" : "154"}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-medium text-muted-foreground">Activity level</label>
          <div className="space-y-1.5">
            {ACTIVITIES.map((act) => (
              <button key={act.id} onClick={() => setActivity(act.id)}
                className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors border ${activity === act.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-foreground"}`}
              >
                <span className="text-[13px] font-medium">{act.label}</span>
                <span className={`ml-2 text-[12px] ${activity === act.id ? "text-neutral-400" : "text-muted-foreground"}`}>{act.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {bmr > 0 && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-neutral-400 mb-1">BMR (at rest)</p>
              <p className="text-[24px] font-bold">{Math.round(bmr).toLocaleString()}</p>
              <p className="text-[11px] text-neutral-400">kcal / day</p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-400 mb-1">TDEE (maintenance)</p>
              <p className="text-[24px] font-bold">{Math.round(tdee).toLocaleString()}</p>
              <p className="text-[11px] text-neutral-400">kcal / day</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2">
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wide">Calorie targets</p>
            {goals.map((g) => (
              <div key={g.label} className="flex justify-between items-center">
                <span className="text-[13px] text-neutral-300">{g.label}</span>
                <span className={`text-[15px] font-bold ${g.color}`}>{Math.round(g.cal).toLocaleString()} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
