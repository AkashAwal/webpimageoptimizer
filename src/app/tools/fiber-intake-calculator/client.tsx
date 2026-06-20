"use client";
import { useState } from "react";

const HIGH_FIBER_FOODS = [
  { name: "Lentils (cooked, 1 cup)", fiber: 15.6 },
  { name: "Black beans (cooked, 1 cup)", fiber: 15 },
  { name: "Avocado (whole)", fiber: 10 },
  { name: "Chia seeds (1 oz)", fiber: 9.8 },
  { name: "Peas (cooked, 1 cup)", fiber: 8.8 },
  { name: "Broccoli (cooked, 1 cup)", fiber: 5.1 },
  { name: "Almonds (1 oz)", fiber: 3.5 },
  { name: "Whole wheat bread (1 slice)", fiber: 1.9 },
  { name: "Oatmeal (cooked, 1 cup)", fiber: 4 },
  { name: "Apple (medium)", fiber: 4.4 },
  { name: "Banana (medium)", fiber: 3.1 },
  { name: "Carrots (1 cup)", fiber: 3.6 },
  { name: "Quinoa (cooked, 1 cup)", fiber: 5.2 },
  { name: "Sweet potato (medium)", fiber: 3.8 },
];

export function FiberIntakeCalculatorClient() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [calories, setCalories] = useState(2000);
  const [method, setMethod] = useState<"age" | "calories">("age");

  const ageTarget = sex === "male"
    ? (age >= 51 ? 30 : 38)
    : (age >= 51 ? 21 : 25);

  const calorieTarget = Math.round((calories / 1000) * 14);
  const target = method === "age" ? ageTarget : calorieTarget;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="flex gap-2">
          {(["male", "female"] as const).map(s => (
            <button key={s} onClick={() => setSex(s)}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${sex === s ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Age</label>
            <input type="number" min={10} max={100} value={age} onChange={e => setAge(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Daily Calorie Intake</label>
            <input type="number" min={800} max={5000} value={calories} onChange={e => setCalories(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium text-muted-foreground mb-2">Recommendation Method</p>
          <div className="flex gap-2">
            <button onClick={() => setMethod("age")}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${method === "age" ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
              By age & sex (AHA)
            </button>
            <button onClick={() => setMethod("calories")}
              className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${method === "calories" ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
              By calories (14g/1000 kcal)
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
          <p className="text-[11px] text-emerald-700 font-medium mb-1">Daily Fiber Target</p>
          <p className="text-[32px] font-semibold text-emerald-800">{target}g</p>
          <p className="text-[12px] text-emerald-700">per day</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground mb-1">By age/sex (AHA)</p>
            <p className="text-[18px] font-semibold text-foreground">{ageTarget}g</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground mb-1">By calories (14g/1000 kcal)</p>
            <p className="text-[18px] font-semibold text-foreground">{calorieTarget}g</p>
          </div>
        </div>

        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">High-Fiber Foods</p>
          <div className="grid grid-cols-2 gap-1">
            {HIGH_FIBER_FOODS.map(f => (
              <div key={f.name} className="flex justify-between items-center py-1.5 border-b border-neutral-100 text-[12px]">
                <span className="text-muted-foreground truncate pr-2">{f.name}</span>
                <span className="font-medium text-foreground whitespace-nowrap">{f.fiber}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
