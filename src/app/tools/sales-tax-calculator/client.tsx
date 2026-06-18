"use client";

import { useState } from "react";

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const PRESETS = [
  { label: "CA GST 5%", rate: 5 },
  { label: "UK VAT 20%", rate: 20 },
  { label: "EU VAT 21%", rate: 21 },
  { label: "AU GST 10%", rate: 10 },
];

export function SalesTaxCalculatorClient() {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [price, setPrice] = useState("");
  const [rate, setRate] = useState("");

  const p = parseFloat(price) || 0;
  const r = parseFloat(rate) || 0;

  let preTax = 0, tax = 0, postTax = 0;
  if (p > 0 && r > 0) {
    if (mode === "add") {
      preTax = p;
      tax = p * (r / 100);
      postTax = p + tax;
    } else {
      postTax = p;
      preTax = p / (1 + r / 100);
      tax = postTax - preTax;
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("add")}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "add" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >
            Add tax
          </button>
          <button
            onClick={() => setMode("remove")}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "remove" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >
            Remove tax
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">
              {mode === "add" ? "Pre-tax price ($)" : "Post-tax price ($)"}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="100.00"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Tax rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="10"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[12px] text-muted-foreground">Quick select</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setRate(String(p.rate))}
                className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {p > 0 && r > 0 && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
          <div className="flex justify-between text-[14px]">
            <span className="text-neutral-400">Pre-tax</span>
            <span className="font-semibold">${fmt(preTax)}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-neutral-400">Tax ({r}%)</span>
            <span className="font-semibold text-amber-400">${fmt(tax)}</span>
          </div>
          <div className="flex justify-between text-[17px] border-t border-white/10 pt-3">
            <span className="text-neutral-300 font-semibold">Post-tax total</span>
            <span className="font-bold">${fmt(postTax)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
