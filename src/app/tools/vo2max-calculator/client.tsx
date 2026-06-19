"use client";
import { useState } from "react";

type Method = "cooper" | "rockport" | "restinghr";
type Gender = "male" | "female";

const FITNESS_CATEGORIES = [
  { label: "Superior", min: 55, color: "text-emerald-700" },
  { label: "Excellent", min: 47, color: "text-emerald-600" },
  { label: "Good", min: 39, color: "text-blue-600" },
  { label: "Fair", min: 31, color: "text-amber-600" },
  { label: "Poor", min: 0, color: "text-red-600" },
];

function getCategory(vo2max: number) {
  return FITNESS_CATEGORIES.find((c) => vo2max >= c.min) ?? FITNESS_CATEGORIES[4];
}

export function Vo2MaxCalculatorClient() {
  const [method, setMethod] = useState<Method>("cooper");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState(30);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  // Cooper test
  const [distanceM, setDistanceM] = useState(2400);
  const [distanceMiles, setDistanceMiles] = useState(1.5);

  // Rockport walk test
  const [walkTimeMins, setWalkTimeMins] = useState(15);
  const [walkTimeSecs, setWalkTimeSecs] = useState(0);
  const [walkHR, setWalkHR] = useState(150);
  const [weightKg, setWeightKg] = useState(70);
  const [weightLbs, setWeightLbs] = useState(154);

  // Resting HR method
  const [restHR, setRestHR] = useState(60);
  const [maxHR, setMaxHR] = useState(190);

  let vo2max = 0;

  if (method === "cooper") {
    const dist = unit === "metric" ? distanceM : distanceMiles * 1609.34;
    vo2max = (dist - 504.9) / 44.73;
  } else if (method === "rockport") {
    const wKg = unit === "metric" ? weightKg : weightLbs * 0.453592;
    const wLbs = unit === "metric" ? weightKg * 2.20462 : weightLbs;
    const time = walkTimeMins + walkTimeSecs / 60;
    const genderVal = gender === "male" ? 1 : 0;
    vo2max = 132.853 - 0.0769 * wLbs - 0.3877 * age + 6.315 * genderVal - 3.2649 * time - 0.1565 * walkHR;
    void wKg;
  } else {
    vo2max = 15 * (maxHR / restHR);
  }

  vo2max = Math.max(0, vo2max);
  const category = getCategory(vo2max);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-2">Test Method</label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "cooper", label: "Cooper 12-Min Run" },
                { id: "rockport", label: "Rockport Walk" },
                { id: "restinghr", label: "Resting HR" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`rounded-xl px-3 py-2 text-[12px] font-medium transition-colors ${
                  method === m.id
                    ? "bg-foreground text-background"
                    : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
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
          {(method === "rockport" || method === "restinghr") && (
            <div className="flex gap-2">
              {(["metric", "imperial"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                    unit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
                  }`}
                >
                  {u === "metric" ? "kg / km" : "lbs / miles"}
                </button>
              ))}
            </div>
          )}
        </div>

        {method === "cooper" && (
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Distance covered in 12 minutes ({unit === "metric" ? "metres" : "miles"})
            </label>
            {unit === "metric" ? (
              <input type="number" min={100} value={distanceM} onChange={(e) => setDistanceM(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            ) : (
              <input type="number" min={0.1} step={0.01} value={distanceMiles} onChange={(e) => setDistanceMiles(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            )}
          </div>
        )}

        {method === "rockport" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground mb-1">Age (years)</label>
                <input type="number" min={18} max={90} value={age} onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground mb-1">Body Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                {unit === "metric" ? (
                  <input type="number" min={30} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                ) : (
                  <input type="number" min={66} value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground mb-1">1-Mile Walk Time</label>
                <div className="flex gap-2">
                  <input type="number" min={0} max={60} value={walkTimeMins} onChange={(e) => setWalkTimeMins(Number(e.target.value))}
                    className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" placeholder="min" />
                  <input type="number" min={0} max={59} value={walkTimeSecs} onChange={(e) => setWalkTimeSecs(Number(e.target.value))}
                    className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" placeholder="sec" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-muted-foreground mb-1">Heart Rate at finish (bpm)</label>
                <input type="number" min={60} max={220} value={walkHR} onChange={(e) => setWalkHR(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
              </div>
            </div>
          </>
        )}

        {method === "restinghr" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1">Resting Heart Rate (bpm)</label>
              <input type="number" min={30} max={100} value={restHR} onChange={(e) => setRestHR(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-muted-foreground mb-1">Max Heart Rate (bpm)</label>
              <input type="number" min={100} max={220} value={maxHR} onChange={(e) => setMaxHR(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </div>
          </div>
        )}

        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-5 text-center">
          <p className="text-[12px] text-muted-foreground font-medium mb-1">Estimated VO2 Max</p>
          <p className="text-[32px] font-semibold text-foreground">{vo2max.toFixed(1)}</p>
          <p className="text-[12px] text-muted-foreground mb-2">mL/kg/min</p>
          <p className={`text-[14px] font-semibold ${category.color}`}>{category.label}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6">
        <p className="text-[12px] font-medium text-muted-foreground mb-3">VO2 Max fitness scale (general adult reference)</p>
        <div className="space-y-0">
          {[
            { label: "Superior", range: "55+", color: "text-emerald-700" },
            { label: "Excellent", range: "47–54", color: "text-emerald-600" },
            { label: "Good", range: "39–46", color: "text-blue-600" },
            { label: "Fair", range: "31–38", color: "text-amber-600" },
            { label: "Poor", range: "< 31", color: "text-red-600" },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
              <span className={`text-[13px] font-medium ${c.color}`}>{c.label}</span>
              <span className="text-[12px] text-muted-foreground">{c.range} mL/kg/min</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
