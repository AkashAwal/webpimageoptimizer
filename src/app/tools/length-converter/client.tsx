"use client";

import { useState } from "react";

const UNITS = [
  { id: "mm", label: "Millimetre (mm)", toM: 0.001 },
  { id: "cm", label: "Centimetre (cm)", toM: 0.01 },
  { id: "m", label: "Metre (m)", toM: 1 },
  { id: "km", label: "Kilometre (km)", toM: 1000 },
  { id: "in", label: "Inch (in)", toM: 0.0254 },
  { id: "ft", label: "Foot (ft)", toM: 0.3048 },
  { id: "yd", label: "Yard (yd)", toM: 0.9144 },
  { id: "mi", label: "Mile (mi)", toM: 1609.344 },
  { id: "nmi", label: "Nautical mile (nmi)", toM: 1852 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
  const s = parseFloat(n.toPrecision(7)).toString();
  return s;
}

export function LengthConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    const n = parseFloat(raw);
    if (raw === "" || raw === "-") {
      setValues({ [id]: raw });
      return;
    }
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const metres = n * unit.toM;
    const next: Record<string, string> = {};
    for (const u of UNITS) {
      next[u.id] = id === u.id ? raw : fmt(metres / u.toM);
    }
    setValues(next);
  }

  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="divide-y divide-black/5">
        {UNITS.map((u) => (
          <div key={u.id} className="flex items-center gap-4 px-4 py-3">
            <label className="w-44 shrink-0 text-[13px] text-muted-foreground">{u.label}</label>
            <input
              type="number"
              value={values[u.id] ?? ""}
              onChange={(e) => handleChange(u.id, e.target.value)}
              placeholder="0"
              className="flex-1 min-w-0 rounded-xl border border-black/8 bg-neutral-50 px-3 py-2 font-mono text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
