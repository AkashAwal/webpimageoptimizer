"use client";

import { useState } from "react";

export function QuadraticFormulaClient() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c);
  const valid = !isNaN(av) && !isNaN(bv) && !isNaN(cv) && av !== 0;

  let disc: number | null = null;
  let x1: string | null = null, x2: string | null = null;
  let vertex: string | null = null;
  let rootType = "";

  if (valid) {
    disc = bv * bv - 4 * av * cv;
    const vx = -bv / (2 * av);
    const vy = av * vx * vx + bv * vx + cv;
    vertex = `(${vx.toFixed(4).replace(/\.?0+$/, "")}, ${vy.toFixed(4).replace(/\.?0+$/, "")})`;

    if (disc > 0) {
      rootType = "2 real roots";
      x1 = ((-bv + Math.sqrt(disc)) / (2 * av)).toFixed(6).replace(/\.?0+$/, "");
      x2 = ((-bv - Math.sqrt(disc)) / (2 * av)).toFixed(6).replace(/\.?0+$/, "");
    } else if (disc === 0) {
      rootType = "1 real root (repeated)";
      x1 = (-bv / (2 * av)).toFixed(6).replace(/\.?0+$/, "");
      x2 = x1;
    } else {
      rootType = "2 complex roots";
      const re = (-bv / (2 * av)).toFixed(4).replace(/\.?0+$/, "");
      const im = (Math.sqrt(-disc) / (2 * av)).toFixed(4).replace(/\.?0+$/, "");
      x1 = `${re} + ${im}i`;
      x2 = `${re} − ${im}i`;
    }
  }

  const fmt = (v: string) => v === "" ? "0" : v;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <p className="text-[12px] font-medium text-muted-foreground mb-3">
          Equation: {fmt(a)}x² + {fmt(b)}x + {fmt(c)} = 0
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "a (x² coefficient)", val: a, set: setA, ph: "1" },
            { label: "b (x coefficient)", val: b, set: setB, ph: "-5" },
            { label: "c (constant)", val: c, set: setC, ph: "6" },
          ].map(({ label, val, set, ph }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ))}
        </div>

        {!valid && av === 0 && a !== "" && (
          <p className="mt-3 text-[12px] text-amber-600">a cannot be 0 (that would make it linear, not quadratic)</p>
        )}
      </div>

      {valid && x1 && x2 && disc !== null && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-foreground">Roots</p>
              <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${disc >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{rootType}</span>
            </div>
            <div className={`grid gap-3 ${x1 === x2 ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center">
                <p className="text-[11px] text-muted-foreground mb-1">x₁</p>
                <p className="text-[18px] font-bold text-foreground break-all">{x1}</p>
              </div>
              {x1 !== x2 && (
                <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center">
                  <p className="text-[11px] text-muted-foreground mb-1">x₂</p>
                  <p className="text-[18px] font-bold text-foreground break-all">{x2}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] text-muted-foreground">Discriminant (b²−4ac)</p>
              <p className="text-[22px] font-bold text-foreground mt-1">{disc.toFixed(4).replace(/\.?0+$/, "")}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] text-muted-foreground">Vertex</p>
              <p className="text-[16px] font-bold text-foreground mt-1">{vertex}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
