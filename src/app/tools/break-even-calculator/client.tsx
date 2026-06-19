"use client";

import { useState } from "react";

export function BreakEvenCalculatorClient() {
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCost, setVariableCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [currency, setCurrency] = useState("$");

  const fc = parseFloat(fixedCosts);
  const vc = parseFloat(variableCost);
  const sp = parseFloat(sellingPrice);
  const valid = !isNaN(fc) && !isNaN(vc) && !isNaN(sp) && sp > vc;

  const contribution = valid ? sp - vc : 0;
  const bepUnits = valid ? fc / contribution : 0;
  const bepRevenue = bepUnits * sp;
  const marginRate = valid ? (contribution / sp * 100) : 0;

  const profitAtVolumes = [1, 2, 5, 10].map((mult) => {
    const units = Math.ceil(bepUnits * mult);
    const revenue = units * sp;
    const totalCosts = fc + units * vc;
    return { units, revenue, profit: revenue - totalCosts };
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["$", "£", "€"].map((c) => (
          <button key={c} onClick={() => setCurrency(c)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${currency === c ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >{c}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: `Fixed costs (${currency})`, val: fixedCosts, set: setFixedCosts, ph: "5000" },
            { label: `Variable cost / unit (${currency})`, val: variableCost, set: setVariableCost, ph: "12" },
            { label: `Selling price / unit (${currency})`, val: sellingPrice, set: setSellingPrice, ph: "25" },
          ].map(({ label, val, set, ph }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ))}
        </div>

        {valid && (
          <div className="rounded-xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">Break-even point</p>
            <p className="text-[48px] font-bold">{Math.ceil(bepUnits).toLocaleString()} units</p>
            <p className="text-[14px] text-neutral-300 mt-1">{currency}{bepRevenue.toLocaleString("en", { maximumFractionDigits: 0 })} in revenue</p>
          </div>
        )}

        {sp <= vc && sellingPrice && variableCost && (
          <p className="text-[12px] text-red-500">Selling price must be greater than variable cost per unit.</p>
        )}

        {valid && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
              <p className="text-[11px] text-muted-foreground">Contribution margin / unit</p>
              <p className="text-[22px] font-bold text-foreground mt-1">{currency}{contribution.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
              <p className="text-[11px] text-muted-foreground">Contribution margin ratio</p>
              <p className="text-[22px] font-bold text-foreground mt-1">{marginRate.toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      {valid && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
          <p className="text-[12px] font-medium text-muted-foreground mb-3">Profit at various volumes</p>
          <div className="space-y-2">
            {profitAtVolumes.map(({ units, revenue, profit }) => (
              <div key={units} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
                <span className="text-[12px] text-foreground">{units.toLocaleString()} units ({currency}{revenue.toLocaleString("en", { maximumFractionDigits: 0 })})</span>
                <span className={`text-[12px] font-semibold ${profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {profit >= 0 ? "+" : ""}{currency}{Math.abs(profit).toLocaleString("en", { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
