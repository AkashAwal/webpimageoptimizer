"use client";
import { useState } from "react";

function fToC(f: number) { return (f - 32) * 5 / 9; }
function cToF(c: number) { return c * 9 / 5 + 32; }
function cToGas(c: number) {
  if (c < 135) return "¼";
  if (c < 150) return "½";
  if (c < 160) return "1";
  if (c < 175) return "2";
  if (c < 190) return "3";
  if (c < 205) return "4";
  if (c < 220) return "5";
  if (c < 230) return "6";
  if (c < 245) return "7";
  if (c < 260) return "8";
  return "9";
}
function gasToC(gas: number) {
  const map: Record<number, number> = { 0.25: 130, 0.5: 145, 1: 155, 2: 165, 3: 180, 4: 195, 5: 210, 6: 225, 7: 240, 8: 255, 9: 270 };
  return map[gas] ?? gas * 27 + 107;
}

const REFERENCE = [
  { label: "Very cool / warm", c: 120, f: 248, gas: "½", desc: "Meringue, pavlova" },
  { label: "Cool", c: 150, f: 302, gas: "2", desc: "Slow cooking, custards" },
  { label: "Moderate", c: 180, f: 356, gas: "4", desc: "Cakes, biscuits, bread" },
  { label: "Moderately hot", c: 200, f: 392, gas: "6", desc: "Roast vegetables, muffins" },
  { label: "Hot", c: 220, f: 428, gas: "7", desc: "Pizza, pastry, roasts" },
  { label: "Very hot", c: 240, f: 464, gas: "9", desc: "Searing, pizza Napoletana" },
];

type Mode = "c" | "f" | "gas" | "fan";

export function OvenTemperatureConverterClient() {
  const [mode, setMode] = useState<Mode>("c");
  const [inputC, setInputC] = useState(180);
  const [inputF, setInputF] = useState(356);
  const [inputGas, setInputGas] = useState(4);
  const [inputFan, setInputFan] = useState(160);

  function syncFrom(m: Mode, val: number) {
    if (m === "c") {
      setInputC(val);
      setInputF(Math.round(cToF(val)));
      setInputFan(val - 20);
    } else if (m === "f") {
      setInputF(val);
      const c = fToC(val);
      setInputC(Math.round(c));
      setInputFan(Math.round(c - 20));
    } else if (m === "gas") {
      setInputGas(val);
      const c = gasToC(val);
      setInputC(Math.round(c));
      setInputF(Math.round(cToF(c)));
      setInputFan(Math.round(c - 20));
    } else if (m === "fan") {
      setInputFan(val);
      const c = val + 20;
      setInputC(c);
      setInputF(Math.round(cToF(c)));
    }
  }

  const gasDisplay = cToGas(inputC);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="flex gap-2">
          {(["c", "f", "gas", "fan"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${mode === m ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
              {m === "c" ? "°C" : m === "f" ? "°F" : m === "gas" ? "Gas Mark" : "Fan °C"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">
            {mode === "c" ? "Celsius (°C)" : mode === "f" ? "Fahrenheit (°F)" : mode === "gas" ? "Gas Mark" : "Fan / Convection (°C)"}
          </label>
          <input type="number" step={mode === "gas" ? 1 : 5}
            value={mode === "c" ? inputC : mode === "f" ? inputF : mode === "gas" ? inputGas : inputFan}
            onChange={e => syncFrom(mode, Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "°C", val: `${inputC}` },
            { label: "°F", val: `${inputF}` },
            { label: "Gas Mark", val: gasDisplay },
            { label: "Fan °C", val: `${inputFan}` },
          ].map(r => (
            <div key={r.label} className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-[11px] text-emerald-700 font-medium mb-1">{r.label}</p>
              <p className="text-[18px] font-semibold text-emerald-800">{r.val}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Common Baking Temperatures</p>
          <div className="space-y-1">
            {REFERENCE.map(r => (
              <div key={r.label}
                className={`flex items-center gap-3 py-1.5 text-[12px] border-b border-neutral-100 last:border-0 cursor-pointer hover:bg-neutral-50 rounded px-1 ${Math.abs(inputC - r.c) < 10 ? "bg-emerald-50 font-medium" : ""}`}
                onClick={() => syncFrom("c", r.c)}>
                <span className="w-28 text-muted-foreground">{r.label}</span>
                <span className="w-12 text-foreground">{r.c}°C</span>
                <span className="w-12 text-muted-foreground">{r.f}°F</span>
                <span className="w-10 text-muted-foreground">Gas {r.gas}</span>
                <span className="text-muted-foreground">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">Fan/convection ovens run ~20°C / 25°F hotter than conventional. Gas marks are approximate. Click a row to set that temperature.</p>
      </div>
    </div>
  );
}
