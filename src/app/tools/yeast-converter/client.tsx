"use client";
import { useState } from "react";

const ACTIVE_TO_INSTANT = 3 / 4;
const ACTIVE_TO_FRESH = 2.25;
const ACTIVE_TSP_PER_PACKET = 2.25;
const INSTANT_TO_ACTIVE = 1 / ACTIVE_TO_INSTANT;
const FRESH_TO_ACTIVE = 1 / ACTIVE_TO_FRESH;

type YeastType = "active" | "instant" | "fresh";

function toActiveTsp(val: number, from: YeastType): number {
  if (from === "active") return val;
  if (from === "instant") return val * INSTANT_TO_ACTIVE;
  return val * FRESH_TO_ACTIVE;
}
function fromActiveTsp(activeTsp: number, to: YeastType): number {
  if (to === "active") return activeTsp;
  if (to === "instant") return activeTsp * ACTIVE_TO_INSTANT;
  return activeTsp * ACTIVE_TO_FRESH;
}
function round(n: number) { return Math.round(n * 100) / 100; }

export function YeastConverterClient() {
  const [inputType, setInputType] = useState<YeastType>("active");
  const [amount, setAmount] = useState(2.25);
  const [amountUnit, setAmountUnit] = useState<"tsp" | "g" | "packets">("tsp");

  const TSP_PER_G_ACTIVE = 1 / 3.1;
  const TSP_PER_G_INSTANT = 1 / 3;

  function toTsp(val: number, type: YeastType, unit: "tsp" | "g" | "packets"): number {
    if (unit === "tsp") return val;
    if (unit === "packets") return val * ACTIVE_TSP_PER_PACKET;
    return type === "instant" ? val * TSP_PER_G_INSTANT : val * TSP_PER_G_ACTIVE;
  }

  const amountInTsp = toTsp(amount, inputType, amountUnit);
  const activeTsp = toActiveTsp(amountInTsp, inputType);

  const results: { type: YeastType; label: string; tsp: number; g: number; packets: number }[] = [
    { type: "active", label: "Active Dry Yeast", tsp: round(activeTsp), g: round(activeTsp * 3.1), packets: round(activeTsp / ACTIVE_TSP_PER_PACKET) },
    { type: "instant", label: "Instant / Fast-Acting Yeast", tsp: round(fromActiveTsp(activeTsp, "instant")), g: round(fromActiveTsp(activeTsp, "instant") * 3), packets: round(fromActiveTsp(activeTsp, "instant") / ACTIVE_TSP_PER_PACKET) },
    { type: "fresh", label: "Fresh Yeast", tsp: round(fromActiveTsp(activeTsp, "fresh")), g: round(fromActiveTsp(activeTsp, "fresh") * 3.4), packets: null as unknown as number },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div>
          <p className="text-[12px] font-medium text-muted-foreground mb-2">I have (yeast type)</p>
          <div className="flex gap-2">
            {(["active", "instant", "fresh"] as const).map(t => (
              <button key={t} onClick={() => setInputType(t)}
                className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${inputType === t ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
                {t === "active" ? "Active Dry" : t === "instant" ? "Instant" : "Fresh"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Amount</label>
            <input type="number" min={0} step={0.25} value={amount} onChange={e => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Unit</label>
            <div className="flex gap-2">
              {(["tsp", "g", "packets"] as const).map(u => (
                <button key={u} onClick={() => setAmountUnit(u)}
                  className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${amountUnit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {results.map(r => (
            <div key={r.type} className={`rounded-xl border p-4 ${r.type === inputType ? "bg-emerald-50 border-emerald-100" : "bg-neutral-50 border-neutral-200"}`}>
              <p className={`text-[12px] font-semibold mb-2 ${r.type === inputType ? "text-emerald-700" : "text-muted-foreground"}`}>{r.label}</p>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[11px] text-muted-foreground mb-0.5">tsp</p>
                  <p className={`text-[16px] font-semibold ${r.type === inputType ? "text-emerald-800" : "text-foreground"}`}>{r.tsp}</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-muted-foreground mb-0.5">grams</p>
                  <p className={`text-[16px] font-semibold ${r.type === inputType ? "text-emerald-800" : "text-foreground"}`}>{r.g}g</p>
                </div>
                {r.packets && (
                  <div className="text-center">
                    <p className="text-[11px] text-muted-foreground mb-0.5">packets (¼ oz)</p>
                    <p className={`text-[16px] font-semibold ${r.type === inputType ? "text-emerald-800" : "text-foreground"}`}>{r.packets}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Standard Packet Equivalents</p>
          <div className="space-y-1 text-[13px]">
            {[
              ["1 packet active dry yeast", "2¼ tsp = 7g = ¼ oz"],
              ["1 tsp active dry", "¾ tsp instant yeast"],
              ["1 tsp active dry", "2¼ tsp fresh yeast"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
