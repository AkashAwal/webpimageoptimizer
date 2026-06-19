"use client";
import { useState } from "react";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function shortDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(date: Date, from: Date): number {
  return Math.round((date.getTime() - from.getTime()) / 86400000);
}

export function MenstrualCycleCalculatorClient() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [lastPeriod, setLastPeriod] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 14);
    return d.toISOString().split("T")[0];
  });
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [cycles, setCycles] = useState(3);

  const lmpDate = new Date(lastPeriod + "T00:00:00");

  const predictions = Array.from({ length: cycles }, (_, i) => {
    const periodStart = addDays(lmpDate, (i + 1) * cycleLength);
    const periodEnd = addDays(periodStart, periodDuration - 1);
    const ovulation = addDays(periodStart, -(cycleLength - 14));
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    return { periodStart, periodEnd, ovulation, fertileStart, fertileEnd };
  });

  const nextOvulation = addDays(lmpDate, cycleLength - 14);
  const nextFertileStart = addDays(nextOvulation, -5);
  const nextFertileEnd = addDays(nextOvulation, 1);
  const nextPeriod = predictions[0]?.periodStart;

  const daysToNextPeriod = nextPeriod ? daysUntil(nextPeriod, today) : null;
  const daysToOvulation = daysUntil(nextOvulation, today);

  const currentDay = daysUntil(today, lmpDate) % cycleLength;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">First Day of Last Period</label>
          <input
            type="date"
            value={lastPeriod}
            max={today.toISOString().split("T")[0]}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Cycle Length: <span className="text-foreground font-semibold">{cycleLength} days</span>
            </label>
            <input
              type="range"
              min={21}
              max={35}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full accent-foreground"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>21</span><span>28</span><span>35</span>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Period Duration: <span className="text-foreground font-semibold">{periodDuration} days</span>
            </label>
            <input
              type="range"
              min={2}
              max={8}
              value={periodDuration}
              onChange={(e) => setPeriodDuration(Number(e.target.value))}
              className="w-full accent-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-center">
            <p className="text-[11px] text-red-700 font-medium mb-1">Next Period</p>
            {nextPeriod && (
              <>
                <p className="text-[13px] font-semibold text-red-800">{shortDate(nextPeriod)}</p>
                <p className="text-[11px] text-red-600 mt-0.5">
                  {daysToNextPeriod !== null && daysToNextPeriod >= 0
                    ? `in ${daysToNextPeriod} days`
                    : daysToNextPeriod !== null
                    ? `${Math.abs(daysToNextPeriod)} days ago`
                    : ""}
                </p>
              </>
            )}
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-center">
            <p className="text-[11px] text-purple-700 font-medium mb-1">Ovulation</p>
            <p className="text-[13px] font-semibold text-purple-800">{shortDate(nextOvulation)}</p>
            <p className="text-[11px] text-purple-600 mt-0.5">
              {daysToOvulation >= 0 ? `in ${daysToOvulation} days` : `${Math.abs(daysToOvulation)} days ago`}
            </p>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-center col-span-2">
            <p className="text-[11px] text-green-700 font-medium mb-1">Fertile Window</p>
            <p className="text-[13px] font-semibold text-green-800">
              {shortDate(nextFertileStart)} – {shortDate(nextFertileEnd)}
            </p>
            <p className="text-[11px] text-green-600 mt-0.5">Highest chance of conception</p>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
          <p className="text-[12px] text-muted-foreground">
            Current cycle day: <span className="font-semibold text-foreground">{currentDay >= 0 ? currentDay + 1 : "—"}</span> of {cycleLength}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-foreground">Upcoming cycles</p>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 6] as const).map((n) => (
              <button
                key={n}
                onClick={() => setCycles(n)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  cycles === n ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {predictions.map((p, i) => (
            <div key={i} className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
              <p className="text-[12px] font-semibold text-foreground mb-2">Cycle {i + 1}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Period</p>
                  <p className="text-[12px] font-medium text-red-700">{shortDate(p.periodStart)}–{shortDate(p.periodEnd)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Ovulation</p>
                  <p className="text-[12px] font-medium text-purple-700">{formatDate(p.ovulation)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium mb-0.5">Fertile Window</p>
                  <p className="text-[12px] font-medium text-green-700">{shortDate(p.fertileStart)}–{shortDate(p.fertileEnd)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
