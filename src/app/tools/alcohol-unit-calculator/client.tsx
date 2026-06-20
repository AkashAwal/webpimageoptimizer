"use client";
import { useState } from "react";

type DrinkEntry = { id: number; name: string; volume: number; abv: number };

const PRESETS = [
  { name: "Beer (pint, 4%)", volume: 568, abv: 4 },
  { name: "Beer (pint, 5%)", volume: 568, abv: 5 },
  { name: "Wine (small glass, 12%)", volume: 125, abv: 12 },
  { name: "Wine (large glass, 12%)", volume: 250, abv: 12 },
  { name: "Spirits (single, 40%)", volume: 25, abv: 40 },
  { name: "Spirits (double, 40%)", volume: 50, abv: 40 },
  { name: "Champagne (flute, 12%)", volume: 125, abv: 12 },
  { name: "Cider (pint, 5%)", volume: 568, abv: 5 },
];

function calcUnits(volume: number, abv: number) {
  return (volume * abv) / 1000;
}

export function AlcoholUnitCalculatorClient() {
  const [drinks, setDrinks] = useState<DrinkEntry[]>([
    { id: 1, name: "Beer (pint, 5%)", volume: 568, abv: 5 },
    { id: 2, name: "Wine (large glass, 12%)", volume: 250, abv: 12 },
  ]);
  const [nextId, setNextId] = useState(3);

  const totalUnits = drinks.reduce((sum, d) => sum + calcUnits(d.volume, d.abv), 0);
  const ukWeeklyLimit = 14;
  const pctOfLimit = (totalUnits / ukWeeklyLimit) * 100;

  function addPreset(preset: typeof PRESETS[number]) {
    setDrinks(d => [...d, { id: nextId, ...preset }]);
    setNextId(n => n + 1);
  }
  function removeDrink(id: number) { setDrinks(d => d.filter(x => x.id !== id)); }
  function updateDrink(id: number, field: keyof DrinkEntry, val: string | number) {
    setDrinks(d => d.map(x => x.id === id ? { ...x, [field]: val } : x));
  }
  function addCustom() {
    setDrinks(d => [...d, { id: nextId, name: "Custom drink", volume: 330, abv: 5 }]);
    setNextId(n => n + 1);
  }

  const barColor = pctOfLimit < 50 ? "bg-emerald-500" : pctOfLimit < 100 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Add</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.name} onClick={() => addPreset(p)}
                className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors">
                + {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Your Drinks</p>
            <button onClick={addCustom} className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-muted-foreground hover:bg-neutral-200 transition-colors">+ Custom</button>
          </div>
          <div className="space-y-2">
            {drinks.map(d => (
              <div key={d.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input type="text" value={d.name} onChange={e => updateDrink(d.id, "name", e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  <button onClick={() => removeDrink(d.id)} className="text-neutral-400 hover:text-foreground text-[16px] px-1">×</button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] text-muted-foreground mb-0.5">Volume (ml)</label>
                    <input type="number" min={0} value={d.volume} onChange={e => updateDrink(d.id, "volume", Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-muted-foreground mb-0.5">ABV (%)</label>
                    <input type="number" min={0} max={100} step={0.1} value={d.abv} onChange={e => updateDrink(d.id, "abv", Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                  </div>
                  <div className="w-20 text-right">
                    <label className="block text-[11px] text-muted-foreground mb-0.5">Units</label>
                    <p className="text-[14px] font-semibold text-foreground pt-1.5">{calcUnits(d.volume, d.abv).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-[13px] font-semibold text-foreground">Total units</span>
            <span className="text-[22px] font-semibold text-foreground">{totalUnits.toFixed(2)}</span>
          </div>
          <div className="h-3 rounded-full bg-neutral-200 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(100, pctOfLimit)}%` }} />
          </div>
          <div className="flex justify-between text-[12px] text-muted-foreground">
            <span>{totalUnits.toFixed(1)} / {ukWeeklyLimit} weekly units (UK low-risk limit)</span>
            <span>{pctOfLimit.toFixed(0)}%</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">UK formula: units = (volume ml × ABV%) ÷ 1000. The UK Chief Medical Officers recommend no more than 14 units per week, spread across 3+ days. This tool does not constitute medical advice.</p>
      </div>
    </div>
  );
}
