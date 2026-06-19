"use client";

import { useState } from "react";

function fmt(n: number, currency: string) {
  return currency + n.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function InvestmentCalculatorClient() {
  const [initial, setInitial] = useState("10000");
  const [monthly, setMonthly] = useState("500");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("20");
  const [currency, setCurrency] = useState("$");

  const P = parseFloat(initial) || 0;
  const m = parseFloat(monthly) || 0;
  const r = parseFloat(rate) / 100 / 12;
  const n = parseInt(years) * 12;
  const valid = r > 0 && n > 0;

  const futureValueLump = valid ? P * Math.pow(1 + r, n) : P;
  const futureValueContributions = valid && m > 0 ? m * ((Math.pow(1 + r, n) - 1) / r) : 0;
  const total = futureValueLump + futureValueContributions;
  const totalContributed = P + m * n;
  const totalInterest = total - totalContributed;

  const milestones = [5, 10, 15, parseInt(years)].filter((y, i, arr) => y <= parseInt(years) && arr.indexOf(y) === i);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          {["$", "£", "€"].map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${currency === c ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
            >{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: `Initial investment (${currency})`, val: initial, set: setInitial, ph: "10000" },
            { label: `Monthly contribution (${currency})`, val: monthly, set: setMonthly, ph: "500" },
            { label: "Annual return rate (%)", val: rate, set: setRate, ph: "8" },
            { label: "Investment period (years)", val: years, set: setYears, ph: "20" },
          ].map(({ label, val, set, ph }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-neutral-900 text-white p-5 text-center">
          <p className="text-[12px] text-neutral-400 mb-1">Future value after {years} years</p>
          <p className="text-[48px] font-bold">{fmt(total, currency)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-[14px] font-bold">{fmt(totalContributed, currency)}</p>
              <p className="text-[10px] text-neutral-400">Total contributed</p>
            </div>
            <div className="rounded-lg bg-emerald-400/20 p-3">
              <p className="text-[14px] font-bold text-emerald-300">{fmt(totalInterest, currency)}</p>
              <p className="text-[10px] text-neutral-400">Interest earned</p>
            </div>
          </div>
        </div>
      </div>

      {valid && milestones.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
          <p className="text-[12px] font-medium text-muted-foreground mb-3">Growth milestones</p>
          <div className="space-y-2">
            {milestones.map((y) => {
              const ny = y * 12;
              const fv = P * Math.pow(1 + r, ny) + m * ((Math.pow(1 + r, ny) - 1) / r);
              const contrib = P + m * ny;
              return (
                <div key={y} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                  <span className="text-[12px] text-muted-foreground">Year {y}</span>
                  <div className="text-right">
                    <span className="text-[13px] font-semibold text-foreground">{fmt(fv, currency)}</span>
                    <span className="text-[11px] text-emerald-600 ml-2">+{fmt(fv - contrib, currency)} interest</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
