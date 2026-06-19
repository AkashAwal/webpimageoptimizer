"use client";
import { useState } from "react";

type Gender = "male" | "female";

const WHO_RISK: Record<Gender, { max: number; label: string; color: string }[]> = {
  male: [
    { max: 0.9, label: "Low Risk", color: "text-emerald-700" },
    { max: 0.95, label: "Moderate Risk", color: "text-amber-600" },
    { max: 1.0, label: "High Risk", color: "text-orange-600" },
    { max: Infinity, label: "Very High Risk", color: "text-red-700" },
  ],
  female: [
    { max: 0.8, label: "Low Risk", color: "text-emerald-700" },
    { max: 0.85, label: "Moderate Risk", color: "text-amber-600" },
    { max: 0.9, label: "High Risk", color: "text-orange-600" },
    { max: Infinity, label: "Very High Risk", color: "text-red-700" },
  ],
};

export function WaistToHipRatioClient() {
  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [waist, setWaist] = useState(86);
  const [hip, setHip] = useState(97);

  const waistCm = unit === "cm" ? waist : waist * 2.54;
  const hipCm = unit === "cm" ? hip : hip * 2.54;
  const ratio = hipCm > 0 ? waistCm / hipCm : 0;

  const risk = WHO_RISK[gender].find((r) => ratio <= r.max) ?? WHO_RISK[gender][3];

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
            {(["cm", "in"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  unit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Waist Circumference ({unit})
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={waist}
              onChange={(e) => setWaist(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Measured at narrowest point</p>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Hip Circumference ({unit})
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={hip}
              onChange={(e) => setHip(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Measured at widest point</p>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-5 text-center">
          <p className="text-[12px] text-muted-foreground font-medium mb-1">Waist-to-Hip Ratio</p>
          <p className="text-[36px] font-semibold text-foreground">{ratio.toFixed(2)}</p>
          <p className={`text-[15px] font-semibold mt-1 ${risk.color}`}>{risk.label}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6">
        <p className="text-[12px] font-medium text-muted-foreground mb-3">WHO health risk classification — {gender}</p>
        <div className="space-y-0">
          {(
            [
              { label: "Low Risk", male: "≤ 0.90", female: "≤ 0.80", color: "text-emerald-700" },
              { label: "Moderate Risk", male: "0.91–0.95", female: "0.81–0.85", color: "text-amber-600" },
              { label: "High Risk", male: "0.96–1.00", female: "0.86–0.90", color: "text-orange-600" },
              { label: "Very High Risk", male: "> 1.00", female: "> 0.90", color: "text-red-700" },
            ] as const
          ).map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
            >
              <span className={`text-[13px] font-medium ${row.color}`}>{row.label}</span>
              <span className="text-[12px] text-muted-foreground">{gender === "male" ? row.male : row.female}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
