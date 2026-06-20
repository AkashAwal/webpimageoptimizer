"use client";
import { useState } from "react";

const BRACKETS_SINGLE_2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

const BRACKETS_MFJ_2024 = BRACKETS_SINGLE_2024.map(b => ({
  min: b.min === 0 ? 0 : b.min * 2,
  max: b.max === Infinity ? Infinity : b.max * 2,
  rate: b.rate,
}));

const STANDARD_DEDUCTION = { single: 14600, mfj: 29200 };

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}
function pct(n: number) { return (n * 100).toFixed(1) + "%"; }

export function TaxBracketCalculatorClient() {
  const [income, setIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState<"single" | "mfj">("single");
  const [additionalDeductions, setAdditionalDeductions] = useState(0);

  const brackets = filingStatus === "single" ? BRACKETS_SINGLE_2024 : BRACKETS_MFJ_2024;
  const standardDeduction = filingStatus === "single" ? STANDARD_DEDUCTION.single : STANDARD_DEDUCTION.mfj;
  const totalDeductions = standardDeduction + additionalDeductions;
  const taxableIncome = Math.max(0, income - totalDeductions);

  let totalTax = 0;
  const breakdown: { rate: number; taxable: number; tax: number }[] = [];
  for (const b of brackets) {
    if (taxableIncome <= b.min) break;
    const taxable = Math.min(taxableIncome, b.max) - b.min;
    const tax = taxable * b.rate;
    totalTax += tax;
    breakdown.push({ rate: b.rate, taxable, tax });
  }

  const effectiveRate = income > 0 ? totalTax / income : 0;
  const marginalRate = brackets.find(b => taxableIncome > b.min && taxableIncome <= b.max)?.rate ?? 0;
  const afterTaxIncome = income - totalTax;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="flex gap-2">
          {(["single", "mfj"] as const).map(s => (
            <button key={s} onClick={() => setFilingStatus(s)}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${filingStatus === s ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
              {s === "single" ? "Single" : "Married Filing Jointly"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Gross Annual Income ($)</label>
            <input type="number" min={0} value={income} onChange={e => setIncome(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Additional Deductions ($)</label>
            <input type="number" min={0} value={additionalDeductions} onChange={e => setAdditionalDeductions(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            <p className="text-[11px] text-muted-foreground mt-1">Mortgage interest, charitable donations, etc.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center col-span-2">
            <p className="text-[11px] text-emerald-700 font-medium mb-1">Federal Tax Owed</p>
            <p className="text-[22px] font-semibold text-emerald-800">{fmt(totalTax)}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Effective Rate</p>
            <p className="text-[15px] font-semibold text-foreground">{pct(effectiveRate)}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Marginal Rate</p>
            <p className="text-[15px] font-semibold text-foreground">{pct(marginalRate)}</p>
          </div>
        </div>

        <div className="space-y-1 text-[13px]">
          {[
            { label: "Gross income", val: fmt(income) },
            { label: `Standard deduction (${filingStatus === "single" ? "single" : "MFJ"})`, val: `−${fmt(standardDeduction)}` },
            { label: "Additional deductions", val: additionalDeductions > 0 ? `−${fmt(additionalDeductions)}` : fmt(0) },
            { label: "Taxable income", val: fmt(taxableIncome) },
            { label: "After-tax income", val: fmt(afterTaxIncome) },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-neutral-100 last:border-0">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-medium text-foreground">{r.val}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Bracket Breakdown</p>
          <div className="space-y-1">
            {breakdown.map(b => (
              <div key={b.rate} className="flex justify-between items-center py-1.5 text-[13px] border-b border-neutral-100 last:border-0">
                <span className="text-muted-foreground">{pct(b.rate)} on {fmt(b.taxable)}</span>
                <span className="font-medium text-foreground">{fmt(b.tax)}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">2024 US federal income tax. Does not include state tax, FICA, or AMT. For guidance only.</p>
      </div>
    </div>
  );
}
