"use client";

import { useState } from "react";

const DISTANCES = [
  { label: "1K", km: 1 },
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "Half Marathon", km: 21.0975 },
  { label: "Marathon", km: 42.195 },
  { label: "Custom", km: 0 },
];

function fmtPace(secPerKm: number): string {
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function fmtTime(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RunningPaceCalculatorClient() {
  const [mode, setMode] = useState<"pace" | "time">("pace");
  const [distIdx, setDistIdx] = useState(1);
  const [customDist, setCustomDist] = useState("");
  const [paceMin, setPaceMin] = useState("");
  const [paceSec, setPaceSec] = useState("");
  const [timeH, setTimeH] = useState("");
  const [timeM, setTimeM] = useState("");
  const [timeS, setTimeS] = useState("");
  const [paceUnit, setPaceUnit] = useState<"km" | "mile">("km");

  const km = DISTANCES[distIdx].km || parseFloat(customDist);
  const validDist = !isNaN(km) && km > 0;

  let result: { finish?: string; pace?: string; pacePerMile?: string; speed?: string } | null = null;

  if (validDist && mode === "pace") {
    const pm = parseInt(paceMin) || 0;
    const ps = parseInt(paceSec) || 0;
    const secPerUnit = pm * 60 + ps;
    if (secPerUnit > 0) {
      const secPerKm = paceUnit === "km" ? secPerUnit : secPerUnit / 1.60934;
      const totalSec = secPerKm * km;
      const speedKph = 3600 / secPerKm;
      result = {
        finish: fmtTime(totalSec),
        pace: fmtPace(secPerKm) + " /km",
        pacePerMile: fmtPace(secPerKm * 1.60934) + " /mile",
        speed: `${speedKph.toFixed(2)} km/h`,
      };
    }
  }

  if (validDist && mode === "time") {
    const totalSec = (parseInt(timeH) || 0) * 3600 + (parseInt(timeM) || 0) * 60 + (parseInt(timeS) || 0);
    if (totalSec > 0) {
      const secPerKm = totalSec / km;
      const speedKph = 3600 / secPerKm;
      result = {
        finish: fmtTime(totalSec),
        pace: fmtPace(secPerKm) + " /km",
        pacePerMile: fmtPace(secPerKm * 1.60934) + " /mile",
        speed: `${speedKph.toFixed(2)} km/h`,
      };
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setMode("pace")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "pace" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>I know my pace</button>
        <button onClick={() => setMode("time")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "time" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>I know my finish time</button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Distance</label>
          <div className="flex flex-wrap gap-2">
            {DISTANCES.map((d, i) => (
              <button key={d.label} onClick={() => setDistIdx(i)} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${distIdx === i ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>{d.label}</button>
            ))}
          </div>
          {distIdx === 5 && (
            <input type="number" value={customDist} onChange={(e) => setCustomDist(e.target.value)} placeholder="Custom distance in km"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          )}
        </div>

        {mode === "pace" ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-muted-foreground">Pace (min:sec)</label>
              <div className="flex gap-1">
                <button onClick={() => setPaceUnit("km")} className={`rounded px-2 py-0.5 text-[11px] font-medium ${paceUnit === "km" ? "bg-foreground text-background" : "bg-neutral-100"}`}>/km</button>
                <button onClick={() => setPaceUnit("mile")} className={`rounded px-2 py-0.5 text-[11px] font-medium ${paceUnit === "mile" ? "bg-foreground text-background" : "bg-neutral-100"}`}>/mile</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={paceMin} onChange={(e) => setPaceMin(e.target.value)} placeholder="5 (min)"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
              <input type="number" value={paceSec} onChange={(e) => setPaceSec(e.target.value)} placeholder="30 (sec)" min={0} max={59}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Finish time</label>
            <div className="grid grid-cols-3 gap-3">
              {[{ val: timeH, set: setTimeH, ph: "0 h" }, { val: timeM, set: setTimeM, ph: "25 min" }, { val: timeS, set: setTimeS, ph: "00 sec" }].map(({ val, set, ph }, i) => (
                <input key={i} type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[15px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-2 gap-3">
            {mode === "pace" && (
              <div className="col-span-2 rounded-xl bg-neutral-900 text-white p-4 text-center">
                <p className="text-[11px] text-neutral-400 mb-1">Finish time for {DISTANCES[distIdx].label || `${km} km`}</p>
                <p className="text-[32px] font-bold">{result.finish}</p>
              </div>
            )}
            {mode === "time" && (
              <div className="col-span-2 rounded-xl bg-neutral-900 text-white p-4 text-center">
                <p className="text-[11px] text-neutral-400 mb-1">Your pace</p>
                <p className="text-[32px] font-bold">{result.pace}</p>
              </div>
            )}
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
              <p className="text-[10px] text-muted-foreground">Per mile</p>
              <p className="text-[15px] font-bold text-foreground">{result.pacePerMile}</p>
            </div>
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
              <p className="text-[10px] text-muted-foreground">Speed</p>
              <p className="text-[15px] font-bold text-foreground">{result.speed}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
