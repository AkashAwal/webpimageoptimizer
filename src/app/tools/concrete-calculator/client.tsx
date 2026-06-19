"use client";

import { useState } from "react";

type Shape = "slab" | "column" | "footing";

export function ConcreteCalculatorClient() {
  const [shape, setShape] = useState<Shape>("slab");
  const [unit, setUnit] = useState<"m" | "ft">("m");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [diameter, setDiameter] = useState("");
  const [height, setHeight] = useState("");

  const l = parseFloat(length);
  const w = parseFloat(width);
  const d = parseFloat(depth);
  const dia = parseFloat(diameter);
  const h = parseFloat(height);

  const toM = (v: number) => unit === "ft" ? v * 0.3048 : v;

  let m3: number | null = null;
  let label = "";

  if (shape === "slab" && !isNaN(l) && !isNaN(w) && !isNaN(d) && l > 0 && w > 0 && d > 0) {
    m3 = toM(l) * toM(w) * toM(d);
    label = "Slab volume";
  } else if (shape === "column" && !isNaN(dia) && !isNaN(h) && dia > 0 && h > 0) {
    const r = toM(dia) / 2;
    m3 = Math.PI * r * r * toM(h);
    label = "Column volume";
  } else if (shape === "footing" && !isNaN(l) && !isNaN(w) && !isNaN(d) && l > 0 && w > 0 && d > 0) {
    m3 = toM(l) * toM(w) * toM(d);
    label = "Footing volume";
  }

  const yd3 = m3 !== null ? m3 * 1.30795 : null;
  const bags40 = m3 !== null ? Math.ceil(m3 / 0.0095) : null;
  const bags80 = m3 !== null ? Math.ceil(m3 / 0.019) : null;

  const shapes: { id: Shape; label: string }[] = [
    { id: "slab", label: "Slab / Patio" },
    { id: "column", label: "Column / Cylinder" },
    { id: "footing", label: "Footing / Wall" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {shapes.map((s) => (
          <button key={s.id} onClick={() => setShape(s.id)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${shape === s.id ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >{s.label}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setUnit("m")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "m" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Metres</button>
          <button onClick={() => setUnit("ft")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "ft" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Feet</button>
        </div>

        {(shape === "slab" || shape === "footing") && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: `Length (${unit})`, val: length, set: setLength, ph: "4" },
              { label: `Width (${unit})`, val: width, set: setWidth, ph: "3" },
              { label: `Depth (${unit})`, val: depth, set: setDepth, ph: "0.1" },
            ].map(({ label, val, set, ph }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
                <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {shape === "column" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: `Diameter (${unit})`, val: diameter, set: setDiameter, ph: "0.3" },
              { label: `Height (${unit})`, val: height, set: setHeight, ph: "3" },
            ].map(({ label, val, set, ph }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
                <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {m3 !== null && yd3 !== null && bags40 !== null && bags80 !== null && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
            <p className="text-[12px] text-muted-foreground mb-1">{label}</p>
            <p className="text-[42px] font-bold text-emerald-700">{m3.toFixed(3)} m³</p>
            <p className="text-[13px] text-muted-foreground mt-1">{yd3.toFixed(3)} yd³</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white border border-emerald-200 p-3">
                <p className="text-[18px] font-bold text-foreground">{bags40}</p>
                <p className="text-[11px] text-muted-foreground">× 40 lb bags</p>
              </div>
              <div className="rounded-lg bg-white border border-emerald-200 p-3">
                <p className="text-[18px] font-bold text-foreground">{bags80}</p>
                <p className="text-[11px] text-muted-foreground">× 80 lb bags</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="text-[12px] text-muted-foreground">Add 10% waste allowance to bag counts for real projects.</p>
    </div>
  );
}
