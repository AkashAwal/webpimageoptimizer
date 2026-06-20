"use client";
import { useState } from "react";

const SUBSTITUTIONS = [
  { ingredient: "1 egg", substitute: "3 tbsp aquafaba (chickpea liquid)", tags: ["vegan", "dairy-free"] },
  { ingredient: "1 egg", substitute: "1 tbsp ground flaxseed + 3 tbsp water (rest 5 min)", tags: ["vegan"] },
  { ingredient: "1 cup buttermilk", substitute: "1 cup milk + 1 tbsp white vinegar or lemon juice (rest 5 min)", tags: ["easy"] },
  { ingredient: "1 cup buttermilk", substitute: "1 cup plain yogurt", tags: ["easy"] },
  { ingredient: "1 tsp baking powder", substitute: "¼ tsp baking soda + ½ tsp cream of tartar", tags: ["easy"] },
  { ingredient: "1 cup cake flour", substitute: "¾ cup + 2 tbsp all-purpose flour + 2 tbsp cornstarch", tags: [] },
  { ingredient: "1 cup bread flour", substitute: "1 cup all-purpose flour + 1½ tsp vital wheat gluten", tags: [] },
  { ingredient: "1 cup all-purpose flour", substitute: "1 cup + 2 tbsp cake flour", tags: [] },
  { ingredient: "1 cup self-rising flour", substitute: "1 cup all-purpose flour + 1½ tsp baking powder + ¼ tsp salt", tags: [] },
  { ingredient: "1 cup sugar", substitute: "¾ cup honey (reduce other liquids by ¼ cup, lower oven temp by 25°F)", tags: [] },
  { ingredient: "1 cup sugar", substitute: "¾ cup maple syrup (reduce liquid by 3 tbsp)", tags: ["vegan"] },
  { ingredient: "1 cup brown sugar", substitute: "1 cup white sugar + 1 tbsp molasses", tags: ["easy"] },
  { ingredient: "1 cup powdered sugar", substitute: "1 cup + 1 tbsp granulated sugar, blended until fine", tags: [] },
  { ingredient: "1 cup butter", substitute: "1 cup coconut oil (solid)", tags: ["vegan", "dairy-free"] },
  { ingredient: "1 cup butter", substitute: "¾ cup vegetable oil", tags: ["vegan", "dairy-free"] },
  { ingredient: "1 cup whole milk", substitute: "½ cup evaporated milk + ½ cup water", tags: [] },
  { ingredient: "1 cup whole milk", substitute: "1 cup oat milk or almond milk", tags: ["vegan", "dairy-free"] },
  { ingredient: "1 cup heavy cream", substitute: "¾ cup whole milk + ¼ cup melted butter", tags: [] },
  { ingredient: "1 cup sour cream", substitute: "1 cup plain full-fat yogurt", tags: [] },
  { ingredient: "1 oz unsweetened chocolate", substitute: "3 tbsp cocoa powder + 1 tbsp butter or oil", tags: [] },
  { ingredient: "1 cup chocolate chips", substitute: "1 cup carob chips", tags: ["vegan"] },
  { ingredient: "1 tbsp cornstarch (thickener)", substitute: "2 tbsp all-purpose flour", tags: [] },
  { ingredient: "1 tsp vanilla extract", substitute: "½ tsp vanilla powder or 1 tsp vanilla bean paste", tags: [] },
  { ingredient: "1 cup cream cheese", substitute: "1 cup mascarpone", tags: [] },
  { ingredient: "1 cup vegetable oil (in baking)", substitute: "1 cup unsweetened applesauce (for moisture)", tags: ["low-fat"] },
  { ingredient: "2 tbsp active dry yeast", substitute: "1½ tsp instant yeast", tags: ["easy"] },
  { ingredient: "½ tsp cream of tartar", substitute: "1 tsp lemon juice or white vinegar", tags: ["easy"] },
  { ingredient: "1 cup pumpkin purée", substitute: "1 cup mashed sweet potato", tags: [] },
  { ingredient: "1 cup honey", substitute: "1¼ cup sugar + ¼ cup water", tags: [] },
  { ingredient: "1 tsp lemon zest", substitute: "½ tsp lemon extract", tags: [] },
];

const ALL_TAGS = ["easy", "vegan", "dairy-free", "low-fat"];

export function BakingSubstitutionsClient() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = SUBSTITUTIONS.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.ingredient.toLowerCase().includes(q) || s.substitute.toLowerCase().includes(q);
    const matchesTag = !activeTag || s.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search ingredients or substitutes…"
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />

        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${activeTag === tag ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>
              {tag}
            </button>
          ))}
        </div>

        <p className="text-[12px] text-muted-foreground">{filtered.length} substitution{filtered.length !== 1 ? "s" : ""}</p>

        <div className="space-y-2">
          {filtered.map((s, i) => (
            <div key={i} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-foreground">{s.ingredient}</p>
                <div className="flex gap-1">
                  {s.tags.map(t => (
                    <span key={t} className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-600">{t}</span>
                  ))}
                </div>
              </div>
              <p className="text-[13px] text-muted-foreground">→ {s.substitute}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-[13px] text-muted-foreground text-center py-8">No substitutions found for "{search}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
