"use client";

import { useState } from "react";

const UNITS = [
  { id: "j", label: "Joule (J)", toJ: 1 },
  { id: "kj", label: "Kilojoule (kJ)", toJ: 1000 },
  { id: "cal", label: "Calorie (cal)", toJ: 4.184 },
  { id: "kcal", label: "Kilocalorie / Cal (kcal)", toJ: 4184 },
  { id: "wh", label: "Watt-hour (Wh)", toJ: 3600 },
  { id: "kwh", label: "Kilowatt-hour (kWh)", toJ: 3_600_000 },
  { id: "btu", label: "BTU (British thermal unit)", toJ: 1055.05585262 },
  { id: "ev", label: "Electron volt (eV)", toJ: 1.602176634e-19 },
];

const REFERENCES = [
  { label: "1 dietary Calorie", j: 4184 },
  { label: "1 kWh (electricity)", j: 3_600_000 },
  { label: "1 BTU", j: 1055 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-15 && n !== 0)) return n.toExponential(5);
  return parseFloat(n.toPrecision(7)).toString();
}

export function EnergyConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const j = n * unit.toJ;
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(j / u.toJ);
    setValues(next);
  }

  function loadRef(j: number) {
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = fmt(j / u.toJ);
    setValues(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REFERENCES.map(({ label, j }) => (
          <button key={label} onClick={() => loadRef(j)}
            className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="divide-y divide-black/5">
          {UNITS.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-4 py-3">
              <label className="w-52 shrink-0 text-[13px] text-muted-foreground">{u.label}</label>
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
