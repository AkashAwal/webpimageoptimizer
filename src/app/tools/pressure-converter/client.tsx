"use client";

import { useState } from "react";

const UNITS = [
  { id: "pa", label: "Pascal (Pa)", toPa: 1 },
  { id: "kpa", label: "Kilopascal (kPa)", toPa: 1000 },
  { id: "mpa", label: "Megapascal (MPa)", toPa: 1_000_000 },
  { id: "bar", label: "Bar", toPa: 100_000 },
  { id: "psi", label: "Pound per sq inch (psi)", toPa: 6894.757293168 },
  { id: "atm", label: "Atmosphere (atm)", toPa: 101325 },
  { id: "mmhg", label: "mmHg / Torr", toPa: 133.322387415 },
];

const REFERENCES = [
  { label: "1 atm (sea level)", pa: 101325 },
  { label: "Car tyre (~32 psi)", pa: 220632 },
  { label: "Blood pressure (120 mmHg)", pa: 15999 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-5 && n !== 0)) return n.toExponential(5);
  return parseFloat(n.toPrecision(7)).toString();
}

export function PressureConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const pa = n * unit.toPa;
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(pa / u.toPa);
    setValues(next);
  }

  function loadRef(pa: number) {
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = fmt(pa / u.toPa);
    setValues(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REFERENCES.map(({ label, pa }) => (
          <button key={label} onClick={() => loadRef(pa)}
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
