"use client";

import { useState } from "react";

const PRESETS = [10, 15, 18, 20, 25];

export function TipCalculatorClient() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("1");
  const [useCustom, setUseCustom] = useState(false);

  const billNum = parseFloat(bill) || 0;
  const tip = useCustom ? parseFloat(customTip) || 0 : tipPct;
  const peopleNum = Math.max(1, parseInt(people) || 1);

  const tipAmount = (billNum * tip) / 100;
  const total = billNum + tipAmount;
  const perPerson = total / peopleNum;
  const tipPerPerson = tipAmount / peopleNum;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-5">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Bill amount ($)</label>
        <input
          type="number"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[12px] font-medium text-muted-foreground">Tip percentage</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => { setTipPct(p); setUseCustom(false); }}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                !useCustom && tipPct === p
                  ? "bg-foreground text-background"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {p}%
            </button>
          ))}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setUseCustom(true)}
              className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                useCustom
                  ? "bg-foreground text-background"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Custom
            </button>
            {useCustom && (
              <input
                type="number"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder="%"
                autoFocus
                className="w-16 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-[13px] text-foreground outline-none focus:border-neutral-400"
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Number of people</label>
        <input
          type="number"
          value={people}
          min={1}
          onChange={(e) => setPeople(e.target.value)}
          className="w-24 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors"
        />
      </div>

      {billNum > 0 && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
          <div className="flex justify-between text-[14px]">
            <span className="text-neutral-400">Tip ({tip}%)</span>
            <span className="font-semibold">${fmt(tipAmount)}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-neutral-400">Total</span>
            <span className="font-semibold">${fmt(total)}</span>
          </div>
          {peopleNum > 1 && (
            <>
              <hr className="border-white/10" />
              <div className="flex justify-between text-[14px]">
                <span className="text-neutral-400">Per person (tip)</span>
                <span className="font-semibold">${fmt(tipPerPerson)}</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-neutral-300 font-semibold">Per person (total)</span>
                <span className="font-bold text-[18px]">${fmt(perPerson)}</span>
              </div>
            </>
          )}
          {peopleNum === 1 && (
            <div className="flex justify-between text-[17px]">
              <span className="text-neutral-300 font-semibold">You pay</span>
              <span className="font-bold">${fmt(total)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
