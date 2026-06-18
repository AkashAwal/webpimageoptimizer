"use client";

import { useState } from "react";

const UNITS = [
  { id: "bit", label: "Bit (b)", toBytes: 0.125 },
  { id: "byte", label: "Byte (B)", toBytes: 1 },
  { id: "kb", label: "Kilobyte (KB)", toBytes: 1024 },
  { id: "mb", label: "Megabyte (MB)", toBytes: 1_048_576 },
  { id: "gb", label: "Gigabyte (GB)", toBytes: 1_073_741_824 },
  { id: "tb", label: "Terabyte (TB)", toBytes: 1_099_511_627_776 },
  { id: "pb", label: "Petabyte (PB)", toBytes: 1_125_899_906_842_624 },
];

const REFERENCES = [
  { label: "1 MB", bytes: 1_048_576 },
  { label: "1 GB", bytes: 1_073_741_824 },
  { label: "1 TB", bytes: 1_099_511_627_776 },
];

function fmt(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e18 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(4);
  const s = parseFloat(n.toPrecision(10)).toString();
  return s;
}

export function DataStorageConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({});

  function handleChange(id: string, raw: string) {
    if (raw === "" || raw === "-") { setValues({ [id]: raw }); return; }
    const n = parseFloat(raw);
    if (isNaN(n)) { setValues({ [id]: raw }); return; }
    const unit = UNITS.find((u) => u.id === id)!;
    const bytes = n * unit.toBytes;
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = id === u.id ? raw : fmt(bytes / u.toBytes);
    setValues(next);
  }

  function loadRef(bytes: number) {
    const next: Record<string, string> = {};
    for (const u of UNITS) next[u.id] = fmt(bytes / u.toBytes);
    setValues(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REFERENCES.map(({ label, bytes }) => (
          <button key={label} onClick={() => loadRef(bytes)}
            className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">
            {label}
          </button>
        ))}
      </div>
      <p className="text-[12px] text-muted-foreground">Using binary (base-2) definitions: 1 KB = 1,024 bytes.</p>
      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="divide-y divide-black/5">
          {UNITS.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-4 py-3">
              <label className="w-44 shrink-0 text-[13px] text-muted-foreground">{u.label}</label>
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
