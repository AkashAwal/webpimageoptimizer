"use client";

import { useState } from "react";

const PI = Math.PI;

const UNITS = [
  { id: "deg", label: "Degree (°)", toDeg: 1 },
  { id: "rad", label: "Radian (rad)", toDeg: 180 / PI },
  { id: "grad", label: "Gradian (grad)", toDeg: 0.9 },
  { id: "arcmin", label: "Arcminute (′)", toDeg: 1 / 60 },
  { id: "arcsec", label: "Arcsecond (″)", toDeg: 1 / 3600 },
  { id: "rev", label: "Revolution (turn)", toDeg: 360 },
];

const REFERENCES = [
  { label: "90° (right angle)", deg: 90 },
  { label: "180° (straight)", deg: 180 },
  { label: "360° (full turn)", deg: 360 },
  { label: "π rad", deg: 180 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-7 && n !== 0)) return n.toExponential(6);
  return parseFloat(n.toPrecision(9)).toString();
}

export function AngleConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const deg = n * unit.toDeg;
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(deg / u.toDeg);
    setValues(next);
  }

  function loadRef(deg: number) {
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = fmt(deg / u.toDeg);
    setValues(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REFERENCES.map(({ label, deg }) => (
          <button key={label} onClick={() => loadRef(deg)}
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
