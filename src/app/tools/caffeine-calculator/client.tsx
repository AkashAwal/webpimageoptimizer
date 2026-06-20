"use client";
import { useState } from "react";

const DRINKS = [
  { name: "Espresso (single shot)", caffeine: 63 },
  { name: "Espresso (double shot)", caffeine: 126 },
  { name: "Drip coffee (8 oz)", caffeine: 95 },
  { name: "Cold brew (8 oz)", caffeine: 155 },
  { name: "Latte / cappuccino", caffeine: 63 },
  { name: "Black tea (8 oz)", caffeine: 47 },
  { name: "Green tea (8 oz)", caffeine: 28 },
  { name: "Energy drink (8 oz)", caffeine: 80 },
  { name: "Red Bull (8.4 oz)", caffeine: 80 },
  { name: "Monster (16 oz)", caffeine: 160 },
  { name: "Cola (12 oz)", caffeine: 34 },
  { name: "Diet Cola (12 oz)", caffeine: 46 },
  { name: "Pre-workout (1 serving)", caffeine: 200 },
];

type ConsumptionEntry = { id: number; drinkIdx: number; qty: number; time: string };

const HALF_LIFE_HRS = 5.5;

export function CaffeineCalculatorClient() {
  const [entries, setEntries] = useState<ConsumptionEntry[]>([
    { id: 1, drinkIdx: 2, qty: 1, time: "08:00" },
    { id: 2, drinkIdx: 2, qty: 1, time: "13:00" },
  ]);
  const [nextId, setNextId] = useState(3);
  const [bedtime, setBedtime] = useState("23:00");
  const [isPregnant, setIsPregnant] = useState(false);

  function timeToHrs(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h + m / 60;
  }
  function hrsToTime(h: number) {
    const hh = Math.floor(h) % 24;
    const mm = Math.round((h % 1) * 60);
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }

  const now = new Date();
  const nowHrs = now.getHours() + now.getMinutes() / 60;

  const totalCaffeine = entries.reduce((sum, e) => sum + DRINKS[e.drinkIdx].caffeine * e.qty, 0);
  const currentCaffeine = entries.reduce((sum, e) => {
    const consumed = timeToHrs(e.time);
    const hoursAgo = ((nowHrs - consumed + 24) % 24);
    return sum + DRINKS[e.drinkIdx].caffeine * e.qty * Math.pow(0.5, hoursAgo / HALF_LIFE_HRS);
  }, 0);

  const maxSafe = isPregnant ? 200 : 400;
  const bedtimeHrs = timeToHrs(bedtime);
  const caffeineAtBed = entries.reduce((sum, e) => {
    const consumed = timeToHrs(e.time);
    const hoursUntilBed = ((bedtimeHrs - consumed + 24) % 24);
    return sum + DRINKS[e.drinkIdx].caffeine * e.qty * Math.pow(0.5, hoursUntilBed / HALF_LIFE_HRS);
  }, 0);

  const lastCutoffHrs = bedtimeHrs - HALF_LIFE_HRS * 2;
  const lastCoffeeBy = hrsToTime(((lastCutoffHrs % 24) + 24) % 24);

  function addEntry() {
    setEntries(e => [...e, { id: nextId, drinkIdx: 0, qty: 1, time: "12:00" }]);
    setNextId(n => n + 1);
  }
  function removeEntry(id: number) { setEntries(e => e.filter(x => x.id !== id)); }
  function updateEntry(id: number, field: keyof ConsumptionEntry, val: string | number) {
    setEntries(e => e.map(x => x.id === id ? { ...x, [field]: val } : x));
  }

  const safeColor = totalCaffeine <= maxSafe ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-red-700 bg-red-50 border-red-100";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Target Bedtime</label>
            <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="pregnant" checked={isPregnant} onChange={e => setIsPregnant(e.target.checked)}
              className="rounded border-neutral-300" />
            <label htmlFor="pregnant" className="text-[12px] font-medium text-muted-foreground">Pregnant (200mg limit)</label>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Today&apos;s Caffeine</p>
            <button onClick={addEntry} className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-muted-foreground hover:bg-neutral-200 transition-colors">+ Add drink</button>
          </div>
          <div className="space-y-2">
            {entries.map(e => (
              <div key={e.id} className="flex gap-2 items-center">
                <select value={e.drinkIdx} onChange={ev => updateEntry(e.id, "drinkIdx", Number(ev.target.value))}
                  className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20">
                  {DRINKS.map((d, i) => (
                    <option key={i} value={i}>{d.name} ({d.caffeine}mg)</option>
                  ))}
                </select>
                <input type="number" min={1} max={10} value={e.qty} onChange={ev => updateEntry(e.id, "qty", Number(ev.target.value))}
                  className="w-14 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <input type="time" value={e.time} onChange={ev => updateEntry(e.id, "time", ev.target.value)}
                  className="w-26 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <button onClick={() => removeEntry(e.id)} className="text-neutral-400 hover:text-foreground text-[16px] px-1">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border p-4 ${safeColor}`}>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[11px] font-semibold mb-1">Total today</p>
              <p className="text-[20px] font-semibold">{Math.round(totalCaffeine)}mg</p>
              <p className="text-[11px]">Limit: {maxSafe}mg</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold mb-1">In your system now</p>
              <p className="text-[20px] font-semibold">{Math.round(currentCaffeine)}mg</p>
              <p className="text-[11px]">(estimated)</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold mb-1">At bedtime</p>
              <p className="text-[20px] font-semibold">{Math.round(caffeineAtBed)}mg</p>
              <p className="text-[11px]">{bedtime}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-2 text-[13px] border-b border-neutral-100">
          <span className="text-muted-foreground">Last caffeine by (for good sleep)</span>
          <span className="font-semibold text-foreground">{lastCoffeeBy}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Caffeine half-life ≈ 5.5 hours. Results are estimates. FDA recommends ≤ 400mg/day for healthy adults; ≤ 200mg for pregnant women. Does not constitute medical advice.</p>
      </div>
    </div>
  );
}
