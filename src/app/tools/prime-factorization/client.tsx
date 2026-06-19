"use client";

import { useState } from "react";

function primeFactors(n: number): number[] {
  if (n < 2) return [];
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors.push(d); n = Math.floor(n / d); }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function getDivisors(n: number): number[] {
  const divs: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) { divs.push(i); if (i !== n / i) divs.push(n / i); }
  }
  return divs.sort((a, b) => a - b);
}

export function PrimeFactorizationClient() {
  const [input, setInput] = useState("");

  const n = parseInt(input);
  const valid = !isNaN(n) && n >= 2 && n <= 1_000_000;
  const factors = valid ? primeFactors(n) : [];
  const divisors = valid ? getDivisors(n) : [];

  const primeMap: Record<number, number> = {};
  for (const f of factors) primeMap[f] = (primeMap[f] ?? 0) + 1;
  const expression = Object.entries(primeMap).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join(" × ");
  const isPrime = valid && factors.length === 1;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Enter a number (2 – 1,000,000)</label>
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 360"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[20px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-normal placeholder:text-[14px]"
        />
        {input && !valid && <p className="text-[12px] text-red-500">Enter a whole number between 2 and 1,000,000</p>}
      </div>

      {valid && factors.length > 0 && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-neutral-900 text-white p-5">
            <p className="text-[12px] text-neutral-400 mb-2">{n} = </p>
            <p className="text-[22px] font-bold break-all">{expression}</p>
            {isPrime && <p className="mt-2 text-[12px] text-emerald-400">{n} is a prime number</p>}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
            <p className="text-[12px] font-medium text-muted-foreground mb-3">Prime factors</p>
            <div className="flex flex-wrap gap-2">
              {factors.map((f, i) => (
                <span key={i} className="rounded-full bg-neutral-100 px-3 py-1 text-[14px] font-semibold text-foreground">{f}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
            <p className="text-[12px] font-medium text-muted-foreground mb-3">All divisors ({divisors.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {divisors.map((d) => (
                <span key={d} className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${factors.includes(d) && primeMap[d] ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700"}`}>{d}</span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Dark = prime factor</p>
          </div>
        </div>
      )}
    </div>
  );
}
