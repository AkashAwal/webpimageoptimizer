"use client";

import { useState } from "react";

const FORMULAS = [
  { name: "Epley", fn: (w: number, r: number) => w * (1 + r / 30) },
  { name: "Brzycki", fn: (w: number, r: number) => w * (36 / (37 - r)) },
  { name: "Lombardi", fn: (w: number, r: number) => w * Math.pow(r, 0.10) },
  { name: "O'Conner", fn: (w: number, r: number) => w * (1 + r / 40) },
];

const LIFTS = ["Bench Press", "Squat", "Deadlift", "Overhead Press", "Barbell Row", "Other"];

export function OneRepMaxCalculatorClient() {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [lift, setLift] = useState("Bench Press");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const w = parseFloat(weight);
  const r = parseInt(reps);
  const valid = !isNaN(w) && !isNaN(r) && w > 0 && r >= 1 && r <= 30;

  const avg = valid ? FORMULAS.reduce((sum, f) => sum + f.fn(w, r), 0) / FORMULAS.length : 0;
  const u = unit;

  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60].map((pct) => ({
    pct, weight: avg * pct / 100,
    reps: pct === 100 ? 1 : pct >= 95 ? 2 : pct >= 90 ? 3 : pct >= 85 ? 4 : pct >= 80 ? 5 : pct >= 75 ? 7 : pct >= 70 ? 9 : pct >= 65 ? 11 : 13,
  }));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setUnit("kg")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === "kg" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>kg</button>
        <button onClick={() => setUnit("lbs")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === "lbs" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>lbs</button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Exercise</label>
          <div className="flex flex-wrap gap-2">
            {LIFTS.map((l) => (
              <button key={l} onClick={() => setLift(l)} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${lift === l ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Weight lifted ({u})</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="100"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Reps completed</label>
            <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="5" min={1} max={30}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>

        {valid && (
          <div className="rounded-xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">Estimated 1RM</p>
            <p className="text-[56px] font-bold">{avg.toFixed(1)} {u}</p>
          </div>
        )}
      </div>

      {valid && (
        <>
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 grid grid-cols-3 text-[11px] font-medium text-muted-foreground">
              <span>% of 1RM</span><span className="text-center">Weight</span><span className="text-right">~Reps</span>
            </div>
            {percentages.map(({ pct, weight: w2, reps: r2 }) => (
              <div key={pct} className={`grid grid-cols-3 px-4 py-2 border-b border-neutral-50 last:border-0 text-[13px] ${pct === 100 ? "bg-emerald-50" : ""}`}>
                <span className="font-medium text-foreground">{pct}%</span>
                <span className="text-center text-foreground">{w2.toFixed(1)} {u}</span>
                <span className="text-right text-muted-foreground">{r2} rep{r2 !== 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <p className="text-[12px] font-medium text-muted-foreground mb-2">By formula</p>
            {FORMULAS.map((f) => (
              <div key={f.name} className="flex justify-between py-1.5 border-b border-neutral-50 last:border-0 text-[12px]">
                <span className="text-muted-foreground">{f.name}</span>
                <span className="font-medium text-foreground">{f.fn(w, r).toFixed(1)} {u}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
