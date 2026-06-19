"use client";

import { useState } from "react";

const PHI = (1 + Math.sqrt(5)) / 2;

export function FibonacciGeneratorClient() {
  const [count, setCount] = useState("15");

  const n = Math.min(Math.max(parseInt(count) || 1, 1), 50);

  const fibs: number[] = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    fibs.push(a);
    [a, b] = [b, a + b];
  }

  const ratios = fibs.slice(1).map((f, i) => {
    const prev = fibs[i];
    if (prev === 0) return null;
    return (f / prev).toFixed(8);
  });

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">How many terms? (1–50)</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          min={1}
          max={50}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[16px] text-foreground outline-none focus:border-neutral-400 transition-colors"
        />
      </div>

      <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center">
        <p className="text-[12px] text-neutral-400 mb-2">Golden ratio (φ)</p>
        <p className="text-[36px] font-bold">{PHI.toFixed(10)}</p>
        <p className="text-[11px] text-neutral-500 mt-1">F(n+1) ÷ F(n) converges to φ as n → ∞</p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="grid grid-cols-3 px-4 py-2 bg-neutral-50 border-b border-neutral-100">
          <span className="text-[11px] font-medium text-muted-foreground">Index (n)</span>
          <span className="text-[11px] font-medium text-muted-foreground">F(n)</span>
          <span className="text-[11px] font-medium text-muted-foreground">F(n)/F(n-1)</span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {fibs.map((f, i) => (
            <div key={i} className="grid grid-cols-3 px-4 py-2.5 border-b border-neutral-50 last:border-0">
              <span className="text-[12px] font-medium text-muted-foreground">{i}</span>
              <span className="text-[12px] font-mono text-foreground">{f.toLocaleString()}</span>
              <span className="text-[11px] font-mono text-muted-foreground">{ratios[i - 1] ?? "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
