"use client";

import { useState } from "react";

const EXPENSE_CATEGORIES = [
  "Housing (rent/mortgage)",
  "Utilities",
  "Groceries",
  "Transport",
  "Insurance",
  "Healthcare",
  "Subscriptions",
  "Dining out",
  "Entertainment",
  "Clothing",
  "Savings / investments",
  "Other",
];

function fmt(n: number, currency: string) {
  return currency + Math.abs(n).toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function BudgetCalculatorClient() {
  const [currency, setCurrency] = useState("$");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState<Record<string, string>>({});

  const totalIncome = parseFloat(income) || 0;
  const totalExpenses = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const surplus = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (surplus / totalIncome) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["$", "£", "€", "₹"].map((c) => (
          <button key={c} onClick={() => setCurrency(c)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${currency === c ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >{c}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Monthly income ({currency})</label>
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="5000"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[18px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
        </div>

        <div className="border-t border-neutral-100 pt-3">
          <p className="text-[12px] font-medium text-muted-foreground mb-3">Monthly expenses</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <label className="text-[12px] text-muted-foreground flex-1 truncate">{cat}</label>
                <input type="number" value={expenses[cat] ?? ""} placeholder="0"
                  onChange={(e) => setExpenses((prev) => ({ ...prev, [cat]: e.target.value }))}
                  className="w-24 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors text-right" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {(totalIncome > 0 || totalExpenses > 0) && (
        <div className="space-y-3">
          <div className={`rounded-2xl p-5 text-center ${surplus >= 0 ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
            <p className="text-[12px] text-muted-foreground mb-1">{surplus >= 0 ? "Monthly surplus" : "Monthly shortfall"}</p>
            <p className={`text-[48px] font-bold ${surplus >= 0 ? "text-emerald-700" : "text-red-600"}`}>
              {surplus < 0 ? "-" : ""}{fmt(surplus, currency)}
            </p>
            {totalIncome > 0 && <p className="text-[13px] text-muted-foreground mt-1">Savings rate: {savingsRate.toFixed(1)}%</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
              <p className="text-[11px] text-muted-foreground">Total income</p>
              <p className="text-[22px] font-bold text-foreground mt-1">{fmt(totalIncome, currency)}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
              <p className="text-[11px] text-muted-foreground">Total expenses</p>
              <p className="text-[22px] font-bold text-foreground mt-1">{fmt(totalExpenses, currency)}</p>
            </div>
          </div>

          {totalIncome > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
              <p className="text-[12px] font-medium text-muted-foreground mb-2">50/30/20 benchmark</p>
              {[
                { label: "Needs (50%)", target: totalIncome * 0.5, color: "bg-blue-400" },
                { label: "Wants (30%)", target: totalIncome * 0.3, color: "bg-purple-400" },
                { label: "Savings (20%)", target: totalIncome * 0.2, color: "bg-emerald-400" },
              ].map(({ label, target }) => (
                <div key={label} className="flex justify-between text-[12px] py-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{fmt(target, currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
