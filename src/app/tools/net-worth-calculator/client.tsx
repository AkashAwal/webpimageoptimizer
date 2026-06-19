"use client";

import { useState } from "react";

interface Item { label: string; value: string; }

function useItems(initial: Item[]) {
  const [items, setItems] = useState<Item[]>(initial);
  const add = () => setItems((prev) => [...prev, { label: "", value: "" }]);
  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Item, val: string) =>
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const total = items.reduce((s, item) => s + (parseFloat(item.value) || 0), 0);
  return { items, add, remove, update, total };
}

function fmt(n: number, currency: string) {
  return currency + Math.abs(n).toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function NetWorthCalculatorClient() {
  const [currency, setCurrency] = useState("$");
  const assets = useItems([
    { label: "Savings / cash", value: "" },
    { label: "Home value", value: "" },
    { label: "Investments", value: "" },
    { label: "Retirement accounts", value: "" },
  ]);
  const liabilities = useItems([
    { label: "Mortgage balance", value: "" },
    { label: "Car loans", value: "" },
    { label: "Credit card debt", value: "" },
    { label: "Student loans", value: "" },
  ]);

  const netWorth = assets.total - liabilities.total;
  const hasData = assets.total > 0 || liabilities.total > 0;

  function ItemList({ state }: { state: ReturnType<typeof useItems> }) {
    return (
      <div className="space-y-2">
        {state.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={item.label} onChange={(e) => state.update(i, "label", e.target.value)}
              placeholder="Description"
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            <input type="number" value={item.value} onChange={(e) => state.update(i, "value", e.target.value)}
              placeholder="0"
              className="w-28 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            <button onClick={() => state.remove(i)} className="text-neutral-400 hover:text-red-500 transition-colors text-[18px] px-1">×</button>
          </div>
        ))}
        <button onClick={state.add} className="text-[12px] text-neutral-500 hover:text-foreground transition-colors">+ Add item</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["$", "£", "€", "₹"].map((c) => (
          <button key={c} onClick={() => setCurrency(c)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${currency === c ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-foreground">Assets</p>
            <p className="text-[13px] font-semibold text-emerald-600">{fmt(assets.total, currency)}</p>
          </div>
          <ItemList state={assets} />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-foreground">Liabilities</p>
            <p className="text-[13px] font-semibold text-red-500">{fmt(liabilities.total, currency)}</p>
          </div>
          <ItemList state={liabilities} />
        </div>
      </div>

      {hasData && (
        <div className={`rounded-2xl p-5 text-center ${netWorth >= 0 ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
          <p className="text-[12px] text-muted-foreground mb-1">Net worth (Assets − Liabilities)</p>
          <p className={`text-[48px] font-bold ${netWorth >= 0 ? "text-emerald-700" : "text-red-600"}`}>
            {netWorth < 0 ? "-" : ""}{fmt(netWorth, currency)}
          </p>
        </div>
      )}
    </div>
  );
}
