"use client";

import { useState } from "react";

const UNITS = [
  { id: "ml", label: "Millilitre (ml)", toL: 0.001 },
  { id: "L", label: "Litre (L)", toL: 1 },
  { id: "m3", label: "Cubic metre (m³)", toL: 1000 },
  { id: "in3", label: "Cubic inch (in³)", toL: 0.016387064 },
  { id: "ft3", label: "Cubic foot (ft³)", toL: 28.316846592 },
  { id: "cup", label: "US cup", toL: 0.2365882365 },
  { id: "floz", label: "US fluid ounce (fl oz)", toL: 0.0295735296 },
  { id: "pt", label: "US pint (pt)", toL: 0.473176473 },
  { id: "qt", label: "US quart (qt)", toL: 0.946352946 },
  { id: "gal", label: "US gallon (gal)", toL: 3.785411784 },
  { id: "ukgal", label: "UK gallon", toL: 4.54609 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(5);
  return parseFloat(n.toPrecision(7)).toString();
}

export function VolumeConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const litres = n * unit.toL;
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(litres / u.toL);
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
