"use client";

import { useState } from "react";

type Side = "a" | "b" | "c";

export function PythagoreanTheoremClient() {
  const [solve, setSolve] = useState<Side>("c");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c);

  let result: number | null = null;
  let label = "";
  let error = "";

  if (solve === "c" && !isNaN(av) && !isNaN(bv) && av > 0 && bv > 0) {
    result = Math.sqrt(av * av + bv * bv);
    label = "Hypotenuse (c)";
  } else if (solve === "a" && !isNaN(bv) && !isNaN(cv) && bv > 0 && cv > 0) {
    const r = cv * cv - bv * bv;
    if (r < 0) error = "c must be greater than b for a valid right triangle.";
    else { result = Math.sqrt(r); label = "Side a"; }
  } else if (solve === "b" && !isNaN(av) && !isNaN(cv) && av > 0 && cv > 0) {
    const r = cv * cv - av * av;
    if (r < 0) error = "c must be greater than a for a valid right triangle.";
    else { result = Math.sqrt(r); label = "Side b"; }
  }

  const perimeter = result !== null && !isNaN(result) ? (
    solve === "c" ? av + bv + result :
    solve === "a" ? result + bv + cv :
    av + result + cv
  ) : null;

  const sideA = solve === "a" ? result : av;
  const sideB = solve === "b" ? result : bv;
  const sideC = solve === "c" ? result : cv;
  const area = sideA !== null && sideB !== null && !isNaN(sideA) && !isNaN(sideB) ? (sideA * sideB) / 2 : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {([["c", "Find hypotenuse (c)"], ["a", "Find side a"], ["b", "Find side b"]] as [Side, string][]).map(([s, lbl]) => (
          <button key={s} onClick={() => setSolve(s)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${solve === s ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >{lbl}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <p className="text-[12px] text-muted-foreground mb-3">Formula: a² + b² = c²</p>
        <div className="grid grid-cols-2 gap-3">
          {solve !== "a" && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Side a</label>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 3"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          )}
          {solve !== "b" && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Side b</label>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 4"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          )}
          {solve !== "c" && (
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Hypotenuse c</label>
              <input type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="e.g. 5"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-[12px] text-red-500">{error}</p>}

        {result !== null && !error && (
          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
            <p className="text-[12px] text-muted-foreground mb-1">{label}</p>
            <p className="text-[42px] font-bold text-emerald-700">{result.toFixed(6).replace(/\.?0+$/, "")}</p>
          </div>
        )}
      </div>

      {result !== null && !error && area !== null && perimeter !== null && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
            <p className="text-[11px] text-muted-foreground">Triangle area</p>
            <p className="text-[22px] font-bold text-foreground mt-1">{area.toFixed(4).replace(/\.?0+$/, "")}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
            <p className="text-[11px] text-muted-foreground">Perimeter</p>
            <p className="text-[22px] font-bold text-foreground mt-1">{perimeter.toFixed(4).replace(/\.?0+$/, "")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
