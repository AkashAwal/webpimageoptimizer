"use client";

import { useState } from "react";

type Field = "annual" | "monthly" | "biweekly" | "weekly" | "daily" | "hourly";

const FIELDS: { id: Field; label: string }[] = [
  { id: "annual", label: "Annual" },
  { id: "monthly", label: "Monthly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "weekly", label: "Weekly" },
  { id: "daily", label: "Daily" },
  { id: "hourly", label: "Hourly" },
];

function toAnnual(val: number, field: Field, hoursPerWeek: number, weeksPerYear: number): number {
  switch (field) {
    case "annual": return val;
    case "monthly": return val * 12;
    case "biweekly": return val * 26;
    case "weekly": return val * weeksPerYear;
    case "daily": return val * (weeksPerYear * 5);
    case "hourly": return val * hoursPerWeek * weeksPerYear;
  }
}

function fromAnnual(annual: number, field: Field, hoursPerWeek: number, weeksPerYear: number): number {
  switch (field) {
    case "annual": return annual;
    case "monthly": return annual / 12;
    case "biweekly": return annual / 26;
    case "weekly": return annual / weeksPerYear;
    case "daily": return annual / (weeksPerYear * 5);
    case "hourly": return annual / (hoursPerWeek * weeksPerYear);
  }
}

export function SalaryCalculatorClient() {
  const [activeField, setActiveField] = useState<Field>("annual");
  const [value, setValue] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");

  const v = parseFloat(value) || 0;
  const hpw = parseFloat(hoursPerWeek) || 40;
  const wpy = parseFloat(weeksPerYear) || 52;

  const annual = v > 0 ? toAnnual(v, activeField, hpw, wpy) : 0;

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Enter salary as</label>
          <div className="flex flex-wrap gap-2">
            {FIELDS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveField(f.id)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  activeField === f.id
                    ? "bg-foreground text-background"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">
            {FIELDS.find((f) => f.id === activeField)?.label} salary ($)
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={activeField === "hourly" ? "25.00" : activeField === "annual" ? "60000" : "5000"}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[16px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Hours per week</label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Weeks per year</label>
            <input
              type="number"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {annual > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
          <div className="space-y-2">
            {FIELDS.map((f) => {
              const val = fromAnnual(annual, f.id, hpw, wpy);
              const isActive = f.id === activeField;
              return (
                <div
                  key={f.id}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${isActive ? "bg-neutral-900 text-white" : "bg-neutral-50"}`}
                >
                  <span className={`text-[13px] font-medium ${isActive ? "text-neutral-300" : "text-muted-foreground"}`}>
                    {f.label}
                  </span>
                  <span className={`text-[16px] font-bold ${isActive ? "text-white" : "text-foreground"}`}>
                    ${fmt(val)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
