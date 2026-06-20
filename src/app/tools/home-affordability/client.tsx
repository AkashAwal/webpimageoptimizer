"use client";
import { useState } from "react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}
function fmt2(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function HomeAffordabilityClient() {
  const [annualIncome, setAnnualIncome] = useState(80000);
  const [monthlyDebts, setMonthlyDebts] = useState(400);
  const [downPayment, setDownPayment] = useState(40000);
  const [rate, setRate] = useState(6.8);
  const [term, setTerm] = useState(30);
  const [frontEndLimit, setFrontEndLimit] = useState(28);
  const [backEndLimit, setBackEndLimit] = useState(36);

  const monthlyIncome = annualIncome / 12;
  const maxHousingPayment = monthlyIncome * (frontEndLimit / 100);
  const maxTotalDebt = monthlyIncome * (backEndLimit / 100);
  const maxFromBackEnd = maxTotalDebt - monthlyDebts;
  const maxMonthlyPayment = Math.min(maxHousingPayment, maxFromBackEnd);

  const r = rate / 100 / 12;
  const n = term * 12;
  const maxLoan = maxMonthlyPayment > 0 && r > 0
    ? maxMonthlyPayment * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)))
    : 0;
  const maxHomePrice = maxLoan + downPayment;
  const downPct = maxHomePrice > 0 ? (downPayment / maxHomePrice) * 100 : 0;

  const actualMonthlyPayment = maxMonthlyPayment;
  const totalPaid = actualMonthlyPayment * n;
  const totalInterest = totalPaid - maxLoan;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Annual Gross Income ($)</label>
            <input type="number" min={0} value={annualIncome} onChange={e => setAnnualIncome(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Monthly Debt Payments ($)</label>
            <input type="number" min={0} value={monthlyDebts} onChange={e => setMonthlyDebts(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            <p className="text-[11px] text-muted-foreground mt-1">Car, student loans, credit cards, etc.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Down Payment ($)</label>
            <input type="number" min={0} value={downPayment} onChange={e => setDownPayment(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Interest Rate (%)</label>
            <input type="number" min={0} max={20} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Loan Term (years)</label>
            <div className="flex gap-2">
              {[15, 20, 30].map(y => (
                <button key={y} onClick={() => setTerm(y)}
                  className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${term === y ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
                  {y}yr
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">DTI Limits (front / back)</label>
            <div className="flex gap-2">
              <input type="number" min={20} max={40} value={frontEndLimit} onChange={e => setFrontEndLimit(Number(e.target.value))}
                className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
              <input type="number" min={30} max={55} value={backEndLimit} onChange={e => setBackEndLimit(Number(e.target.value))}
                className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center col-span-2">
            <p className="text-[11px] text-emerald-700 font-medium mb-1">Max Home Price</p>
            <p className="text-[22px] font-semibold text-emerald-800">{fmt(maxHomePrice)}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Max Loan</p>
            <p className="text-[15px] font-semibold text-foreground">{fmt(maxLoan)}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Down %</p>
            <p className="text-[15px] font-semibold text-foreground">{downPct.toFixed(1)}%</p>
          </div>
        </div>

        <div className="space-y-2 text-[13px]">
          {[
            { label: "Max monthly housing payment (front-end DTI)", val: fmt2(maxHousingPayment) },
            { label: "Max total monthly debt (back-end DTI)", val: fmt2(maxTotalDebt) },
            { label: "Available for housing (after existing debts)", val: fmt2(maxFromBackEnd) },
            { label: "Binding limit", val: fmt2(maxMonthlyPayment) },
            { label: "Total interest over loan term", val: fmt(totalInterest) },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-neutral-100 last:border-0">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-medium text-foreground">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
