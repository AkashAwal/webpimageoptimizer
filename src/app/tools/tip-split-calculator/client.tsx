"use client";

import { useState } from "react";

const TIP_PRESETS = [10, 15, 18, 20, 25];

export function TipSplitCalculatorClient() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState("18");
  const [people, setPeople] = useState("2");

  const b = parseFloat(bill);
  const tp = parseFloat(tipPct) || 0;
  const n = Math.max(1, parseInt(people) || 1);
  const valid = !isNaN(b) && b > 0;

  const tip = valid ? b * tp / 100 : 0;
  const total = b + tip;
  const perPerson = total / n;
  const tipPerPerson = tip / n;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Bill amount ($)</label>
          <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="85.50"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[24px] font-bold text-foreground outline-none focus:border-neutral-400 transition-colors" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Tip: {tipPct}%</label>
          <div className="flex gap-2 flex-wrap">
            {TIP_PRESETS.map((t) => (
              <button key={t} onClick={() => setTipPct(String(t))} className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${tipPct === String(t) ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>{t}%</button>
            ))}
          </div>
          <input type="range" min={0} max={50} step={1} value={tipPct} onChange={(e) => setTipPct(e.target.value)}
            className="w-full accent-neutral-900" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Number of people</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setPeople(p => String(Math.max(1, parseInt(p) - 1)))} className="rounded-full w-8 h-8 bg-neutral-100 hover:bg-neutral-200 text-[18px] font-bold flex items-center justify-center transition-colors">−</button>
            <span className="text-[24px] font-bold text-foreground w-12 text-center">{n}</span>
            <button onClick={() => setPeople(p => String(parseInt(p) + 1))} className="rounded-full w-8 h-8 bg-neutral-100 hover:bg-neutral-200 text-[18px] font-bold flex items-center justify-center transition-colors">+</button>
          </div>
        </div>
      </div>

      {valid && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-1">Per person</p>
            <p className="text-[56px] font-bold">${perPerson.toFixed(2)}</p>
            <p className="text-[12px] text-neutral-400 mt-1">(includes ${tipPerPerson.toFixed(2)} tip per person)</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
            {[
              { label: "Bill (before tip)", value: b },
              { label: `Tip (${tipPct}%)`, value: tip },
              { label: "Total", value: total },
            ].map(({ label, value }) => (
              <div key={label} className={`flex justify-between px-4 py-3 border-b border-neutral-50 last:border-0 ${label === "Total" ? "font-bold" : ""}`}>
                <span className={label === "Total" ? "text-[14px] text-foreground" : "text-[13px] text-muted-foreground"}>{label}</span>
                <span className={label === "Total" ? "text-[14px] text-foreground" : "text-[13px] text-foreground"}>${value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
