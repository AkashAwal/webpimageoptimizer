"use client";

import { useState } from "react";

export function SavingsGoalCalculatorClient() {
  const [goal, setGoal] = useState("");
  const [current, setCurrent] = useState("");
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("5");

  const G = parseFloat(goal) || 0;
  const C = parseFloat(current) || 0;
  const PMT = parseFloat(monthly) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const remaining = G - C;

  let months: number | null = null;
  let totalContributions = 0;
  let totalInterest = 0;

  if (G > 0 && C >= G) {
    months = 0;
  } else if (G > 0 && PMT > 0 && remaining > 0) {
    if (r > 0) {
      const ratio = PMT / (PMT - remaining * r);
      if (ratio > 0) {
        months = Math.ceil(Math.log(ratio) / Math.log(1 + r));
      }
    } else {
      months = Math.ceil(remaining / PMT);
    }
    if (months !== null && months > 0) {
      let balance = C;
      for (let m = 0; m < months; m++) {
        balance += balance * r + PMT;
      }
      totalContributions = C + PMT * months;
      totalInterest = balance - totalContributions;
    }
  }

  const fmt2 = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const yearsAndMonths = (m: number) => {
    const y = Math.floor(m / 12);
    const mo = m % 12;
    if (y === 0) return `${mo} month${mo !== 1 ? "s" : ""}`;
    if (mo === 0) return `${y} year${y !== 1 ? "s" : ""}`;
    return `${y} year${y !== 1 ? "s" : ""} and ${mo} month${mo !== 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Savings goal ($)</label>
            <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="10000"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Current savings ($)</label>
            <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Monthly contribution ($)</label>
            <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="200"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Annual interest rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="5"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
        </div>
      </div>

      {months !== null && G > 0 && PMT > 0 && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
          {months === 0 ? (
            <p className="text-[18px] font-bold text-emerald-400">You&apos;ve already reached your goal!</p>
          ) : (
            <>
              <div>
                <p className="text-[12px] text-neutral-400">Time to reach goal</p>
                <p className="text-[32px] font-bold">{yearsAndMonths(months)}</p>
                <p className="text-[13px] text-neutral-400">{months} total months</p>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-3">
                <div>
                  <p className="text-[11px] text-neutral-400">Goal</p>
                  <p className="text-[14px] font-semibold">${fmt2(G)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Contributed</p>
                  <p className="text-[14px] font-semibold">${fmt2(totalContributions)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Interest earned</p>
                  <p className="text-[14px] font-semibold text-emerald-400">${fmt2(totalInterest)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
