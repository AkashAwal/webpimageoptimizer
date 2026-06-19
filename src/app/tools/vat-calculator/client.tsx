"use client";

import { useState } from "react";

const PRESETS = [5, 10, 12, 15, 18, 20, 21, 23, 25];

export function VatCalculatorClient() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("20");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [currency, setCurrency] = useState("$");

  const a = parseFloat(amount);
  const r = parseFloat(rate) / 100;
  const valid = !isNaN(a) && !isNaN(r) && a > 0 && r > 0;

  const vatAmount = valid ? (mode === "add" ? a * r : a - a / (1 + r)) : 0;
  const result = valid ? (mode === "add" ? a + vatAmount : a / (1 + r)) : 0;

  const fmt = (n: number) => currency + n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("add")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "add" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
        >Add VAT / GST</button>
        <button onClick={() => setMode("remove")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "remove" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
        >Remove VAT / GST</button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2 flex-wrap">
          {["$", "£", "€", "₹"].map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${currency === c ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
            >{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">
              {mode === "add" ? "Price before tax" : "Price including tax"} ({currency})
            </label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">VAT / GST rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="20"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button key={p} onClick={() => setRate(String(p))}
              className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium transition-colors ${rate === String(p) ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
            >{p}%</button>
          ))}
        </div>

        {valid && (
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 divide-y divide-neutral-100">
            {[
              { label: mode === "add" ? "Price before tax" : "Price ex. tax", val: mode === "add" ? a : result, bold: false },
              { label: `VAT / GST (${rate}%)`, val: vatAmount, bold: false },
              { label: mode === "add" ? "Total inc. tax" : "Original amount inc. tax", val: mode === "add" ? result : a, bold: true },
            ].map(({ label, val, bold }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <span className={`text-[13px] ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{label}</span>
                <span className={`text-[14px] ${bold ? "font-bold text-foreground" : "text-foreground"}`}>{fmt(val)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
