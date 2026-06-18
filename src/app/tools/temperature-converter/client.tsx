"use client";

import { useState } from "react";

type TempUnit = "c" | "f" | "k" | "r";

function toC(val: number, from: TempUnit): number {
  if (from === "c") return val;
  if (from === "f") return (val - 32) * (5 / 9);
  if (from === "k") return val - 273.15;
  return (val - 491.67) * (5 / 9);
}

function fromC(c: number, to: TempUnit): number {
  if (to === "c") return c;
  if (to === "f") return c * (9 / 5) + 32;
  if (to === "k") return c + 273.15;
  return (c + 273.15) * (9 / 5);
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 0.0001 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toString();
}

const UNITS: { id: TempUnit; label: string; symbol: string }[] = [
  { id: "c", label: "Celsius", symbol: "°C" },
  { id: "f", label: "Fahrenheit", symbol: "°F" },
  { id: "k", label: "Kelvin", symbol: "K" },
  { id: "r", label: "Rankine", symbol: "°R" },
];

const REFERENCES = [
  { label: "Absolute zero", c: -273.15 },
  { label: "Water freezes", c: 0 },
  { label: "Body temperature", c: 37 },
  { label: "Water boils", c: 100 },
];

export function TemperatureConverterClient() {
  const [values, setValues] = useState<Partial<Record<TempUnit, string>>>({});

  function handleChange(id: TempUnit, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const celsius = toC(n, id);
    const next: Partial<Record<TempUnit, string>> = {};
    for (const u of UNITS) {
      next[u.id] = id === u.id ? raw : fmt(fromC(celsius, u.id));
    }
    setValues(next);
  }

  function loadRef(c: number) {
    const next: Partial<Record<TempUnit, string>> = {};
    for (const u of UNITS) next[u.id] = fmt(fromC(c, u.id));
    setValues(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REFERENCES.map(({ label, c }) => (
          <button
            key={label}
            onClick={() => loadRef(c)}
            className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="divide-y divide-black/5">
          {UNITS.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-4 py-3">
              <label className="w-36 shrink-0 text-[13px] text-muted-foreground">
                {u.label} <span className="font-mono">{u.symbol}</span>
              </label>
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

      <div className="rounded-2xl border border-black/8 bg-white overflow-hidden">
        <div className="border-b border-black/6 px-4 py-2.5">
          <span className="text-[12px] font-medium text-muted-foreground">Reference temperatures</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-black/5 text-[12px]">
          {REFERENCES.map(({ label, c }) => (
            <button key={label} onClick={() => loadRef(c)} className="p-3 text-left hover:bg-neutral-50 transition-colors">
              <div className="font-medium text-foreground">{label}</div>
              <div className="text-muted-foreground">{c}°C · {fmt(fromC(c, "f"))}°F</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
