"use client";
import { useState } from "react";

const VOLUME_UNITS = [
  { label: "tsp", factor: 1 },
  { label: "tbsp", factor: 3 },
  { label: "fl oz", factor: 6 },
  { label: "cup", factor: 48 },
  { label: "pint", factor: 96 },
  { label: "quart", factor: 192 },
  { label: "liter", factor: 202.884 },
  { label: "ml", factor: 0.202884 },
];

const WEIGHT_UNITS = [
  { label: "g", factor: 1 },
  { label: "kg", factor: 1000 },
  { label: "oz", factor: 28.3495 },
  { label: "lb", factor: 453.592 },
];

function convert(value: number, fromFactor: number, toFactor: number) {
  const base = value * fromFactor;
  return base / toFactor;
}
function fmt(n: number) {
  if (n === 0) return "0";
  if (n >= 1000) return n.toFixed(0);
  if (n >= 100) return n.toFixed(1);
  if (n >= 10) return n.toFixed(2);
  return n.toFixed(3);
}

export function CookingUnitConverterClient() {
  const [volValue, setVolValue] = useState(1);
  const [volFrom, setVolFrom] = useState(3);
  const [volTo, setVolTo] = useState(0);
  const [wtValue, setWtValue] = useState(100);
  const [wtFrom, setWtFrom] = useState(0);
  const [wtTo, setWtTo] = useState(2);

  const volResult = convert(volValue, VOLUME_UNITS[volFrom].factor, VOLUME_UNITS[volTo].factor);
  const wtResult = convert(wtValue, WEIGHT_UNITS[wtFrom].factor, WEIGHT_UNITS[wtTo].factor);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-6">
        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Volume</p>
          <div className="flex gap-3 items-center flex-wrap">
            <input type="number" min={0} step="any" value={volValue} onChange={e => setVolValue(Number(e.target.value))}
              className="w-28 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            <select value={volFrom} onChange={e => setVolFrom(Number(e.target.value))}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
              {VOLUME_UNITS.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
            </select>
            <span className="text-muted-foreground">=</span>
            <span className="text-[18px] font-semibold text-foreground">{fmt(volResult)}</span>
            <select value={volTo} onChange={e => setVolTo(Number(e.target.value))}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
              {VOLUME_UNITS.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Weight</p>
          <div className="flex gap-3 items-center flex-wrap">
            <input type="number" min={0} step="any" value={wtValue} onChange={e => setWtValue(Number(e.target.value))}
              className="w-28 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            <select value={wtFrom} onChange={e => setWtFrom(Number(e.target.value))}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
              {WEIGHT_UNITS.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
            </select>
            <span className="text-muted-foreground">=</span>
            <span className="text-[18px] font-semibold text-foreground">{fmt(wtResult)}</span>
            <select value={wtTo} onChange={e => setWtTo(Number(e.target.value))}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
              {WEIGHT_UNITS.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Common Volume Equivalents</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {[
              ["1 cup", "16 tbsp = 48 tsp = 8 fl oz"],
              ["1 tbsp", "3 tsp = 15 ml"],
              ["1 fl oz", "2 tbsp = 30 ml"],
              ["1 pint", "2 cups = 473 ml"],
              ["1 liter", "4.23 cups"],
              ["1 cup", "236.6 ml"],
            ].map(([k, v]) => (
              <div key={k + v} className="flex justify-between py-1 border-b border-neutral-100 text-[12px]">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
