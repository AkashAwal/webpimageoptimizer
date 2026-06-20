"use client";
import { useState } from "react";

type Ingredient = { id: number; name: string; amount: string; unit: string };

function scaleAmount(amount: string, factor: number): string {
  const n = parseFloat(amount);
  if (isNaN(n)) return amount;
  const scaled = n * factor;
  if (scaled === Math.floor(scaled)) return String(scaled);
  const fractions: [number, string][] = [[1/4, "¼"], [1/3, "⅓"], [1/2, "½"], [2/3, "⅔"], [3/4, "¾"]];
  const whole = Math.floor(scaled);
  const frac = scaled - whole;
  const nearest = fractions.reduce((best, f) => Math.abs(f[0] - frac) < Math.abs(best[0] - frac) ? f : best, fractions[0]);
  if (Math.abs(nearest[0] - frac) < 0.07) {
    return whole > 0 ? `${whole} ${nearest[1]}` : nearest[1];
  }
  return scaled % 1 === 0 ? String(scaled) : scaled.toFixed(2);
}

export function RecipeScalerClient() {
  const [originalServings, setOriginalServings] = useState(4);
  const [targetServings, setTargetServings] = useState(8);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: "All-purpose flour", amount: "2", unit: "cups" },
    { id: 2, name: "Butter", amount: "0.5", unit: "cup" },
    { id: 3, name: "Sugar", amount: "1", unit: "cup" },
    { id: 4, name: "Eggs", amount: "2", unit: "" },
    { id: 5, name: "Vanilla extract", amount: "1", unit: "tsp" },
  ]);
  const [nextId, setNextId] = useState(6);

  const factor = originalServings > 0 ? targetServings / originalServings : 1;

  function addIngredient() {
    setIngredients(i => [...i, { id: nextId, name: "", amount: "1", unit: "cup" }]);
    setNextId(n => n + 1);
  }
  function removeIngredient(id: number) { setIngredients(i => i.filter(x => x.id !== id)); }
  function updateIngredient(id: number, field: keyof Ingredient, val: string) {
    setIngredients(i => i.map(x => x.id === id ? { ...x, [field]: val } : x));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Original Servings</label>
            <input type="number" min={1} value={originalServings} onChange={e => setOriginalServings(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div className="text-center">
            <p className="text-[12px] text-muted-foreground mb-1">Scale factor</p>
            <p className="text-[20px] font-semibold text-foreground">×{factor.toFixed(2)}</p>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Target Servings</label>
            <input type="number" min={1} value={targetServings} onChange={e => setTargetServings(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Ingredients</p>
            <button onClick={addIngredient}
              className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-muted-foreground hover:bg-neutral-200 transition-colors">+ Add</button>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2 gap-y-2 text-[12px] font-medium text-muted-foreground mb-1">
            <span>Ingredient</span><span>Original</span><span>Unit</span><span>Scaled</span><span></span>
          </div>
          <div className="space-y-2">
            {ingredients.map(ing => (
              <div key={ing.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2 items-center">
                <input type="text" value={ing.name} onChange={e => updateIngredient(ing.id, "name", e.target.value)}
                  placeholder="Ingredient name"
                  className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <input type="text" value={ing.amount} onChange={e => updateIngredient(ing.id, "amount", e.target.value)}
                  className="w-16 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <input type="text" value={ing.unit} onChange={e => updateIngredient(ing.id, "unit", e.target.value)}
                  placeholder="cup"
                  className="w-16 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <span className="w-20 rounded-xl bg-emerald-50 border border-emerald-100 px-2 py-2 text-[13px] font-medium text-emerald-800 text-center">
                  {scaleAmount(ing.amount, factor)} {ing.unit}
                </span>
                <button onClick={() => removeIngredient(ing.id)} className="text-neutral-400 hover:text-foreground text-[16px] px-1">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
