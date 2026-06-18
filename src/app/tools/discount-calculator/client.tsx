"use client";

import { useState } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function DiscountCalculatorClient() {
  const [mode, setMode] = useState<"find-sale" | "find-pct" | "find-original">("find-sale");

  const [origPrice, setOrigPrice] = useState("");
  const [discPct, setDiscPct] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [origForPct, setOrigForPct] = useState("");
  const [saleForPct, setSaleForPct] = useState("");

  const orig = parseFloat(origPrice) || 0;
  const pct = parseFloat(discPct) || 0;
  const sale = parseFloat(salePrice) || 0;
  const oFP = parseFloat(origForPct) || 0;
  const sFP = parseFloat(saleForPct) || 0;

  const saleResult = orig > 0 && pct > 0 ? orig * (1 - pct / 100) : null;
  const savings = saleResult !== null ? orig - saleResult : null;

  const pctResult = oFP > 0 && sFP >= 0 && sFP < oFP ? ((oFP - sFP) / oFP) * 100 : null;

  const origResult = sale > 0 && pct > 0 && pct < 100 ? sale / (1 - pct / 100) : null;
  const origSavings = origResult !== null ? origResult - sale : null;

  const inputCls = "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
  const resultCls = "rounded-2xl bg-neutral-900 text-white p-5";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["find-sale", "find-pct", "find-original"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
              mode === m
                ? "bg-foreground text-background"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {m === "find-sale" ? "Sale price" : m === "find-pct" ? "Discount %" : "Original price"}
          </button>
        ))}
      </div>

      {mode === "find-sale" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
          <p className="text-[13px] font-semibold text-foreground">What is the sale price?</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[12px] text-muted-foreground">Original price ($)</label>
              <input type="number" value={origPrice} onChange={(e) => setOrigPrice(e.target.value)} placeholder="100" className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] text-muted-foreground">Discount (%)</label>
              <input type="number" value={discPct} onChange={(e) => setDiscPct(e.target.value)} placeholder="20" className={inputCls} />
            </div>
          </div>
          {saleResult !== null && (
            <div className={resultCls}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[12px] text-neutral-400">Sale price</span>
                <span className="text-[28px] font-bold">${fmt(saleResult)}</span>
              </div>
              <div className="flex justify-between text-[13px] border-t border-white/10 pt-2">
                <span className="text-neutral-400">You save</span>
                <span className="text-emerald-400 font-semibold">${fmt(savings!)} ({pct}% off)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "find-pct" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
          <p className="text-[13px] font-semibold text-foreground">What discount was applied?</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[12px] text-muted-foreground">Original price ($)</label>
              <input type="number" value={origForPct} onChange={(e) => setOrigForPct(e.target.value)} placeholder="100" className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] text-muted-foreground">Sale price ($)</label>
              <input type="number" value={saleForPct} onChange={(e) => setSaleForPct(e.target.value)} placeholder="80" className={inputCls} />
            </div>
          </div>
          {pctResult !== null && (
            <div className={resultCls}>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] text-neutral-400">Discount applied</span>
                <span className="text-[28px] font-bold">{pctResult.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-[13px] border-t border-white/10 pt-2 mt-2">
                <span className="text-neutral-400">Amount saved</span>
                <span className="text-emerald-400 font-semibold">${fmt(oFP - sFP)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "find-original" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
          <p className="text-[13px] font-semibold text-foreground">What was the original price?</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[12px] text-muted-foreground">Sale price ($)</label>
              <input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="80" className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-[12px] text-muted-foreground">Discount (%)</label>
              <input type="number" value={discPct} onChange={(e) => setDiscPct(e.target.value)} placeholder="20" className={inputCls} />
            </div>
          </div>
          {origResult !== null && (
            <div className={resultCls}>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] text-neutral-400">Original price</span>
                <span className="text-[28px] font-bold">${fmt(origResult)}</span>
              </div>
              <div className="flex justify-between text-[13px] border-t border-white/10 pt-2 mt-2">
                <span className="text-neutral-400">Amount saved</span>
                <span className="text-emerald-400 font-semibold">${fmt(origSavings!)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
