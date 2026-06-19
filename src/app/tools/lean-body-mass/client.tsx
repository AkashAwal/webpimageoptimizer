"use client";
import { useState } from "react";

type Gender = "male" | "female";

function calcBoer(weight: number, height: number, gender: Gender) {
  if (gender === "male") return 0.407 * weight + 0.267 * height - 19.2;
  return 0.252 * weight + 0.473 * height - 48.3;
}

function calcJames(weight: number, height: number, gender: Gender) {
  if (gender === "male") return 1.1 * weight - 128 * Math.pow(weight / height, 2);
  return 1.07 * weight - 148 * Math.pow(weight / height, 2);
}

function calcHume(weight: number, height: number, gender: Gender) {
  if (gender === "male") return 0.3281 * weight + 0.3393 * height - 29.5336;
  return 0.29569 * weight + 0.41813 * height - 43.2933;
}

export function LeanBodyMassClient() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weightKg, setWeightKg] = useState(80);
  const [weightLbs, setWeightLbs] = useState(176);
  const [heightCm, setHeightCm] = useState(178);
  const [heightIn, setHeightIn] = useState(70);

  const w = unit === "metric" ? weightKg : weightLbs * 0.453592;
  const h = unit === "metric" ? heightCm : heightIn * 2.54;

  const boer = Math.max(0, calcBoer(w, h, gender));
  const james = Math.max(0, calcJames(w, h, gender));
  const hume = Math.max(0, calcHume(w, h, gender));
  const avg = (boer + james + hume) / 3;
  const fatMass = w - avg;
  const bodyFatPct = w > 0 ? (fatMass / w) * 100 : 0;

  const toLbs = (kg: number) => (kg * 2.20462).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2">
            {(["male", "female"] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  gender === g ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
                }`}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  unit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
                }`}
              >
                {u === "metric" ? "kg / cm" : "lbs / in"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            {unit === "metric" ? (
              <input type="number" min={30} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            ) : (
              <input type="number" min={66} value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            )}
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Height ({unit === "metric" ? "cm" : "inches"})
            </label>
            {unit === "metric" ? (
              <input type="number" min={100} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            ) : (
              <input type="number" min={40} value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
            <p className="text-[11px] text-emerald-700 font-medium mb-1">Lean Mass (avg)</p>
            <p className="text-[16px] font-semibold text-emerald-800">{avg.toFixed(1)} kg</p>
            <p className="text-[11px] text-emerald-600">{toLbs(avg)} lbs</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Fat Mass</p>
            <p className="text-[15px] font-semibold text-foreground">{fatMass.toFixed(1)} kg</p>
            <p className="text-[11px] text-muted-foreground">{toLbs(fatMass)} lbs</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Body Fat %</p>
            <p className="text-[15px] font-semibold text-foreground">{bodyFatPct.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6">
        <p className="text-[12px] font-medium text-muted-foreground mb-3">Results by formula</p>
        <div className="space-y-0">
          {[
            { label: "Boer (1984)", lbm: boer },
            { label: "James (1949)", lbm: james },
            { label: "Hume (1966)", lbm: hume },
          ].map((f) => (
            <div key={f.label} className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0">
              <span className="text-[13px] text-muted-foreground">{f.label}</span>
              <div className="text-right">
                <span className="text-[13px] font-medium text-foreground">{f.lbm.toFixed(1)} kg</span>
                <span className="text-[12px] text-muted-foreground ml-2">({toLbs(f.lbm)} lbs)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
