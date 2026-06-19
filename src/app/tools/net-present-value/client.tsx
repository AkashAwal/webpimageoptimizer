"use client";
import { useState } from "react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function calcNPV(rate: number, initial: number, flows: number[]): number {
  const r = rate / 100;
  const pv = flows.reduce((sum, cf, i) => sum + cf / Math.pow(1 + r, i + 1), 0);
  return pv - initial;
}

function estimateIRR(initial: number, flows: number[]): number | null {
  let lo = -0.999;
  let hi = 10;
  const f = (r: number) => flows.reduce((s, c, i) => s + c / Math.pow(1 + r, i + 1), -initial);
  if (f(lo) * f(hi) > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 100;
}

export function NetPresentValueClient() {
  const [discountRate, setDiscountRate] = useState(10);
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [cashFlows, setCashFlows] = useState<number[]>([20000, 30000, 40000, 35000, 30000]);

  const updateFlow = (i: number, v: number) => setCashFlows((f) => f.map((x, idx) => (idx === i ? v : x)));
  const addYear = () => setCashFlows((f) => [...f, 20000]);
  const removeYear = (i: number) => setCashFlows((f) => f.filter((_, idx) => idx !== i));

  const npv = calcNPV(discountRate, initialInvestment, cashFlows);
  const irr = estimateIRR(initialInvestment, cashFlows);
  const r = discountRate / 100;

  const pvRows = cashFlows.map((cf, i) => ({
    year: i + 1,
    cf,
    pv: cf / Math.pow(1 + r, i + 1),
  }));
  const totalPV = pvRows.reduce((s, row) => s + row.pv, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Initial Investment ($)</label>
            <input
              type="number"
              min={0}
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Discount Rate: <span className="text-foreground font-semibold">{discountRate}%</span>
            </label>
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={discountRate}
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              className="w-full accent-foreground mt-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[12px] font-medium text-muted-foreground">Expected Annual Cash Flows ($)</label>
          {cashFlows.map((cf, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-[12px] text-muted-foreground w-14">Year {i + 1}</span>
              <input
                type="number"
                value={cf}
                onChange={(e) => updateFlow(i, Number(e.target.value))}
                className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              {cashFlows.length > 1 && (
                <button
                  onClick={() => removeYear(i)}
                  className="text-[12px] text-neutral-400 hover:text-neutral-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button onClick={addYear} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
            + Add year
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            className={`rounded-xl p-4 text-center col-span-2 sm:col-span-1 ${
              npv >= 0 ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"
            }`}
          >
            <p className={`text-[11px] font-medium mb-1 ${npv >= 0 ? "text-emerald-700" : "text-red-700"}`}>NPV</p>
            <p className={`text-[22px] font-semibold ${npv >= 0 ? "text-emerald-800" : "text-red-800"}`}>{fmt(npv)}</p>
            <p className={`text-[11px] mt-1 ${npv >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {npv >= 0 ? "Accept — positive return" : "Reject — destroys value"}
            </p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Total PV of Cash Flows</p>
            <p className="text-[15px] font-semibold text-foreground">{fmt(totalPV)}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Estimated IRR</p>
            <p className="text-[15px] font-semibold text-foreground">
              {irr !== null ? `${irr.toFixed(2)}%` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6">
        <p className="text-[12px] font-medium text-muted-foreground mb-3">Present value of each cash flow</p>
        <div className="grid grid-cols-3 gap-2 mb-2 text-center">
          <span className="text-[11px] font-medium text-muted-foreground">Year</span>
          <span className="text-[11px] font-medium text-muted-foreground">Cash Flow</span>
          <span className="text-[11px] font-medium text-muted-foreground">Present Value</span>
        </div>
        <div className="space-y-0">
          <div className="grid grid-cols-3 gap-2 text-center py-1 border-b border-neutral-100">
            <span className="text-[12px] text-muted-foreground">0</span>
            <span className="text-[12px] text-foreground">{fmt(-initialInvestment)}</span>
            <span className="text-[12px] font-medium text-red-600">{fmt(-initialInvestment)}</span>
          </div>
          {pvRows.map((row) => (
            <div key={row.year} className="grid grid-cols-3 gap-2 text-center py-1 border-b border-neutral-100 last:border-0">
              <span className="text-[12px] text-muted-foreground">{row.year}</span>
              <span className="text-[12px] text-foreground">{fmt(row.cf)}</span>
              <span className="text-[12px] font-medium text-foreground">{fmt(row.pv)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
