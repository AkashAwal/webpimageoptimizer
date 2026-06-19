"use client";

import { useState } from "react";

const VALS: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return "";
  let result = "";
  for (const [val, sym] of VALS) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function fromRoman(s: string): number | null {
  s = s.toUpperCase().trim();
  if (!s) return null;
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0, prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const cur = map[s[i]];
    if (cur === undefined) return null;
    if (cur < prev) total -= cur;
    else total += cur;
    prev = cur;
  }
  return total > 0 && total <= 3999 ? total : null;
}

export function RomanNumeralConverterClient() {
  const [mode, setMode] = useState<"toRoman" | "toArabic">("toRoman");
  const [val, setVal] = useState("");

  const roman = mode === "toRoman" ? toRoman(parseInt(val)) : val.toUpperCase();
  const arabic = mode === "toRoman" ? parseInt(val) : fromRoman(val);
  const invalid = mode === "toArabic" && val.trim() && arabic === null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => { setMode("toRoman"); setVal(""); }}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "toRoman" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
        >Number → Roman</button>
        <button onClick={() => { setMode("toArabic"); setVal(""); }}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "toArabic" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
        >Roman → Number</button>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">
          {mode === "toRoman" ? "Enter a number (1–3999)" : "Enter Roman numeral"}
        </label>
        <input
          type={mode === "toRoman" ? "number" : "text"}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={mode === "toRoman" ? "e.g. 2024" : "e.g. MMXXIV"}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[20px] font-semibold text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-normal placeholder:text-[14px]"
        />
        {mode === "toRoman" && val && (parseInt(val) < 1 || parseInt(val) > 3999) && (
          <p className="text-[12px] text-red-500">Roman numerals only cover 1–3999</p>
        )}
        {invalid && <p className="text-[12px] text-red-500">Not a valid Roman numeral</p>}
      </div>

      {mode === "toRoman" && roman && (
        <div className="rounded-2xl bg-neutral-900 text-white p-6 text-center">
          <p className="text-[12px] text-neutral-400 mb-2">{parseInt(val)} in Roman numerals</p>
          <p className="text-[48px] font-bold tracking-wider">{roman}</p>
        </div>
      )}

      {mode === "toArabic" && arabic !== null && !invalid && (
        <div className="rounded-2xl bg-neutral-900 text-white p-6 text-center">
          <p className="text-[12px] text-neutral-400 mb-2">{roman} in Arabic numerals</p>
          <p className="text-[56px] font-bold">{arabic.toLocaleString()}</p>
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
        <p className="text-[12px] font-medium text-muted-foreground mb-2">Roman numeral symbols</p>
        <div className="grid grid-cols-7 gap-2">
          {[["I","1"],["V","5"],["X","10"],["L","50"],["C","100"],["D","500"],["M","1000"]].map(([r, a]) => (
            <div key={r} className="rounded-lg bg-neutral-50 p-2 text-center">
              <p className="text-[16px] font-bold text-foreground">{r}</p>
              <p className="text-[10px] text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
