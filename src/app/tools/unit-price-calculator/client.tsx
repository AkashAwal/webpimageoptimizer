"use client";

import { useState } from "react";

const INITIAL = [
  { name: "Item A", price: "", quantity: "", unit: "g" },
  { name: "Item B", price: "", quantity: "", unit: "g" },
  { name: "Item C", price: "", quantity: "", unit: "g" },
];

export function UnitPriceCalculatorClient() {
  const [items, setItems] = useState(INITIAL);

  const update = (i: number, field: keyof (typeof INITIAL)[0], val: string) => {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  };

  const pricesPerUnit = items.map((item) => {
    const p = parseFloat(item.price);
    const q = parseFloat(item.quantity);
    if (!p || !q || p <= 0 || q <= 0) return null;
    return p / q;
  });

  const validPrices = pricesPerUnit.filter((p) => p !== null) as number[];
  const minPrice = validPrices.length > 1 ? Math.min(...validPrices) : null;

  const COLORS = ["text-blue-600 bg-blue-50 border-blue-200", "text-purple-600 bg-purple-50 border-purple-200", "text-orange-600 bg-orange-50 border-orange-200"];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl border bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] transition-all ${
              pricesPerUnit[i] !== null && pricesPerUnit[i] === minPrice
                ? "border-emerald-300 ring-1 ring-emerald-300"
                : "border-neutral-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center justify-center size-6 rounded-full text-[11px] font-bold border ${COLORS[i]}`}>
                {String.fromCharCode(65 + i)}
              </span>
              <input
                type="text"
                value={item.name}
                onChange={(e) => update(i, "name", e.target.value)}
                className="flex-1 text-[13px] font-semibold text-foreground bg-transparent outline-none"
                placeholder={`Item ${String.fromCharCode(65 + i)}`}
              />
              {pricesPerUnit[i] !== null && pricesPerUnit[i] === minPrice && (
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">
                  Best deal
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Price ($)</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => update(i, "price", e.target.value)}
                  placeholder="2.99"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Quantity</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => update(i, "quantity", e.target.value)}
                  placeholder="500"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Unit</label>
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) => update(i, "unit", e.target.value)}
                  placeholder="g"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
                />
              </div>
            </div>
            {pricesPerUnit[i] !== null && (
              <p className="mt-2 text-[12px] text-muted-foreground">
                ${(pricesPerUnit[i]! * 100).toFixed(4)} per 100 {item.unit} · ${pricesPerUnit[i]!.toFixed(5)} per {item.unit}
              </p>
            )}
          </div>
        ))}
      </div>

      {validPrices.length > 1 && minPrice !== null && (
        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-[13px] text-muted-foreground">
          Items sorted cheapest to most expensive:{" "}
          {[...pricesPerUnit.map((p, i) => ({ p, i })).filter((x) => x.p !== null)]
            .sort((a, b) => (a.p as number) - (b.p as number))
            .map((x) => items[x.i].name || `Item ${String.fromCharCode(65 + x.i)}`)
            .join(" → ")}
        </div>
      )}
    </div>
  );
}
