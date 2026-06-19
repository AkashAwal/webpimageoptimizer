"use client";

import { useState } from "react";

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplify(num: number, den: number): [number, number] {
  if (den === 0) return [num, den];
  const g = gcd(Math.abs(num), Math.abs(den));
  let n = num / g, d = den / g;
  if (d < 0) { n = -n; d = -d; }
  return [n, d];
}

function fmtFrac(num: number, den: number): string {
  if (den === 1) return String(num);
  return `${num}/${den}`;
}

type Op = "+" | "-" | "×" | "÷";

export function FractionCalculatorClient() {
  const [n1, setN1] = useState(""); const [d1, setD1] = useState("");
  const [n2, setN2] = useState(""); const [d2, setD2] = useState("");
  const [op, setOp] = useState<Op>("+");

  const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), e = parseInt(d2);
  const valid = !isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(e) && b !== 0 && e !== 0;

  let rn = 0, rd = 1;
  if (valid) {
    if (op === "+") { rn = a * e + c * b; rd = b * e; }
    else if (op === "-") { rn = a * e - c * b; rd = b * e; }
    else if (op === "×") { rn = a * c; rd = b * e; }
    else if (op === "÷") { rn = a * e; rd = b * c; }
    [rn, rd] = simplify(rn, rd);
  }

  const divByZero = valid && op === "÷" && c === 0;
  const decimal = rd !== 0 ? (rn / rd).toFixed(6).replace(/\.?0+$/, "") : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <input type="number" value={n1} onChange={(e) => setN1(e.target.value)} placeholder="1"
              className="w-20 text-center rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            <div className="w-20 h-0.5 bg-foreground" />
            <input type="number" value={d1} onChange={(e) => setD1(e.target.value)} placeholder="2"
              className="w-20 text-center rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>

          <div className="flex gap-2">
            {(["+", "-", "×", "÷"] as Op[]).map((o) => (
              <button key={o} onClick={() => setOp(o)}
                className={`w-10 h-10 rounded-xl text-[18px] font-semibold transition-colors ${op === o ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
              >{o}</button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1">
            <input type="number" value={n2} onChange={(e) => setN2(e.target.value)} placeholder="3"
              className="w-20 text-center rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            <div className="w-20 h-0.5 bg-foreground" />
            <input type="number" value={d2} onChange={(e) => setD2(e.target.value)} placeholder="4"
              className="w-20 text-center rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>

          <span className="text-[24px] font-semibold text-muted-foreground">=</span>

          {divByZero ? (
            <span className="text-[20px] font-bold text-red-500">undefined</span>
          ) : valid ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[20px] font-bold text-foreground">{rn}</span>
              {rd !== 1 && <div className="w-12 h-0.5 bg-foreground" />}
              {rd !== 1 && <span className="text-[20px] font-bold text-foreground">{rd}</span>}
            </div>
          ) : (
            <span className="text-[20px] text-muted-foreground">—</span>
          )}
        </div>

        {valid && !divByZero && decimal && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-[13px] text-muted-foreground">
              Result: <strong>{fmtFrac(rn, rd)}</strong> ≈ <strong>{decimal}</strong>
              {rd !== 1 && <> (simplified from {n1}/{d1} {op} {n2}/{d2})</>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
