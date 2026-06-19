"use client";

import { useState } from "react";

const EXPENSE_CATS = [
  { label: "Housing (rent/mortgage)", val: "" },
  { label: "Utilities", val: "" },
  { label: "Groceries", val: "" },
  { label: "Transport", val: "" },
  { label: "Insurance", val: "" },
  { label: "Minimum debt payments", val: "" },
  { label: "Other essentials", val: "" },
];

export function EmergencyFundCalculatorClient() {
  const [expenses, setExpenses] = useState<string[]>(EXPENSE_CATS.map((e) => e.val));
  const [months, setMonths] = useState(6);
  const [savings, setSavings] = useState("");
  const [monthlySaving, setMonthlySaving] = useState("");

  const totalMonthly = expenses.reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  const target = totalMonthly * months;
  const current = parseFloat(savings) || 0;
  const shortfall = Math.max(0, target - current);
  const ms = parseFloat(monthlySaving) || 0;
  const monthsToGoal = ms > 0 ? Math.ceil(shortfall / ms) : null;

  const valid = totalMonthly > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div>
          <label className="text-[12px] font-medium text-muted-foreground block mb-2">Monthly essential expenses ($)</label>
          <div className="space-y-2">
            {EXPENSE_CATS.map((cat, i) => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="text-[12px] text-muted-foreground flex-1">{cat.label}</span>
                <input type="number" value={expenses[i]} onChange={(e) => setExpenses(prev => { const n = [...prev]; n[i] = e.target.value; return n; })} placeholder="0"
                  className="w-28 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[13px] text-right font-medium text-foreground outline-none focus:border-neutral-400 transition-colors" />
              </div>
            ))}
          </div>
          {valid && <p className="text-[12px] font-medium text-foreground mt-2">Total: ${totalMonthly.toFixed(2)}/month</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Target fund size</label>
          <div className="flex gap-2">
            {[3, 4, 6, 9, 12].map((m) => (
              <button key={m} onClick={() => setMonths(m)} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${months === m ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>{m} months</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Current savings ($)</label>
            <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} placeholder="0"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Monthly saving ($)</label>
            <input type="number" value={monthlySaving} onChange={(e) => setMonthlySaving(e.target.value)} placeholder="500"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>
      </div>

      {valid && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">Emergency fund target ({months} months)</p>
            <p className="text-[42px] font-bold">${target.toFixed(0)}</p>
            {current > 0 && (
              <p className="text-[13px] text-neutral-300 mt-2">
                {shortfall > 0 ? `$${shortfall.toFixed(0)} to go (${((current / target) * 100).toFixed(0)}% complete)` : "Target reached!"}
              </p>
            )}
          </div>
          {monthsToGoal !== null && shortfall > 0 && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
              <p className="text-[13px] text-emerald-800 font-medium">At ${ms.toFixed(0)}/month, you&apos;ll reach your target in <strong>{monthsToGoal} months</strong></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
