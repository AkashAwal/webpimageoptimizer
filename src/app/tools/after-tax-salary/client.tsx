"use client";
import { useState } from "react";

const BRACKETS_SINGLE = [
  { max: 11600, rate: 0.10 },
  { max: 47150, rate: 0.12 },
  { max: 100525, rate: 0.22 },
  { max: 191950, rate: 0.24 },
  { max: 243725, rate: 0.32 },
  { max: 609350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];
const BRACKETS_MFJ = BRACKETS_SINGLE.map(b => ({ max: b.max === Infinity ? Infinity : b.max * 2, rate: b.rate }));

const SS_WAGE_BASE = 168600;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADD_MEDICARE_THRESHOLD_SINGLE = 200000;
const ADD_MEDICARE_THRESHOLD_MFJ = 250000;
const ADD_MEDICARE_RATE = 0.009;

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}
function calcFedTax(taxable: number, brackets: typeof BRACKETS_SINGLE) {
  let prev = 0, tax = 0;
  for (const b of brackets) {
    if (taxable <= prev) break;
    tax += (Math.min(taxable, b.max) - prev) * b.rate;
    prev = b.max;
  }
  return tax;
}

export function AfterTaxSalaryClient() {
  const [grossSalary, setGrossSalary] = useState(75000);
  const [filingStatus, setFilingStatus] = useState<"single" | "mfj">("single");
  const [preRetirement, setPreRetirement] = useState(0);
  const [preHsa, setPreHsa] = useState(0);
  const [stateTaxRate, setStateTaxRate] = useState(5);

  const stdDeduction = filingStatus === "single" ? 14600 : 29200;
  const brackets = filingStatus === "single" ? BRACKETS_SINGLE : BRACKETS_MFJ;
  const addMedicareThreshold = filingStatus === "single" ? ADD_MEDICARE_THRESHOLD_SINGLE : ADD_MEDICARE_THRESHOLD_MFJ;

  const preTaxTotal = preRetirement + preHsa;
  const ficarBase = Math.max(0, grossSalary - preRetirement - preHsa);
  const federalTaxable = Math.max(0, grossSalary - preTaxTotal - stdDeduction);

  const federalTax = calcFedTax(federalTaxable, brackets);
  const ssTax = Math.min(ficarBase, SS_WAGE_BASE) * SS_RATE;
  const medicareTax = ficarBase * MEDICARE_RATE;
  const addMedicare = ficarBase > addMedicareThreshold ? (ficarBase - addMedicareThreshold) * ADD_MEDICARE_RATE : 0;
  const stateTax = grossSalary * (stateTaxRate / 100);
  const totalTax = federalTax + ssTax + medicareTax + addMedicare + stateTax;
  const netAnnual = grossSalary - totalTax;

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
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Gross Annual Salary ($)</label>
            <input type="number" min={0} value={grossSalary} onChange={e => setGrossSalary(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">State Tax Rate (%)</label>
            <input type="number" min={0} max={20} step={0.1} value={stateTaxRate} onChange={e => setStateTaxRate(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Pre-tax 401(k) / IRA ($)</label>
            <input type="number" min={0} value={preRetirement} onChange={e => setPreRetirement(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">HSA Contribution ($)</label>
            <input type="number" min={0} value={preHsa} onChange={e => setPreHsa(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Annual", val: fmt(netAnnual) },
            { label: "Monthly", val: fmt(netAnnual / 12) },
            { label: "Bi-weekly", val: fmt(netAnnual / 26) },
            { label: "Weekly", val: fmt(netAnnual / 52) },
          ].map(r => (
            <div key={r.label} className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-[11px] text-emerald-700 font-medium mb-1">Take-Home ({r.label})</p>
              <p className="text-[15px] font-semibold text-emerald-800">{r.val}</p>
            </div>
          ))}
        </div>

        <div className="space-y-1 text-[13px]">
          {[
            { label: "Federal income tax", val: fmt(federalTax) },
            { label: "Social Security (6.2%)", val: fmt(ssTax) },
            { label: "Medicare (1.45%)", val: fmt(medicareTax) },
            ...(addMedicare > 0 ? [{ label: "Additional Medicare (0.9%)", val: fmt(addMedicare) }] : []),
            { label: `State income tax (${stateTaxRate}%)`, val: fmt(stateTax) },
            { label: "Total deductions", val: fmt(totalTax) },
            { label: "Effective total rate", val: `${((totalTax / grossSalary) * 100).toFixed(1)}%` },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-neutral-100 last:border-0">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-medium text-foreground">{r.val}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">2024 US federal brackets + FICA. State rate is flat estimate. For guidance only.</p>
      </div>
    </div>
  );
}
