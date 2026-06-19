"use client";
import { useState } from "react";

// IOM 2009 guidelines
const IOM_GUIDELINES = [
  {
    label: "Underweight (BMI < 18.5)",
    bmiMin: 0,
    bmiMax: 18.5,
    totalGainKgMin: 12.5,
    totalGainKgMax: 18,
    weeklyGainKgMin: 0.44,
    weeklyGainKgMax: 0.58,
  },
  {
    label: "Normal weight (BMI 18.5–24.9)",
    bmiMin: 18.5,
    bmiMax: 25,
    totalGainKgMin: 11.5,
    totalGainKgMax: 16,
    weeklyGainKgMin: 0.35,
    weeklyGainKgMax: 0.50,
  },
  {
    label: "Overweight (BMI 25–29.9)",
    bmiMin: 25,
    bmiMax: 30,
    totalGainKgMin: 7,
    totalGainKgMax: 11.5,
    weeklyGainKgMin: 0.23,
    weeklyGainKgMax: 0.33,
  },
  {
    label: "Obese (BMI ≥ 30)",
    bmiMin: 30,
    bmiMax: Infinity,
    totalGainKgMin: 5,
    totalGainKgMax: 9,
    weeklyGainKgMin: 0.17,
    weeklyGainKgMax: 0.27,
  },
];

function toLbs(kg: number) {
  return (kg * 2.20462).toFixed(1);
}

export function PregnancyWeightGainClient() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(165);
  const [heightIn, setHeightIn] = useState(65);
  const [weightKg, setWeightKg] = useState(63);
  const [weightLbs, setWeightLbs] = useState(139);
  const [week, setWeek] = useState(20);
  const [currentGainKg, setCurrentGainKg] = useState(6);
  const [currentGainLbs, setCurrentGainLbs] = useState(13);

  const h = unit === "metric" ? heightCm / 100 : (heightIn * 2.54) / 100;
  const w = unit === "metric" ? weightKg : weightLbs * 0.453592;
  const bmi = h > 0 ? w / (h * h) : 0;
  const guide = IOM_GUIDELINES.find((g) => bmi >= g.bmiMin && bmi < g.bmiMax) ?? IOM_GUIDELINES[1];

  const gainSoFar = unit === "metric" ? currentGainKg : currentGainLbs * 0.453592;

  // Expected gain at current week (linear approximation: ~2 kg first trimester, then weekly rate)
  const firstTrimGain = 2;
  const weeksAfterFirst = Math.max(0, week - 13);
  const expectedGainMid = firstTrimGain + weeksAfterFirst * ((guide.weeklyGainKgMin + guide.weeklyGainKgMax) / 2);
  const expectedGainMin = firstTrimGain + weeksAfterFirst * guide.weeklyGainKgMin;
  const expectedGainMax = firstTrimGain + weeksAfterFirst * guide.weeklyGainKgMax;

  const onTrack = gainSoFar >= expectedGainMin && gainSoFar <= expectedGainMax;
  const below = gainSoFar < expectedGainMin;

  const remainingMin = Math.max(0, guide.totalGainKgMin - gainSoFar);
  const remainingMax = Math.max(0, guide.totalGainKgMax - gainSoFar);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`flex-1 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                unit === u ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
              }`}
            >
              {u === "metric" ? "Metric (kg / cm)" : "Imperial (lbs / in)"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Pre-Pregnancy Height ({unit === "metric" ? "cm" : "inches"})
            </label>
            {unit === "metric" ? (
              <input type="number" min={100} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            ) : (
              <input type="number" min={40} value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            )}
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Pre-Pregnancy Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
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
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Current Week of Pregnancy: <span className="text-foreground font-semibold">{week}</span>
            </label>
            <input type="range" min={1} max={42} value={week} onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full accent-foreground" />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>Week 1</span><span>Week 13</span><span>Week 28</span><span>Week 42</span>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Weight Gained So Far ({unit === "metric" ? "kg" : "lbs"})
            </label>
            {unit === "metric" ? (
              <input type="number" min={0} step={0.1} value={currentGainKg} onChange={(e) => setCurrentGainKg(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            ) : (
              <input type="number" min={0} step={0.1} value={currentGainLbs} onChange={(e) => setCurrentGainLbs(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            )}
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
          <p className="text-[11px] text-muted-foreground font-medium mb-1">Pre-pregnancy BMI</p>
          <p className="text-[18px] font-semibold text-foreground">{bmi.toFixed(1)}</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">{guide.label}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
            <p className="text-[11px] text-emerald-700 font-medium mb-1">Recommended Total Gain</p>
            <p className="text-[16px] font-semibold text-emerald-800">
              {guide.totalGainKgMin}–{guide.totalGainKgMax} kg
            </p>
            <p className="text-[11px] text-emerald-600">
              ({toLbs(guide.totalGainKgMin)}–{toLbs(guide.totalGainKgMax)} lbs)
            </p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Recommended Weekly Rate (2nd–3rd tri)</p>
            <p className="text-[15px] font-semibold text-foreground">
              {guide.weeklyGainKgMin}–{guide.weeklyGainKgMax} kg/wk
            </p>
            <p className="text-[11px] text-muted-foreground">
              ({toLbs(guide.weeklyGainKgMin)}–{toLbs(guide.weeklyGainKgMax)} lbs/wk)
            </p>
          </div>
        </div>

        {week > 0 && (
          <div
            className={`rounded-xl p-4 ${
              onTrack
                ? "bg-emerald-50 border border-emerald-100"
                : below
                ? "bg-amber-50 border border-amber-100"
                : "bg-orange-50 border border-orange-100"
            }`}
          >
            <p
              className={`text-[12px] font-medium mb-1 ${
                onTrack ? "text-emerald-700" : below ? "text-amber-700" : "text-orange-700"
              }`}
            >
              At week {week}: {onTrack ? "On track" : below ? "Below expected range" : "Above expected range"}
            </p>
            <p className={`text-[12px] ${onTrack ? "text-emerald-700" : below ? "text-amber-700" : "text-orange-700"}`}>
              Expected gain at week {week}: {expectedGainMin.toFixed(1)}–{expectedGainMax.toFixed(1)} kg
              ({toLbs(expectedGainMin)}–{toLbs(expectedGainMax)} lbs)
            </p>
            {!onTrack && (
              <p className={`text-[12px] mt-1 ${below ? "text-amber-600" : "text-orange-600"}`}>
                Still to gain to reach target: {remainingMin.toFixed(1)}–{remainingMax.toFixed(1)} kg in {42 - week} weeks.
                Talk to your healthcare provider about your individual situation.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
