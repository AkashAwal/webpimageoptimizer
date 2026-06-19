"use client";

import { useState } from "react";

const FREQUENCIES = [
  { label: "Annually", n: 1 },
  { label: "Semi-annually", n: 2 },
  { label: "Quarterly", n: 4 },
  { label: "Monthly", n: 12 },
  { label: "Daily", n: 365 },
];

export function CompoundInterestCalculatorClient() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [freqIdx, setFreqIdx] = useState(3);

  const P = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const t = parseFloat(years);
  const n = FREQUENCIES[freqIdx].n;
  const valid = !isNaN(P) && !isNaN(r) && !isNaN(t) && P > 0 && r > 0 && t > 0;

  const A = valid ? P * Math.pow(1 + r / n, n * t) : 0;
  const interest = A - P;
  const simpleInterest = valid ? P * r * t : 0;
  const extra = interest - simpleInterest;

  const milestones = valid ? [1, 5, 10, 20, t].filter((y, i, arr) => y <= t && (i === 0 || y !== arr[i - 1])).map((y) => ({
    year: y,
    value: P * Math.pow(1 + r / n, n * y),
  })) : [];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Principal ($)", val: principal, set: setPrincipal, ph: "10000" },
            { label: "Annual interest rate (%)", val: rate, set: setRate, ph: "7" },
            { label: "Time (years)", val: years, set: setYears, ph: "10" },
          ].map(({ label, val, set, ph }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[15px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Compounding</label>
            <select value={freqIdx} onChange={(e) => setFreqIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors">
              {FREQUENCIES.map((f, i) => <option key={i} value={i}>{f.label} ({f.n}×/yr)</option>)}
            </select>
          </div>
        </div>

        {valid && (
          <div className="rounded-xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">Future value</p>
            <p className="text-[42px] font-bold">${A.toFixed(2)}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-white/10 p-2 text-center">
                <p className="text-[14px] font-bold">${P.toFixed(0)}</p>
                <p className="text-[10px] text-neutral-400">Principal</p>
              </div>
              <div className="rounded-lg bg-white/10 p-2 text-center">
                <p className="text-[14px] font-bold">${interest.toFixed(0)}</p>
                <p className="text-[10px] text-neutral-400">Interest earned</p>
              </div>
              <div className="rounded-lg bg-white/10 p-2 text-center">
                <p className="text-[14px] font-bold">${extra.toFixed(0)}</p>
                <p className="text-[10px] text-neutral-400">Compound bonus</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {valid && milestones.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 grid grid-cols-3 text-[11px] font-medium text-muted-foreground">
            <span>Year</span><span className="text-center">Value</span><span className="text-right">Growth</span>
          </div>
          {milestones.map(({ year, value: v }) => (
            <div key={year} className={`grid grid-cols-3 px-4 py-2 border-b border-neutral-50 last:border-0 text-[13px] ${year === t ? "bg-emerald-50" : ""}`}>
              <span className="text-muted-foreground">Year {year}</span>
              <span className="text-center font-medium text-foreground">${v.toFixed(0)}</span>
              <span className="text-right text-muted-foreground">+{((v / P - 1) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
