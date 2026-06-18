"use client";

import { useState } from "react";

type Mode = "cost-revenue" | "cost-margin" | "revenue-margin";

function fmt2(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function MarginCalculatorClient() {
  const [mode, setMode] = useState<Mode>("cost-revenue");
  const [cost, setCost] = useState("");
  const [revenue, setRevenue] = useState("");
  const [margin, setMargin] = useState("");

  const c = parseFloat(cost) || 0;
  const r = parseFloat(revenue) || 0;
  const m = parseFloat(margin) || 0;

  let profit = 0, grossMargin = 0, markup = 0, revResult = 0, costResult = 0;

  if (mode === "cost-revenue" && c > 0 && r > 0) {
    profit = r - c;
    grossMargin = (profit / r) * 100;
    markup = (profit / c) * 100;
  } else if (mode === "cost-margin" && c > 0 && m > 0 && m < 100) {
    revResult = c / (1 - m / 100);
    profit = revResult - c;
    grossMargin = m;
    markup = (profit / c) * 100;
  } else if (mode === "revenue-margin" && r > 0 && m >= 0 && m < 100) {
    costResult = r * (1 - m / 100);
    profit = r - costResult;
    grossMargin = m;
    markup = costResult > 0 ? (profit / costResult) * 100 : 0;
  }

  const hasResult = mode === "cost-revenue" ? c > 0 && r > 0 : mode === "cost-margin" ? c > 0 && m > 0 && m < 100 : r > 0 && m >= 0 && m < 100;

  const inputCls = "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {([
          ["cost-revenue", "Cost + Revenue"],
          ["cost-margin", "Cost + Margin %"],
          ["revenue-margin", "Revenue + Margin %"],
        ] as [Mode, string][]).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
              mode === m ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        {(mode === "cost-revenue" || mode === "cost-margin") && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Cost ($)</label>
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="50.00" className={inputCls} />
          </div>
        )}
        {(mode === "cost-revenue" || mode === "revenue-margin") && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Revenue / selling price ($)</label>
            <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="100.00" className={inputCls} />
          </div>
        )}
        {(mode === "cost-margin" || mode === "revenue-margin") && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Gross margin (%)</label>
            <input type="number" value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="50" className={inputCls} />
          </div>
        )}
      </div>

      {hasResult && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
          {mode === "cost-margin" && (
            <div className="flex justify-between text-[14px]">
              <span className="text-neutral-400">Revenue (selling price)</span>
              <span className="font-semibold">${fmt2(revResult)}</span>
            </div>
          )}
          {mode === "revenue-margin" && (
            <div className="flex justify-between text-[14px]">
              <span className="text-neutral-400">Cost</span>
              <span className="font-semibold">${fmt2(costResult)}</span>
            </div>
          )}
          <div className="flex justify-between text-[14px]">
            <span className="text-neutral-400">Gross profit</span>
            <span className={`font-semibold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>${fmt2(profit)}</span>
          </div>
          <div className="flex justify-between text-[17px] border-t border-white/10 pt-3">
            <span className="text-neutral-300 font-semibold">Gross margin</span>
            <span className="font-bold">{grossMargin.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-neutral-400">Markup (on cost)</span>
            <span className="font-semibold">{markup.toFixed(2)}%</span>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-[12px] text-muted-foreground">
        <strong className="text-foreground">Margin vs Markup:</strong> Margin is profit as a % of revenue. Markup is profit as a % of cost. A 50% margin ≠ 50% markup — a 50% margin means doubling the cost price, which is a 100% markup.
      </div>
    </div>
  );
}
