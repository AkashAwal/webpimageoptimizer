"use client";
import { useState } from "react";

export function RuleOf72Client() {
  const [mode, setMode] = useState<"rate" | "years">("rate");
  const [inputValue, setInputValue] = useState(8);

  const years72 = inputValue > 0 ? 72 / inputValue : 0;
  const years693 = inputValue > 0 ? 69.3 / inputValue : 0;
  const years = mode === "rate" ? years72 : inputValue;
  const rate = mode === "years" ? (inputValue > 0 ? 72 / inputValue : 0) : inputValue;
  const exactYears = rate > 0 ? Math.log(2) / Math.log(1 + rate / 100) : 0;

  const examples = [
    { rate: 3, label: "Savings account (~3%)" },
    { rate: 7, label: "Stock market avg (~7%)" },
    { rate: 10, label: "Aggressive investment (~10%)" },
    { rate: 15, label: "High-growth portfolio (~15%)" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="flex gap-2">
          <button onClick={() => setMode("rate")}
            className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${mode === "rate" ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
            I know my rate → find years
          </button>
          <button onClick={() => setMode("years")}
            className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${mode === "years" ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
            I know years → find rate
          </button>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">
            {mode === "rate" ? "Annual Return Rate (%)" : "Target Years to Double"}
          </label>
          <input type="number" min={0.1} step={0.1} value={inputValue} onChange={e => setInputValue(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
            <p className="text-[11px] text-emerald-700 font-medium mb-1">
              {mode === "rate" ? "Years to Double (Rule of 72)" : "Required Rate (Rule of 72)"}
            </p>
            <p className="text-[28px] font-semibold text-emerald-800">
              {mode === "rate" ? years72.toFixed(1) + " yrs" : rate.toFixed(1) + "%"}
            </p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Exact calculation</p>
            <p className="text-[22px] font-semibold text-foreground">
              {mode === "rate" ? exactYears.toFixed(2) + " yrs" : `${(Math.log(2) / Math.log(1 + inputValue / 100) * 100 / inputValue * (72 / 100)).toFixed(2)}%`}
            </p>
            <p className="text-[11px] text-muted-foreground">Compound formula</p>
          </div>
        </div>

        {mode === "rate" && (
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-1">Rule of 72 vs 69.3 (continuous compounding)</p>
            <div className="flex justify-between text-[13px] py-1.5 border-b border-neutral-100">
              <span className="text-muted-foreground">Rule of 72</span>
              <span className="font-medium">{years72.toFixed(2)} years</span>
            </div>
            <div className="flex justify-between text-[13px] py-1.5">
              <span className="text-muted-foreground">Rule of 69.3 (continuous)</span>
              <span className="font-medium">{years693.toFixed(2)} years</span>
            </div>
          </div>
        )}

        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Reference</p>
          <div className="space-y-1">
            {examples.map(ex => (
              <div key={ex.rate} className="flex justify-between items-center py-1.5 text-[13px] border-b border-neutral-100 last:border-0">
                <span className="text-muted-foreground">{ex.label}</span>
                <span className="font-medium text-foreground">{(72 / ex.rate).toFixed(1)} years to double</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
