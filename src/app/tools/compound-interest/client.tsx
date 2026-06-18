"use client";

import { useState } from "react";

const FREQUENCIES = [
  { id: "1", label: "Annually" },
  { id: "4", label: "Quarterly" },
  { id: "12", label: "Monthly" },
  { id: "365", label: "Daily" },
];

export function CompoundInterestClient() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [n, setN] = useState("12");
  const [contribution, setContribution] = useState("");

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseFloat(years) || 0;
  const nNum = parseInt(n);
  const PMT = parseFloat(contribution) || 0;

  let finalAmount = 0;
  let interest = 0;
  let totalContributions = 0;

  if (P > 0 || PMT > 0) {
    finalAmount = P * Math.pow(1 + r / nNum, nNum * t);
    if (PMT > 0 && r > 0) {
      finalAmount += PMT * ((Math.pow(1 + r / nNum, nNum * t) - 1) / (r / nNum));
    } else if (PMT > 0) {
      finalAmount += PMT * nNum * t;
    }
    totalContributions = P + PMT * nNum * t;
    interest = finalAmount - totalContributions;
  }

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const rows: { label: string; year: number; amount: number }[] = [];
  for (let yr = 1; yr <= Math.min(Math.ceil(t), 30); yr++) {
    let amt = P * Math.pow(1 + r / nNum, nNum * yr);
    const contribSoFar = P + PMT * nNum * yr;
    if (PMT > 0 && r > 0) {
      amt += PMT * ((Math.pow(1 + r / nNum, nNum * yr) - 1) / (r / nNum));
    } else if (PMT > 0) {
      amt += PMT * nNum * yr;
    }
    rows.push({ label: `Year ${yr}`, year: yr, amount: amt });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Initial principal ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="10000"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Annual interest rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="7"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Time period (years)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="10"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Monthly contribution ($)</label>
            <input
              type="number"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              placeholder="0 (optional)"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Compounding frequency</label>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f.id}
                onClick={() => setN(f.id)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  n === f.id
                    ? "bg-foreground text-background"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {finalAmount > 0 && (
        <>
          <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
            <div>
              <p className="text-[12px] text-neutral-400">Final amount</p>
              <p className="text-[32px] font-bold">${fmt(finalAmount)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
              <div>
                <p className="text-[12px] text-neutral-400">Total invested</p>
                <p className="text-[16px] font-semibold">${fmt(totalContributions)}</p>
              </div>
              <div>
                <p className="text-[12px] text-neutral-400">Interest earned</p>
                <p className="text-[16px] font-semibold text-emerald-400">${fmt(interest)}</p>
              </div>
            </div>
          </div>

          {rows.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
              <p className="text-[12px] font-semibold text-foreground mb-3">Year-by-year breakdown</p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {rows.map((r) => (
                  <div key={r.year} className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground w-12 shrink-0">{r.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.min(100, (r.amount / finalAmount) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-foreground w-24 text-right shrink-0">
                      ${fmt(r.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
