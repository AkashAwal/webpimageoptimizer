"use client";

import { useState } from "react";

export function GradeCalculatorClient() {
  const [currentGrade, setCurrentGrade] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [desiredGrade, setDesiredGrade] = useState("");
  const [finalWeight, setFinalWeight] = useState("");

  const cg = parseFloat(currentGrade);
  const cw = parseFloat(currentWeight);
  const dg = parseFloat(desiredGrade);
  const fw = parseFloat(finalWeight);

  let needed: number | null = null;
  let impossible = false;

  if (!isNaN(cg) && !isNaN(cw) && !isNaN(dg) && !isNaN(fw)) {
    const remainingWeight = 100 - cw;
    if (remainingWeight > 0 && fw <= remainingWeight) {
      needed = (dg - (cg * cw) / 100) / (fw / 100);
    } else if (fw > 0) {
      needed = (dg - (cg * (100 - fw)) / 100) / (fw / 100);
    }
    if (needed !== null && needed > 100) impossible = true;
  }

  function letterGrade(score: number): string {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <p className="text-[13px] font-semibold text-foreground">What do I need on my final exam?</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Current grade (%)</label>
            <input type="number" value={currentGrade} onChange={(e) => setCurrentGrade(e.target.value)}
              placeholder="e.g. 78" min={0} max={100}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Weight so far (%)</label>
            <input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="e.g. 70" min={0} max={99}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Desired final grade (%)</label>
            <input type="number" value={desiredGrade} onChange={(e) => setDesiredGrade(e.target.value)}
              placeholder="e.g. 85" min={0} max={100}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Final exam weight (%)</label>
            <input type="number" value={finalWeight} onChange={(e) => setFinalWeight(e.target.value)}
              placeholder="e.g. 30" min={1} max={100}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>

        {needed !== null && (
          <div className={`rounded-xl p-4 text-center ${impossible ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"}`}>
            <p className="text-[12px] text-muted-foreground mb-1">You need to score</p>
            <p className={`text-[42px] font-bold ${impossible ? "text-red-600" : "text-emerald-700"}`}>
              {impossible ? ">100%" : `${needed.toFixed(1)}%`}
            </p>
            {!impossible && (
              <p className="text-[13px] text-muted-foreground mt-1">
                (Letter grade: <strong>{letterGrade(needed)}</strong>) on your final exam
              </p>
            )}
            {impossible && (
              <p className="text-[13px] text-red-500 mt-1">The desired grade is not achievable with the current scores.</p>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <p className="text-[13px] font-semibold text-foreground mb-3">Grade scale reference</p>
        <div className="grid grid-cols-5 gap-2">
          {[
            { range: "90–100", letter: "A", color: "bg-emerald-100 text-emerald-800" },
            { range: "80–89", letter: "B", color: "bg-blue-100 text-blue-800" },
            { range: "70–79", letter: "C", color: "bg-yellow-100 text-yellow-800" },
            { range: "60–69", letter: "D", color: "bg-orange-100 text-orange-800" },
            { range: "0–59", letter: "F", color: "bg-red-100 text-red-800" },
          ].map((g) => (
            <div key={g.letter} className={`rounded-xl p-3 text-center ${g.color}`}>
              <p className="text-[20px] font-bold">{g.letter}</p>
              <p className="text-[10px] mt-0.5">{g.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
