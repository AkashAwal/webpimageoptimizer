"use client";

import { useState } from "react";

type Unit = "metric" | "imperial";

const CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "text-blue-600 bg-blue-50" },
  { max: 25, label: "Normal weight", color: "text-emerald-600 bg-emerald-50" },
  { max: 30, label: "Overweight", color: "text-amber-600 bg-amber-50" },
  { max: Infinity, label: "Obese", color: "text-red-600 bg-red-50" },
];

function getCategory(bmi: number) {
  return CATEGORIES.find((c) => bmi < c.max)!;
}

export function BmiCalculatorClient() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");

  let bmi: number | null = null;
  const h = parseFloat(height);
  const w = parseFloat(weight);
  const hin = parseFloat(heightIn) || 0;

  if (unit === "metric" && h > 0 && w > 0) {
    const hm = h / 100;
    bmi = w / (hm * hm);
  } else if (unit === "imperial" && h > 0 && w > 0) {
    const totalInches = h * 12 + hin;
    bmi = (w / (totalInches * totalInches)) * 703;
  }

  const category = bmi !== null ? getCategory(bmi) : null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-5">
      <div className="flex gap-2">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            onClick={() => { setUnit(u); setHeight(""); setHeightIn(""); setWeight(""); }}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors capitalize ${
              unit === u
                ? "bg-foreground text-background"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft / lb)"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">
            {unit === "metric" ? "Height (cm)" : "Height (ft)"}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === "metric" ? "175" : "5"}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>
        {unit === "imperial" && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Inches</label>
            <input
              type="number"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              placeholder="10"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">
            {unit === "metric" ? "Weight (kg)" : "Weight (lb)"}
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === "metric" ? "70" : "154"}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>
      </div>

      {bmi !== null && category && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-2">
          <div className="text-[42px] font-bold leading-none">{bmi.toFixed(1)}</div>
          <div className={`inline-flex rounded-full px-3 py-1 text-[13px] font-semibold ${category.color}`}>
            {category.label}
          </div>
          <p className="text-[12px] text-neutral-400 pt-1">
            BMI is a screening tool. It does not diagnose body fatness or health. Consult a healthcare professional for personalised assessment.
          </p>
        </div>
      )}

      <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
        <p className="text-[12px] font-medium text-foreground mb-2">WHO BMI classification</p>
        <div className="space-y-1">
          {CATEGORIES.map((c) => (
            <div key={c.label} className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">{c.label}</span>
              <span className={`rounded-full px-2 py-0.5 font-medium ${c.color}`}>
                {c.max === Infinity ? "≥ 30" : c.label === "Underweight" ? "< 18.5" : `${c.max - 6.4} – ${c.max - 0.1}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
