"use client";

import { useState } from "react";

const UNITS = [
  { id: "mm2", label: "Square millimetre (mm²)", toM2: 1e-6 },
  { id: "cm2", label: "Square centimetre (cm²)", toM2: 1e-4 },
  { id: "m2", label: "Square metre (m²)", toM2: 1 },
  { id: "km2", label: "Square kilometre (km²)", toM2: 1e6 },
  { id: "in2", label: "Square inch (in²)", toM2: 0.00064516 },
  { id: "ft2", label: "Square foot (ft²)", toM2: 0.09290304 },
  { id: "yd2", label: "Square yard (yd²)", toM2: 0.83612736 },
  { id: "acre", label: "Acre", toM2: 4046.8564224 },
  { id: "ha", label: "Hectare (ha)", toM2: 10000 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(5);
  return parseFloat(n.toPrecision(7)).toString();
}

export function AreaConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const m2 = n * unit.toM2;
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(m2 / u.toM2);
    setValues(next);
  }

  return (
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
  );
}
