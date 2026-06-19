"use client";
import { useState } from "react";

const KCAL_PER_KG = 7700;
const KCAL_PER_LB = 3500;

export function CaloricDeficitCalculatorClient() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [currentWeight, setCurrentWeight] = useState(80);
  const [targetWeight, setTargetWeight] = useState(72);
  const [tdee, setTdee] = useState(2200);
  const [dailyIntake, setDailyIntake] = useState(1700);

  const deficit = tdee - dailyIntake;
  const weeklyDeficit = deficit * 7;

  const kcalPerUnit = unit === "metric" ? KCAL_PER_KG : KCAL_PER_LB;
  const weightToLose = Math.max(0, currentWeight - targetWeight);
  const totalKcal = weightToLose * kcalPerUnit;

  const weeklyLoss = deficit > 0 ? weeklyDeficit / kcalPerUnit : 0;
  const weeksToGoal = deficit > 0 ? totalKcal / weeklyDeficit : 0;
  const daysToGoal = weeksToGoal * 7;

  const months = Math.floor(weeksToGoal / 4.33);
  const remWeeks = Math.round(weeksToGoal % 4.33);

  const safeWeeklyLoss = unit === "metric" ? 0.5 : 1;
  const isSafe = weeklyLoss <= safeWeeklyLoss * 1.5;

  const milestones = [0.25, 0.5, 0.75, 1].map((fraction) => ({
    label: `${Math.round(fraction * 100)}%`,
    weight: currentWeight - fraction * weightToLose,
    weeks: Math.round(fraction * weeksToGoal),
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`flex-1 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                unit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
              }`}
            >
              {u === "metric" ? "Metric (kg)" : "Imperial (lbs)"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Current Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <input type="number" min={1} value={currentWeight} onChange={(e) => setCurrentWeight(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Target Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <input type="number" min={1} value={targetWeight} onChange={(e) => setTargetWeight(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Daily TDEE (kcal)</label>
            <input type="number" min={1000} value={tdee} onChange={(e) => setTdee(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            <p className="text-[11px] text-muted-foreground mt-1">Use the Calorie Calculator for your TDEE</p>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Daily Intake Target (kcal)</label>
            <input type="number" min={800} value={dailyIntake} onChange={(e) => setDailyIntake(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        </div>

        {deficit > 0 && weightToLose > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
                <p className="text-[11px] text-muted-foreground font-medium mb-1">Daily Deficit</p>
                <p className="text-[15px] font-semibold text-foreground">{deficit.toLocaleString()} kcal</p>
              </div>
              <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
                <p className="text-[11px] text-muted-foreground font-medium mb-1">Weekly Loss</p>
                <p className="text-[15px] font-semibold text-foreground">{weeklyLoss.toFixed(2)} {unit === "metric" ? "kg" : "lbs"}</p>
              </div>
              <div className={`rounded-xl p-3 text-center col-span-2 ${
                isSafe ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"
              }`}>
                <p className={`text-[11px] font-medium mb-1 ${isSafe ? "text-emerald-700" : "text-amber-700"}`}>Time to Goal</p>
                <p className={`text-[15px] font-semibold ${isSafe ? "text-emerald-800" : "text-amber-800"}`}>
                  {months > 0 ? `${months}mo ` : ""}{remWeeks}w ({Math.round(daysToGoal)} days)
                </p>
              </div>
            </div>

            {!isSafe && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-[12px] text-amber-700">
                  A deficit of {deficit} kcal/day is aggressive. Health guidelines recommend losing no more than 0.5–1 kg (1–2 lbs) per week to preserve muscle mass and avoid nutrient deficiencies.
                </p>
              </div>
            )}

            <div>
              <p className="text-[12px] font-medium text-muted-foreground mb-3">Progress milestones</p>
              <div className="space-y-0">
                {milestones.map((m) => (
                  <div key={m.label} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                    <span className="text-[12px] text-muted-foreground">{m.label} of goal</span>
                    <div className="text-right">
                      <span className="text-[13px] font-medium text-foreground">{m.weight.toFixed(1)} {unit === "metric" ? "kg" : "lbs"}</span>
                      <span className="text-[12px] text-muted-foreground ml-2">~{m.weeks} weeks</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : deficit <= 0 ? (
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
            <p className="text-[13px] text-amber-700">Your intake is at or above your TDEE. No deficit — weight loss will not occur.</p>
          </div>
        ) : (
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center">
            <p className="text-[13px] text-muted-foreground">Target weight is higher than or equal to current weight.</p>
          </div>
        )}
      </div>
    </div>
  );
}
