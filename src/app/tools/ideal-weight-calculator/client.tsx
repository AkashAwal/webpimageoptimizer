"use client";

import { useState } from "react";

export function IdealWeightCalculatorClient() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const heightCm = unit === "metric" ? parseFloat(height) : (parseFloat(height) * 30.48 + parseFloat(heightIn || "0") * 2.54);
  const heightIn_val = heightCm / 2.54;
  const valid = !isNaN(heightCm) && heightCm > 100 && heightCm < 250;

  const inchesOver5ft = Math.max(0, heightIn_val - 60);

  const devine = gender === "male" ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
  const robinson = gender === "male" ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft;
  const miller = gender === "male" ? 56.2 + 1.41 * inchesOver5ft : 53.1 + 1.36 * inchesOver5ft;
  const hamwi = gender === "male" ? 48 + 2.7 * inchesOver5ft : 45.4 + 2.27 * inchesOver5ft;

  const avg = (devine + robinson + miller + hamwi) / 4;

  const toDisplay = (kg: number) => unit === "metric" ? `${kg.toFixed(1)} kg` : `${(kg * 2.20462).toFixed(1)} lbs`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setUnit("metric")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === "metric" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Metric (cm)</button>
        <button onClick={() => setUnit("imperial")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === "imperial" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Imperial (ft/in)</button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setGender("male")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${gender === "male" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Male</button>
          <button onClick={() => setGender("female")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${gender === "female" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Female</button>
        </div>

        {unit === "metric" ? (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Height (feet)</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="5"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">Height (inches)</label>
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="9"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          </div>
        )}

        {valid && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
            <p className="text-[12px] text-muted-foreground mb-1">Average ideal weight</p>
            <p className="text-[42px] font-bold text-emerald-700">{toDisplay(avg)}</p>
          </div>
        )}
      </div>

      {valid && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100">
            <p className="text-[12px] font-medium text-muted-foreground">Results by formula</p>
          </div>
          {[
            { name: "Devine (1974)", val: devine },
            { name: "Robinson (1983)", val: robinson },
            { name: "Miller (1983)", val: miller },
            { name: "Hamwi (1964)", val: hamwi },
          ].map(({ name, val }) => (
            <div key={name} className="flex items-center justify-between px-4 py-3 border-b border-neutral-50 last:border-0">
              <span className="text-[13px] text-muted-foreground">{name}</span>
              <span className="text-[14px] font-semibold text-foreground">{toDisplay(val)}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-[12px] text-muted-foreground">These are statistical estimates based on height. Individual healthy weight varies based on muscle mass, bone density, and other factors.</p>
    </div>
  );
}
