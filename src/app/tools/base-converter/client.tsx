"use client";

import { useState } from "react";

const BASES = [
  { id: "bin", label: "Binary", base: 2, prefix: "0b", chars: /^[01]*$/ },
  { id: "oct", label: "Octal", base: 8, prefix: "0o", chars: /^[0-7]*$/ },
  { id: "dec", label: "Decimal", base: 10, prefix: "", chars: /^-?\d*$/ },
  { id: "hex", label: "Hexadecimal", base: 16, prefix: "0x", chars: /^[0-9a-fA-F]*$/ },
];

export function BaseConverterClient() {
  const [values, setValues] = useState<Record<string, string>>({
    bin: "",
    oct: "",
    dec: "",
    hex: "",
  });
  const [error, setError] = useState("");

  const handleChange = (id: string, raw: string, base: number) => {
    const entry = BASES.find((b) => b.id === id)!;
    if (raw !== "" && !entry.chars.test(raw)) return;
    setError("");

    if (!raw.trim()) {
      setValues({ bin: "", oct: "", dec: "", hex: "" });
      return;
    }

    try {
      const decimal = parseInt(raw, base);
      if (isNaN(decimal)) throw new Error("Invalid number");
      const next: Record<string, string> = {};
      for (const b of BASES) {
        if (b.id === id) {
          next[b.id] = raw;
        } else {
          next[b.id] = decimal.toString(b.base).toUpperCase();
        }
      }
      setValues(next);
    } catch {
      setError("Invalid number for this base");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BASES.map(({ id, label, base, prefix }) => (
            <div key={id} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">
                {label} (base {base})
              </label>
              <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden focus-within:border-neutral-400 transition-colors">
                {prefix && (
                  <span className="px-3 text-[12px] font-mono text-neutral-400 select-none">{prefix}</span>
                )}
                <input
                  type="text"
                  value={values[id]}
                  onChange={(e) => handleChange(id, e.target.value.toUpperCase(), base)}
                  placeholder={id === "dec" ? "0" : id === "hex" ? "FF" : id === "bin" ? "1111" : "17"}
                  className="flex-1 bg-transparent px-3 py-2.5 font-mono text-[14px] text-foreground outline-none min-w-0"
                  spellCheck={false}
                />
              </div>
            </div>
          ))}
        </div>
        {error && <p className="mt-3 text-[12px] text-red-500">{error}</p>}
      </div>

      <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
        <p className="text-[12px] font-medium text-foreground mb-2">Quick reference</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[12px] text-muted-foreground font-mono">
          <span>Dec 0–9 → Hex 0–9</span>
          <span>Dec 10 → Hex A</span>
          <span>Dec 11 → Hex B</span>
          <span>Dec 15 → Hex F</span>
          <span>Dec 255 → Hex FF</span>
          <span>Dec 255 → Bin 11111111</span>
        </div>
      </div>
    </div>
  );
}
