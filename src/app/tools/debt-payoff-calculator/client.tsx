"use client";

import { useState } from "react";

function calcPayoff(balance: number, annualRate: number, monthlyPayment: number) {
  const monthly = annualRate / 100 / 12;
  let b = balance;
  let months = 0;
  let totalInterest = 0;
  while (b > 0 && months < 600) {
    const interest = b * monthly;
    totalInterest += interest;
    b = b + interest - monthlyPayment;
    if (b < 0) b = 0;
    months++;
  }
  return { months, totalInterest };
}

export function DebtPayoffCalculatorClient() {
  const [balance, setBalance] = useState("");
  const [rate, setRate] = useState("");
  const [payment, setPayment] = useState("");
  const [extra, setExtra] = useState("");

  const b = parseFloat(balance);
  const r = parseFloat(rate);
  const p = parseFloat(payment);
  const e = parseFloat(extra) || 0;
  const monthly = r / 100 / 12;
  const minPayment = b * monthly;
  const valid = !isNaN(b) && !isNaN(r) && !isNaN(p) && b > 0 && r > 0 && p > minPayment;

  const base = valid ? calcPayoff(b, r, p) : null;
  const extra_ = valid && e > 0 ? calcPayoff(b, r, p + e) : null;

  const fmtMonths = (m: number) => {
    const y = Math.floor(m / 12);
    const mo = m % 12;
    if (y === 0) return `${mo} month${mo !== 1 ? "s" : ""}`;
    if (mo === 0) return `${y} year${y !== 1 ? "s" : ""}`;
    return `${y}y ${mo}mo`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        {[
          { label: "Current balance ($)", val: balance, set: setBalance, ph: "5000" },
          { label: "Annual interest rate (%)", val: rate, set: setRate, ph: "19.99" },
          { label: "Monthly payment ($)", val: payment, set: setPayment, ph: "200" },
          { label: "Extra monthly payment ($, optional)", val: extra, set: setExtra, ph: "50" },
        ].map(({ label, val, set, ph }) => (
          <div key={label} className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
            <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[15px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        ))}
        {valid && !isNaN(minPayment) && (
          <p className="text-[11px] text-muted-foreground">Minimum interest-only payment: ${minPayment.toFixed(2)}/mo. Your payment must exceed this to pay down the principal.</p>
        )}
      </div>

      {valid && base && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="p-4 bg-neutral-900 text-white">
              <p className="text-[11px] text-neutral-400">Debt-free in</p>
              <p className="text-[32px] font-bold">{fmtMonths(base.months)}</p>
              <p className="text-[12px] text-neutral-400 mt-1">Total interest paid: ${base.totalInterest.toFixed(2)}</p>
            </div>
            {extra_ && (
              <div className="p-4 bg-emerald-50 border-t border-emerald-200">
                <p className="text-[11px] text-emerald-600">With ${e.toFixed(0)} extra/month</p>
                <p className="text-[24px] font-bold text-emerald-800">{fmtMonths(extra_.months)}</p>
                <p className="text-[12px] text-emerald-600 mt-1">
                  Save {fmtMonths(base.months - extra_.months)} · Save ${(base.totalInterest - extra_.totalInterest).toFixed(2)} in interest
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <p className="text-[12px] font-medium text-muted-foreground mb-2">Debt avalanche vs snowball</p>
            <p className="text-[12px] text-muted-foreground">If you have multiple debts, the <strong>avalanche method</strong> (pay highest interest first) saves the most money. The <strong>snowball method</strong> (pay smallest balance first) provides faster psychological wins. Both work — the best method is the one you stick with.</p>
          </div>
        </div>
      )}
    </div>
  );
}
