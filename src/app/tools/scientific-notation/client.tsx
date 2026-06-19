"use client";

import { useState } from "react";

export function ScientificNotationClient() {
  const [mode, setMode] = useState<"toSci" | "toDecimal">("toSci");
  const [decInput, setDecInput] = useState("");
  const [coeff, setCoeff] = useState("");
  const [exp, setExp] = useState("");

  let sciResult = "";
  let decResult = "";
  let error = "";

  if (mode === "toSci") {
    const n = parseFloat(decInput);
    if (!isNaN(n) && decInput.trim()) {
      if (n === 0) { sciResult = "0 × 10⁰"; }
      else {
        const e = Math.floor(Math.log10(Math.abs(n)));
        const c = n / Math.pow(10, e);
        const expStr = String(e).split("").map((ch) => {
          const sup: Record<string, string> = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
          return sup[ch] ?? ch;
        }).join("");
        sciResult = `${c.toFixed(6).replace(/\.?0+$/, "")} × 10${expStr}`;
      }
    }
  } else {
    const c = parseFloat(coeff);
    const e = parseInt(exp);
    if (!isNaN(c) && !isNaN(e) && coeff.trim() && exp.trim()) {
      const result = c * Math.pow(10, e);
      if (!isFinite(result)) error = "Result is too large to display as a standard decimal.";
      else decResult = result.toLocaleString("en", { maximumSignificantDigits: 15 });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("toSci")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "toSci" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
        >Decimal → Scientific</button>
        <button onClick={() => setMode("toDecimal")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "toDecimal" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
        >Scientific → Decimal</button>
      </div>

      {mode === "toSci" ? (
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Decimal number</label>
          <input
            type="text"
            value={decInput}
            onChange={(e) => setDecInput(e.target.value)}
            placeholder="e.g. 0.000056 or 123456789"
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[16px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-sans placeholder:text-[14px]"
          />
          {sciResult && (
            <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center mt-2">
              <p className="text-[12px] text-neutral-400 mb-2">Scientific notation</p>
              <p className="text-[28px] font-bold">{sciResult}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="space-y-1.5 flex-1">
              <label className="text-[12px] font-medium text-muted-foreground">Coefficient</label>
              <input type="number" value={coeff} onChange={(e) => setCoeff(e.target.value)} placeholder="e.g. 5.6"
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[16px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
            </div>
            <span className="text-[20px] font-bold text-muted-foreground mt-5">× 10</span>
            <div className="space-y-1.5 w-28">
              <label className="text-[12px] font-medium text-muted-foreground">Exponent</label>
              <input type="number" value={exp} onChange={(e) => setExp(e.target.value)} placeholder="e.g. -5"
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[16px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
            </div>
          </div>
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          {decResult && !error && (
            <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center">
              <p className="text-[12px] text-neutral-400 mb-2">Standard decimal</p>
              <p className="text-[22px] font-bold break-all">{decResult}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
