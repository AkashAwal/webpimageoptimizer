"use client";

import { useState } from "react";

// All conversions go through km/L as the base.
// L/100km is inverse: L100km = 100 / kmL
// mpg_us → km/L: * 1.60934 / 3.78541 = * 0.425144
// mpg_uk → km/L: * 1.60934 / 4.54609 = * 0.354006

const KM_PER_MILE = 1.60934;
const L_PER_US_GAL = 3.785411784;
const L_PER_UK_GAL = 4.54609;

type UnitId = "kmL" | "L100km" | "mpgUS" | "mpgUK";

const UNITS: { id: UnitId; label: string }[] = [
  { id: "kmL", label: "Kilometres per litre (km/L)" },
  { id: "L100km", label: "Litres per 100 km (L/100km)" },
  { id: "mpgUS", label: "Miles per gallon — US (mpg)" },
  { id: "mpgUK", label: "Miles per gallon — UK (mpg)" },
];

function toKmL(val: number, id: UnitId): number {
  if (id === "kmL") return val;
  if (id === "L100km") return val === 0 ? Infinity : 100 / val;
  if (id === "mpgUS") return val * KM_PER_MILE / L_PER_US_GAL;
  return val * KM_PER_MILE / L_PER_UK_GAL;
}

function fromKmL(kmL: number, id: UnitId): number {
  if (id === "kmL") return kmL;
  if (id === "L100km") return kmL === 0 ? Infinity : 100 / kmL;
  if (id === "mpgUS") return kmL * L_PER_US_GAL / KM_PER_MILE;
  return kmL * L_PER_UK_GAL / KM_PER_MILE;
}

function fmt(n: number): string {
  if (!isFinite(n)) return "∞";
  if (n === 0) return "0";
  return parseFloat(n.toPrecision(6)).toString();
}

const REFERENCES = [
  { label: "City car (~10 L/100km)", kmL: 10 },
  { label: "Efficient hybrid (~5 L/100km)", kmL: 20 },
  { label: "SUV (~14 L/100km)", kmL: 7.14 },
];

export function FuelConverterClient() {
  const [values, setValues] = useState<Partial<Record<UnitId, string>>>({});

  function handleChange(id: UnitId, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n) || n < 0) { setValues({ [id]: raw }); return; }
    const kmL = toKmL(n, id);
    const next: Partial<Record<UnitId, string>> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(fromKmL(kmL, u.id));
    setValues(next);
  }

  function loadRef(kmL: number) {
    const next: Partial<Record<UnitId, string>> = {};
    for (const u of UNITS) next[u.id] = fmt(fromKmL(kmL, u.id));
    setValues(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REFERENCES.map(({ label, kmL }) => (
          <button key={label} onClick={() => loadRef(kmL)}
            className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">
            {label}
          </button>
        ))}
      </div>
      <p className="text-[12px] text-muted-foreground">
        Note: L/100km is a consumption rate (lower = better). All other units are efficiency rates (higher = better). They have an inverse relationship.
      </p>
      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="divide-y divide-black/5">
          {UNITS.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-4 py-3">
              <label className="w-56 shrink-0 text-[13px] text-muted-foreground">{u.label}</label>
              <input type="number" min="0" value={values[u.id] ?? ""} onChange={(e) => handleChange(u.id, e.target.value)}
                placeholder="0"
                className="flex-1 min-w-0 rounded-xl border border-black/8 bg-neutral-50 px-3 py-2 font-mono text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-black/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
