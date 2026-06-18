"use client";

import { useState } from "react";

const UNITS = [
  { id: "ms", label: "Metre per second (m/s)", toMs: 1 },
  { id: "kmh", label: "Kilometre per hour (km/h)", toMs: 1 / 3.6 },
  { id: "mph", label: "Mile per hour (mph)", toMs: 0.44704 },
  { id: "knot", label: "Knot (kn)", toMs: 0.514444 },
  { id: "fts", label: "Foot per second (ft/s)", toMs: 0.3048 },
  { id: "mach", label: "Mach (at sea level)", toMs: 340.29 },
];

const REFERENCES = [
  { label: "Walking pace", ms: 1.4 },
  { label: "City speed limit", ms: 13.89 },
  { label: "Highway speed", ms: 33.33 },
  { label: "Speed of sound", ms: 340.29 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) return n.toExponential(5);
  return parseFloat(n.toPrecision(7)).toString();
}

export function SpeedConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const ms = n * unit.toMs;
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(ms / u.toMs);
    setValues(next);
  }

  function loadRef(ms: number) {
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = fmt(ms / u.toMs);
    setValues(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REFERENCES.map(({ label, ms }) => (
          <button key={label} onClick={() => loadRef(ms)}
            className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="divide-y divide-black/5">
          {UNITS.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-4 py-3">
              <label className="w-48 shrink-0 text-[13px] text-muted-foreground">{u.label}</label>
              <input type="number" value={values[u.id] ?? ""} onChange={(e) => handleChange(u.id, e.target.value)}
                placeholder="0"
                className="flex-1 min-w-0 rounded-xl border border-black/8 bg-neutral-50 px-3 py-2 font-mono text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-black/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
