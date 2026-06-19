"use client";

import { useState } from "react";

type Solve = "speed" | "distance" | "time";

function fmtTime(h: number): string {
  const hours = Math.floor(h);
  const minutes = Math.round((h - hours) * 60);
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

export function SpeedCalculatorClient() {
  const [solve, setSolve] = useState<Solve>("speed");
  const [unit, setUnit] = useState<"km" | "mi">("km");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [speed, setSpeed] = useState("");

  const d = parseFloat(distance);
  const t = parseFloat(time);
  const s = parseFloat(speed);

  let result: string | null = null;
  let sub: string | null = null;

  if (solve === "speed" && !isNaN(d) && !isNaN(t) && t > 0) {
    const v = d / t;
    result = `${v.toFixed(2)} ${unit}/h`;
    sub = unit === "km" ? `${(v * 0.621371).toFixed(2)} mph` : `${(v / 0.621371).toFixed(2)} km/h`;
  } else if (solve === "distance" && !isNaN(s) && !isNaN(t) && t > 0) {
    const dist = s * t;
    result = `${dist.toFixed(2)} ${unit}`;
    sub = unit === "km" ? `${(dist * 0.621371).toFixed(2)} miles` : `${(dist / 0.621371).toFixed(2)} km`;
  } else if (solve === "time" && !isNaN(d) && !isNaN(s) && s > 0) {
    const h = d / s;
    result = fmtTime(h);
    sub = `${(h * 60).toFixed(1)} minutes total`;
  }

  const labels: Record<Solve, string> = { speed: "Calculate Speed", distance: "Calculate Distance", time: "Calculate Time" };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["speed", "distance", "time"] as Solve[]).map((v) => (
          <button key={v} onClick={() => setSolve(v)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${solve === v ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >{labels[v]}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setUnit("km")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "km" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>km</button>
          <button onClick={() => setUnit("mi")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "mi" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>miles</button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {solve !== "speed" && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Speed ({unit}/h)</label>
              <input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="e.g. 100"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          )}
          {solve !== "distance" && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Distance ({unit})</label>
              <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 250"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          )}
          {solve !== "time" && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Time (hours)</label>
              <input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 2.5"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          )}
        </div>

        {result && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
            <p className="text-[12px] text-muted-foreground mb-1">{labels[solve].replace("Calculate ", "")}</p>
            <p className="text-[36px] font-bold text-emerald-700">{result}</p>
            {sub && <p className="text-[12px] text-muted-foreground mt-1">{sub}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
