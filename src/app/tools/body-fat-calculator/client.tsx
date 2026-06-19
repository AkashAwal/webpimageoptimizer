"use client";

import { useState } from "react";

function navyBodyFat(gender: "male" | "female", waist: number, neck: number, hip: number, height: number, unit: "cm" | "in"): number {
  if (unit === "cm") {
    waist /= 2.54; neck /= 2.54; hip /= 2.54; height /= 2.54;
  }
  if (gender === "male") {
    return 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
  }
  return 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
}

function category(bf: number, gender: "male" | "female"): { label: string; color: string } {
  if (gender === "male") {
    if (bf < 6) return { label: "Essential fat", color: "text-blue-600 bg-blue-50" };
    if (bf < 14) return { label: "Athletic", color: "text-emerald-600 bg-emerald-50" };
    if (bf < 18) return { label: "Fitness", color: "text-green-600 bg-green-50" };
    if (bf < 25) return { label: "Average", color: "text-yellow-600 bg-yellow-50" };
    return { label: "Obese", color: "text-red-600 bg-red-50" };
  }
  if (bf < 14) return { label: "Essential fat", color: "text-blue-600 bg-blue-50" };
  if (bf < 21) return { label: "Athletic", color: "text-emerald-600 bg-emerald-50" };
  if (bf < 25) return { label: "Fitness", color: "text-green-600 bg-green-50" };
  if (bf < 32) return { label: "Average", color: "text-yellow-600 bg-yellow-50" };
  return { label: "Obese", color: "text-red-600 bg-red-50" };
}

export function BodyFatCalculatorClient() {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");

  const h = parseFloat(height), n = parseFloat(neck), w = parseFloat(waist), hp = parseFloat(hip);
  const valid = !isNaN(h) && !isNaN(n) && !isNaN(w) && h > 0 && n > 0 && w > n &&
    (gender === "male" || (!isNaN(hp) && hp > 0));

  const bf = valid ? navyBodyFat(gender, w, n, hp || 0, h, unit) : 0;
  const cat = valid ? category(bf, gender) : null;

  const u = unit === "cm" ? "cm" : "in";

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setUnit("cm")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === "cm" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Centimetres</button>
        <button onClick={() => setUnit("in")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === "in" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Inches</button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setGender("male")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${gender === "male" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Male</button>
          <button onClick={() => setGender("female")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${gender === "female" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Female</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: `Height (${u})`, val: height, set: setHeight, ph: unit === "cm" ? "175" : "69" },
            { label: `Neck circumference (${u})`, val: neck, set: setNeck, ph: unit === "cm" ? "38" : "15" },
            { label: `Waist circumference (${u})`, val: waist, set: setWaist, ph: unit === "cm" ? "85" : "33" },
            ...(gender === "female" ? [{ label: `Hip circumference (${u})`, val: hip, set: setHip, ph: unit === "cm" ? "95" : "37" }] : []),
          ].map(({ label, val, set, ph }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ))}
        </div>

        {valid && cat && (
          <div className="rounded-xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-2">Body fat percentage</p>
            <p className="text-[56px] font-bold">{bf.toFixed(1)}%</p>
            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${cat.color}`}>{cat.label}</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
        <p className="text-[12px] font-medium text-muted-foreground mb-2">Reference ranges ({gender})</p>
        <div className="space-y-1.5">
          {(gender === "male"
            ? [["Essential fat", "2–5%"], ["Athletic", "6–13%"], ["Fitness", "14–17%"], ["Average", "18–24%"], ["Obese", "25%+"],]
            : [["Essential fat", "10–13%"], ["Athletic", "14–20%"], ["Fitness", "21–24%"], ["Average", "25–31%"], ["Obese", "32%+"],]
          ).map(([label, range]) => (
            <div key={label} className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
