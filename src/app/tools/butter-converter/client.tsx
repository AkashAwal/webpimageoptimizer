"use client";
import { useState } from "react";

const UNITS = [
  { label: "US sticks", toG: 113.4, abbr: "sticks" },
  { label: "cups", toG: 226.8, abbr: "cups" },
  { label: "tablespoons", toG: 14.175, abbr: "tbsp" },
  { label: "teaspoons", toG: 4.725, abbr: "tsp" },
  { label: "ounces", toG: 28.3495, abbr: "oz" },
  { label: "grams", toG: 1, abbr: "g" },
  { label: "pounds", toG: 453.592, abbr: "lb" },
];

function round(n: number) {
  if (n >= 100) return Math.round(n);
  if (n >= 10) return Math.round(n * 10) / 10;
  return Math.round(n * 100) / 100;
}

export function ButterConverterClient() {
  const [fromIdx, setFromIdx] = useState(0);
  const [value, setValue] = useState(1);

  const valueInG = value * UNITS[fromIdx].toG;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Amount</label>
            <input type="number" min={0} step="any" value={value} onChange={e => setValue(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Unit</label>
            <select value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
              {UNITS.map((u, i) => <option key={u.abbr} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {UNITS.map((u, i) => {
            const converted = valueInG / u.toG;
            const isSource = i === fromIdx;
            return (
              <div key={u.abbr}
                className={`rounded-xl border p-3 text-center cursor-pointer transition-colors ${isSource ? "bg-emerald-50 border-emerald-100" : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"}`}
                onClick={() => setFromIdx(i)}>
                <p className={`text-[11px] font-medium mb-1 ${isSource ? "text-emerald-700" : "text-muted-foreground"}`}>{u.label}</p>
                <p className={`text-[16px] font-semibold ${isSource ? "text-emerald-800" : "text-foreground"}`}>
                  {round(converted)} {u.abbr}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Butter Quick Reference</p>
          <div className="space-y-1 text-[13px]">
            {[
              ["1 US stick", "½ cup = 8 tbsp = 4 oz = 113g"],
              ["2 US sticks", "1 cup = 16 tbsp = 8 oz = 227g"],
              ["1 cup butter", "2 sticks = 227g"],
              ["100g butter", "~7 tbsp = ~¾ stick"],
              ["½ stick", "4 tbsp = ¼ cup = 57g"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-neutral-100 last:border-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">Click any unit card to use it as the input. Based on US butter (1 stick = 113.4g).</p>
      </div>
    </div>
  );
}
