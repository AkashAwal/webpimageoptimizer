"use client";
import { useState } from "react";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function RetirementCalculatorClient() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);

  const years = Math.max(0, retirementAge - currentAge);
  const r = rate / 100 / 12;
  const n = years * 12;

  const fvLump = currentSavings * Math.pow(1 + r, n);
  const fvAnnuity = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) : monthly * n;
  const total = fvLump + fvAnnuity;
  const totalContributions = currentSavings + monthly * n;
  const growth = total - totalContributions;

  const milestones: { age: number; balance: number }[] = [];
  for (let y = 5; y <= years; y += 5) {
    const mn = y * 12;
    const fl = currentSavings * Math.pow(1 + r, mn);
    const fa = r > 0 ? monthly * ((Math.pow(1 + r, mn) - 1) / r) : monthly * mn;
    milestones.push({ age: currentAge + y, balance: fl + fa });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Current Age</label>
            <input
              type="number"
              min={18}
              max={80}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Retirement Age</label>
            <input
              type="number"
              min={30}
              max={90}
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">Current Savings ($)</label>
          <input
            type="number"
            min={0}
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">Monthly Contribution ($)</label>
          <input
            type="number"
            min={0}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">
            Expected Annual Return: <span className="text-foreground font-semibold">{rate}%</span>
          </label>
          <input
            type="range"
            min={1}
            max={15}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-foreground"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span>1%</span>
            <span>Conservative 4–5%</span>
            <span>Equity 7–10%</span>
            <span>15%</span>
          </div>
        </div>
      </div>

      {years > 0 && (
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[12px] font-medium text-muted-foreground mb-4">
            Projected at age {retirementAge} — {years} years from now
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-[11px] text-emerald-700 font-medium mb-1">Nest Egg</p>
              <p className="text-[17px] font-semibold text-emerald-800">{formatCurrency(total)}</p>
            </div>
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
              <p className="text-[11px] text-muted-foreground font-medium mb-1">Total Contributed</p>
              <p className="text-[15px] font-semibold text-foreground">{formatCurrency(totalContributions)}</p>
            </div>
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
              <p className="text-[11px] text-muted-foreground font-medium mb-1">Investment Growth</p>
              <p className="text-[15px] font-semibold text-foreground">{formatCurrency(growth)}</p>
            </div>
          </div>

          {milestones.length > 0 && (
            <>
              <p className="text-[12px] font-medium text-muted-foreground mb-3">Growth milestones</p>
              <div className="space-y-0">
                {milestones.map((m) => (
                  <div
                    key={m.age}
                    className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
                  >
                    <span className="text-[13px] text-muted-foreground">Age {m.age}</span>
                    <span className="text-[13px] font-medium text-foreground">{formatCurrency(m.balance)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
