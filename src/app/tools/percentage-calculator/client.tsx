"use client";

import { useState } from "react";

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  const s = n.toFixed(10).replace(/\.?0+$/, "");
  return s;
}

export function PercentageCalculatorClient() {
  const [pct, setPct] = useState("");
  const [of, setOf] = useState("");
  const [partA, setPartA] = useState("");
  const [wholeA, setWholeA] = useState("");
  const [fromB, setFromB] = useState("");
  const [toB, setToB] = useState("");

  const resultA = pct && of ? fmt((parseFloat(pct) / 100) * parseFloat(of)) : null;
  const resultB =
    partA && wholeA ? fmt((parseFloat(partA) / parseFloat(wholeA)) * 100) : null;
  const resultC =
    fromB && toB
      ? fmt(((parseFloat(toB) - parseFloat(fromB)) / parseFloat(fromB)) * 100)
      : null;

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";
  const resultClass =
    "rounded-xl bg-neutral-900 text-white px-4 py-3 text-[18px] font-semibold font-mono";

  return (
    <div className="space-y-5">
      {/* What is X% of Y */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
        <p className="text-[13px] font-semibold text-foreground">What is X% of Y?</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-muted-foreground">What is</span>
          <input type="number" value={pct} onChange={(e) => setPct(e.target.value)} placeholder="25" className={`${inputClass} w-24`} />
          <span className="text-[13px] text-muted-foreground">% of</span>
          <input type="number" value={of} onChange={(e) => setOf(e.target.value)} placeholder="200" className={`${inputClass} w-28`} />
          <span className="text-[13px] text-muted-foreground">?</span>
        </div>
        {resultA !== null && (
          <div className={resultClass}>{resultA}</div>
        )}
      </div>

      {/* X is what % of Y */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
        <p className="text-[13px] font-semibold text-foreground">X is what % of Y?</p>
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" value={partA} onChange={(e) => setPartA(e.target.value)} placeholder="50" className={`${inputClass} w-28`} />
          <span className="text-[13px] text-muted-foreground">is what % of</span>
          <input type="number" value={wholeA} onChange={(e) => setWholeA(e.target.value)} placeholder="200" className={`${inputClass} w-28`} />
          <span className="text-[13px] text-muted-foreground">?</span>
        </div>
        {resultB !== null && (
          <div className={resultClass}>{resultB}%</div>
        )}
      </div>

      {/* Percentage change */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
        <p className="text-[13px] font-semibold text-foreground">Percentage change from X to Y</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-muted-foreground">From</span>
          <input type="number" value={fromB} onChange={(e) => setFromB(e.target.value)} placeholder="80" className={`${inputClass} w-28`} />
          <span className="text-[13px] text-muted-foreground">to</span>
          <input type="number" value={toB} onChange={(e) => setToB(e.target.value)} placeholder="100" className={`${inputClass} w-28`} />
        </div>
        {resultC !== null && (
          <div className={`${resultClass} ${parseFloat(resultC) < 0 ? "bg-red-600" : "bg-neutral-900"}`}>
            {parseFloat(resultC) > 0 ? "+" : ""}{resultC}%
          </div>
        )}
      </div>
    </div>
  );
}
