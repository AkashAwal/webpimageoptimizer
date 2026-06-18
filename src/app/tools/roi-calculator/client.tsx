"use client";

import { useState } from "react";

export function RoiCalculatorClient() {
  const [initial, setInitial] = useState("");
  const [finalVal, setFinalVal] = useState("");
  const [years, setYears] = useState("");

  const inv = parseFloat(initial) || 0;
  const fin = parseFloat(finalVal) || 0;
  const yrs = parseFloat(years) || 0;

  const gain = fin - inv;
  const roi = inv > 0 ? (gain / inv) * 100 : 0;
  const annualised = inv > 0 && yrs > 0 ? (Math.pow(fin / inv, 1 / yrs) - 1) * 100 : null;

  const fmt2 = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const hasResult = inv > 0 && fin > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Initial investment ($)</label>
            <input
              type="number"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              placeholder="10000"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Final value ($)</label>
            <input
              type="number"
              value={finalVal}
              onChange={(e) => setFinalVal(e.target.value)}
              placeholder="15000"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[12px] font-medium text-muted-foreground">
              Time period (years) <span className="text-neutral-400">— optional, for annualised rate</span>
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="3"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      {hasResult && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
          <div>
            <p className="text-[12px] text-neutral-400">Total ROI</p>
            <p className={`text-[42px] font-bold ${roi >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
            <div>
              <p className="text-[11px] text-neutral-400">Net gain / loss</p>
              <p className={`text-[16px] font-semibold ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {gain >= 0 ? "+" : ""}${fmt2(gain)}
              </p>
            </div>
            {annualised !== null && (
              <div>
                <p className="text-[11px] text-neutral-400">Annualised return (CAGR)</p>
                <p className={`text-[16px] font-semibold ${annualised >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {annualised >= 0 ? "+" : ""}{annualised.toFixed(2)}% / yr
                </p>
              </div>
            )}
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between text-[13px]">
            <span className="text-neutral-400">Initial: ${fmt2(inv)}</span>
            <span className="text-neutral-400">Final: ${fmt2(fin)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
