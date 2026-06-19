"use client";

import { useState } from "react";

export function InflationCalculatorClient() {
  const [mode, setMode] = useState<"future" | "past">("future");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("3");
  const [years, setYears] = useState("");

  const a = parseFloat(amount);
  const r = parseFloat(rate) / 100;
  const y = parseFloat(years);
  const valid = !isNaN(a) && !isNaN(r) && !isNaN(y) && a > 0 && r >= 0 && y > 0;

  const factor = Math.pow(1 + r, y);
  const futureValue = valid ? a * factor : 0;
  const pastValue = valid ? a / factor : 0;

  const result = mode === "future" ? futureValue : pastValue;
  const loss = mode === "future" ? a - a / factor : a - a * factor;

  const milestones = valid ? [1, 5, 10, 20, 30, 50].filter((n) => n <= y * 2 && n > 0).slice(0, 6).map((n) => ({
    n,
    value: mode === "future" ? a * Math.pow(1 + r, n) : a / Math.pow(1 + r, n),
  })) : [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("future")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "future" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Future value</button>
        <button onClick={() => setMode("past")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "past" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Past value</button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">
            {mode === "future" ? "Amount today ($)" : "Amount in the past ($)"}
          </label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Annual inflation rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.1"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Number of years</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="10"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["2", "3", "4", "5", "7", "10"].map((r2) => (
            <button key={r2} onClick={() => setRate(r2)} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${rate === r2 ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>{r2}%</button>
          ))}
        </div>

        {valid && (
          <div className="rounded-xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">
              {mode === "future" ? `$${a.toFixed(2)} today will be worth` : `$${a.toFixed(2)} then equals`}
            </p>
            <p className="text-[42px] font-bold">${result.toFixed(2)}</p>
            <p className="text-[12px] text-neutral-400 mt-2">
              {mode === "future"
                ? `in ${y} years — purchasing power falls $${Math.abs(loss).toFixed(2)}`
                : `today — it would cost $${Math.abs(loss + a).toFixed(2)} today`}
            </p>
          </div>
        )}
      </div>

      {valid && milestones.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 grid grid-cols-2 text-[11px] font-medium text-muted-foreground">
            <span>Year</span><span className="text-right">Equivalent value</span>
          </div>
          {milestones.map(({ n, value: v }) => (
            <div key={n} className="grid grid-cols-2 px-4 py-2 border-b border-neutral-50 last:border-0 text-[13px]">
              <span className="text-muted-foreground">{n} years</span>
              <span className="text-right font-medium text-foreground">${v.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
