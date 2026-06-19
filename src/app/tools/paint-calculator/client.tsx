"use client";

import { useState } from "react";

const COVERAGE: Record<string, number> = {
  standard: 10,
  thick: 7,
  primer: 8,
};

export function PaintCalculatorClient() {
  const [unit, setUnit] = useState<"m" | "ft">("m");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [doors, setDoors] = useState("1");
  const [windows, setWindows] = useState("1");
  const [coats, setCoats] = useState("2");
  const [coverage, setCoverage] = useState("standard");

  const l = parseFloat(length);
  const w = parseFloat(width);
  const h = parseFloat(height);
  const numDoors = parseInt(doors) || 0;
  const numWindows = parseInt(windows) || 0;
  const numCoats = parseInt(coats) || 1;

  let litres: number | null = null;
  let gallons: number | null = null;

  if (!isNaN(l) && !isNaN(w) && !isNaN(h) && l > 0 && w > 0 && h > 0) {
    const perimeter = 2 * (l + w);
    let wallArea = perimeter * h;
    if (unit === "ft") wallArea /= 10.764;

    const doorArea = numDoors * 1.9;
    const windowArea = numWindows * 1.2;
    const paintableArea = Math.max(0, wallArea - doorArea - windowArea);

    const sqmPerLitre = COVERAGE[coverage] ?? 10;
    litres = (paintableArea / sqmPerLitre) * numCoats;
    gallons = litres * 0.264172;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setUnit("m")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "m" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Metres</button>
          <button onClick={() => setUnit("ft")} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${unit === "ft" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Feet</button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: `Room length (${unit})`, val: length, set: setLength, ph: "5" },
            { label: `Room width (${unit})`, val: width, set: setWidth, ph: "4" },
            { label: `Ceiling height (${unit})`, val: height, set: setHeight, ph: "2.4" },
          ].map(({ label, val, set, ph }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Doors</label>
            <input type="number" value={doors} onChange={(e) => setDoors(e.target.value)} min={0}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Windows</label>
            <input type="number" value={windows} onChange={(e) => setWindows(e.target.value)} min={0}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Coats</label>
            <input type="number" value={coats} onChange={(e) => setCoats(e.target.value)} min={1} max={5}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Paint type</label>
          <select value={coverage} onChange={(e) => setCoverage(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors">
            <option value="standard">Standard emulsion (~10 m²/L)</option>
            <option value="thick">Thick/textured (~7 m²/L)</option>
            <option value="primer">Primer/undercoat (~8 m²/L)</option>
          </select>
        </div>

        {litres !== null && gallons !== null && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
            <p className="text-[12px] text-muted-foreground mb-1">Paint needed ({numCoats} coat{numCoats !== 1 ? "s" : ""})</p>
            <p className="text-[42px] font-bold text-emerald-700">{litres.toFixed(1)} L</p>
            <p className="text-[13px] text-muted-foreground mt-1">≈ {gallons.toFixed(1)} US gallons · buy {Math.ceil(litres / 2.5) * 2.5} L (round up to nearest 2.5 L tin)</p>
          </div>
        )}
      </div>
    </div>
  );
}
