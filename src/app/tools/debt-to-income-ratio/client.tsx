"use client";
import { useState } from "react";

type DebtItem = { id: number; label: string; amount: number };

function pct(n: number) { return (n * 100).toFixed(1) + "%"; }
function getRating(dti: number) {
  if (dti < 0.28) return { label: "Excellent", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" };
  if (dti < 0.36) return { label: "Good", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" };
  if (dti < 0.43) return { label: "Acceptable", color: "text-amber-700", bg: "bg-amber-50 border-amber-100" };
  if (dti < 0.50) return { label: "High", color: "text-orange-700", bg: "bg-orange-50 border-orange-100" };
  return { label: "Very High", color: "text-red-700", bg: "bg-red-50 border-red-100" };
}

export function DebtToIncomeRatioClient() {
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(6000);
  const [housingCost, setHousingCost] = useState(1500);
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: 1, label: "Car payment", amount: 400 },
    { id: 2, label: "Student loan", amount: 300 },
  ]);
  const [nextId, setNextId] = useState(3);

  const totalDebts = debts.reduce((s, d) => s + d.amount, 0);
  const frontEndDTI = grossMonthlyIncome > 0 ? housingCost / grossMonthlyIncome : 0;
  const backEndDTI = grossMonthlyIncome > 0 ? (housingCost + totalDebts) / grossMonthlyIncome : 0;
  const rating = getRating(backEndDTI);

  function addDebt() {
    setDebts(d => [...d, { id: nextId, label: "New debt", amount: 0 }]);
    setNextId(n => n + 1);
  }
  function removeDebt(id: number) { setDebts(d => d.filter(x => x.id !== id)); }
  function updateDebt(id: number, field: "label" | "amount", val: string | number) {
    setDebts(d => d.map(x => x.id === id ? { ...x, [field]: val } : x));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Gross Monthly Income ($)</label>
            <input type="number" min={0} value={grossMonthlyIncome} onChange={e => setGrossMonthlyIncome(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Monthly Housing Cost ($)</label>
            <input type="number" min={0} value={housingCost} onChange={e => setHousingCost(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            <p className="text-[11px] text-muted-foreground mt-1">Rent or mortgage + insurance + tax</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Other Monthly Debts</p>
            <button onClick={addDebt}
              className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-muted-foreground hover:bg-neutral-200 transition-colors">
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {debts.map(d => (
              <div key={d.id} className="flex gap-2 items-center">
                <input type="text" value={d.label} onChange={e => updateDebt(d.id, "label", e.target.value)}
                  className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <input type="number" min={0} value={d.amount} onChange={e => updateDebt(d.id, "amount", Number(e.target.value))}
                  className="w-24 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <button onClick={() => removeDebt(d.id)}
                  className="text-neutral-400 hover:text-foreground transition-colors px-1 text-[16px]">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl border p-4 text-center ${rating.bg}`}>
          <p className={`text-[11px] font-semibold mb-1 ${rating.color}`}>Back-end DTI — {rating.label}</p>
          <p className={`text-[28px] font-semibold ${rating.color}`}>{pct(backEndDTI)}</p>
        </div>

        <div className="space-y-1 text-[13px]">
          {[
            { label: "Front-end DTI (housing only)", val: pct(frontEndDTI), note: "< 28% is ideal" },
            { label: "Back-end DTI (all debts)", val: pct(backEndDTI), note: "< 36% conventional / < 43% FHA" },
            { label: "Total monthly debt", val: `$${(housingCost + totalDebts).toFixed(0)}` },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center py-1.5 border-b border-neutral-100 last:border-0">
              <span>
                <span className="text-muted-foreground">{r.label}</span>
                <span className="ml-2 text-[11px] text-neutral-400">{r.note}</span>
              </span>
              <span className="font-medium text-foreground">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
