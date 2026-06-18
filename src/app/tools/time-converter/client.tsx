"use client";

import { useState } from "react";

const UNITS = [
  { id: "ms", label: "Millisecond (ms)", toS: 0.001 },
  { id: "s", label: "Second (s)", toS: 1 },
  { id: "min", label: "Minute (min)", toS: 60 },
  { id: "h", label: "Hour (h)", toS: 3600 },
  { id: "day", label: "Day", toS: 86400 },
  { id: "week", label: "Week", toS: 604800 },
  { id: "month", label: "Month (avg 30.4375 days)", toS: 2629800 },
  { id: "year", label: "Year (365.25 days)", toS: 31557600 },
];

const REFERENCES = [
  { label: "1 hour", s: 3600 },
  { label: "1 day", s: 86400 },
  { label: "1 week", s: 604800 },
  { label: "1 year", s: 31557600 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 0.0001 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(8)).toString();
}

export function TimeConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const secs = n * unit.toS;
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(secs / u.toS);
    setValues(next);
  }

  function loadRef(s: number) {
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = fmt(s / u.toS);
    setValues(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REFERENCES.map(({ label, s }) => (
          <button key={label} onClick={() => loadRef(s)}
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
