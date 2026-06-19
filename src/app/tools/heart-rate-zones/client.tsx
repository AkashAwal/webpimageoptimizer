"use client";

import { useState } from "react";

const ZONES = [
  { zone: 1, name: "Active Recovery", pctLow: 50, pctHigh: 60, color: "bg-blue-100 text-blue-800 border-blue-200", desc: "Light effort, recovery sessions" },
  { zone: 2, name: "Aerobic Base", pctLow: 60, pctHigh: 70, color: "bg-green-100 text-green-800 border-green-200", desc: "Fat burning, builds endurance" },
  { zone: 3, name: "Aerobic Fitness", pctLow: 70, pctHigh: 80, color: "bg-yellow-100 text-yellow-800 border-yellow-200", desc: "Improves aerobic capacity" },
  { zone: 4, name: "Lactate Threshold", pctLow: 80, pctHigh: 90, color: "bg-orange-100 text-orange-800 border-orange-200", desc: "Hard effort, tempo training" },
  { zone: 5, name: "Maximum Effort", pctLow: 90, pctHigh: 100, color: "bg-red-100 text-red-800 border-red-200", desc: "Sprint intervals, VO₂ max" },
];

export function HeartRateZonesClient() {
  const [mode, setMode] = useState<"age" | "manual">("age");
  const [age, setAge] = useState("");
  const [maxHr, setMaxHr] = useState("");
  const [restingHr, setRestingHr] = useState("");

  const ageVal = parseInt(age);
  const hrMax = mode === "age" ? (220 - ageVal) : parseInt(maxHr);
  const hrRest = parseInt(restingHr) || 0;
  const valid = !isNaN(hrMax) && hrMax > 0 && (mode === "age" ? !isNaN(ageVal) && ageVal > 0 : true);

  const useKarvonen = hrRest > 0 && hrRest < hrMax;
  const hrReserve = hrMax - hrRest;

  const getRange = (pctLow: number, pctHigh: number) => {
    if (useKarvonen) {
      return {
        low: Math.round(hrRest + hrReserve * pctLow / 100),
        high: Math.round(hrRest + hrReserve * pctHigh / 100),
      };
    }
    return { low: Math.round(hrMax * pctLow / 100), high: Math.round(hrMax * pctHigh / 100) };
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("age")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "age" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Calculate from age</button>
        <button onClick={() => setMode("manual")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "manual" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Enter max HR manually</button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {mode === "age" ? (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Age (years)</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Max heart rate (bpm)</label>
              <input type="number" value={maxHr} onChange={(e) => setMaxHr(e.target.value)} placeholder="190"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Resting HR (optional)</label>
            <input type="number" value={restingHr} onChange={(e) => setRestingHr(e.target.value)} placeholder="60"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>

        {valid && (
          <div className="flex items-center gap-3 rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3">
            <div>
              <p className="text-[11px] text-muted-foreground">Max HR</p>
              <p className="text-[20px] font-bold text-foreground">{hrMax} bpm</p>
            </div>
            {useKarvonen && (
              <>
                <div className="text-neutral-300">·</div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Resting HR</p>
                  <p className="text-[20px] font-bold text-foreground">{hrRest} bpm</p>
                </div>
                <div className="text-neutral-300">·</div>
                <div>
                  <p className="text-[11px] text-muted-foreground">HR Reserve</p>
                  <p className="text-[20px] font-bold text-foreground">{hrReserve} bpm</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {valid && (
        <div className="space-y-2">
          {ZONES.map((z) => {
            const { low, high } = getRange(z.pctLow, z.pctHigh);
            return (
              <div key={z.zone} className={`rounded-xl border p-4 ${z.color}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold">Zone {z.zone}</span>
                    <p className="text-[14px] font-semibold mt-0.5">{z.name}</p>
                    <p className="text-[11px] opacity-70 mt-0.5">{z.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[20px] font-bold">{low}–{high}</p>
                    <p className="text-[11px] opacity-70">bpm · {z.pctLow}–{z.pctHigh}% max</p>
                  </div>
                </div>
              </div>
            );
          })}
          {useKarvonen && <p className="text-[11px] text-muted-foreground">Using Karvonen method (heart rate reserve) with resting HR of {hrRest} bpm.</p>}
        </div>
      )}
    </div>
  );
}
