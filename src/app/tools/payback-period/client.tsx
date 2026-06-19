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

export function PaybackPeriodClient() {
  const [investment, setInvestment] = useState(100000);
  const [mode, setMode] = useState<"simple" | "irregular">("simple");
  const [annualCashFlow, setAnnualCashFlow] = useState(25000);
  const [cashFlows, setCashFlows] = useState<number[]>([20000, 25000, 30000, 30000, 25000, 20000, 15000, 10000]);

  const updateFlow = (i: number, v: number) => {
    setCashFlows((f) => f.map((x, idx) => (idx === i ? v : x)));
  };

  const addYear = () => setCashFlows((f) => [...f, 10000]);
  const removeYear = (i: number) => setCashFlows((f) => f.filter((_, idx) => idx !== i));

  let paybackYears: number | null = null;
  let paybackMonths: number | null = null;
  const rows: { year: number; cashFlow: number; cumulative: number }[] = [];

  if (mode === "simple") {
    if (annualCashFlow > 0) {
      const exact = investment / annualCashFlow;
      paybackYears = Math.floor(exact);
      paybackMonths = Math.round((exact - paybackYears) * 12);
      const maxYears = Math.ceil(exact) + 2;
      let cum = -investment;
      for (let y = 1; y <= maxYears; y++) {
        cum += annualCashFlow;
        rows.push({ year: y, cashFlow: annualCashFlow, cumulative: cum });
      }
    }
  } else {
    let cum = -investment;
    for (let i = 0; i < cashFlows.length; i++) {
      const prev = cum;
      cum += cashFlows[i];
      rows.push({ year: i + 1, cashFlow: cashFlows[i], cumulative: cum });
      if (paybackYears === null && cum >= 0) {
        paybackYears = i;
        const remaining = -prev;
        paybackMonths = Math.round((remaining / cashFlows[i]) * 12);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">Initial Investment ($)</label>
          <input
            type="number"
            min={0}
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        <div className="flex gap-2">
          {(["simple", "irregular"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                mode === m
                  ? "bg-foreground text-background"
                  : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
              }`}
            >
              {m === "simple" ? "Equal Annual Cash Flow" : "Year-by-Year Cash Flows"}
            </button>
          ))}
        </div>

        {mode === "simple" ? (
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Annual Cash Flow ($)</label>
            <input
              type="number"
              min={1}
              value={annualCashFlow}
              onChange={(e) => setAnnualCashFlow(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-[12px] font-medium text-muted-foreground">Cash flows by year</label>
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
            <button
              onClick={addYear}
              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              + Add year
            </button>
          </div>
        )}

        {paybackYears !== null ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
            <p className="text-[12px] text-emerald-700 font-medium mb-1">Payback Period</p>
            <p className="text-[22px] font-semibold text-emerald-800">
              {paybackYears} year{paybackYears !== 1 ? "s" : ""}
              {paybackMonths !== null && paybackMonths > 0 ? `, ${paybackMonths} month${paybackMonths !== 1 ? "s" : ""}` : ""}
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
            <p className="text-[13px] text-amber-700">Investment not recovered within the provided cash flow period.</p>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6">
          <p className="text-[12px] font-medium text-muted-foreground mb-3">Cumulative cash flow</p>
          <div className="grid grid-cols-3 gap-2 mb-2 text-center">
            <span className="text-[11px] font-medium text-muted-foreground">Year</span>
            <span className="text-[11px] font-medium text-muted-foreground">Cash Flow</span>
            <span className="text-[11px] font-medium text-muted-foreground">Cumulative</span>
          </div>
          <div className="space-y-0">
            <div className="grid grid-cols-3 gap-2 text-center py-1 border-b border-neutral-100">
              <span className="text-[12px] text-muted-foreground">0</span>
              <span className="text-[12px] text-foreground">—</span>
              <span className="text-[12px] font-medium text-red-600">{fmt(-investment)}</span>
            </div>
            {rows.map((r) => (
              <div
                key={r.year}
                className={`grid grid-cols-3 gap-2 text-center py-1 border-b border-neutral-100 last:border-0 ${
                  r.cumulative >= 0 ? "bg-emerald-50/50" : ""
                }`}
              >
                <span className="text-[12px] text-muted-foreground">{r.year}</span>
                <span className="text-[12px] text-foreground">{fmt(r.cashFlow)}</span>
                <span className={`text-[12px] font-medium ${r.cumulative >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                  {fmt(r.cumulative)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
