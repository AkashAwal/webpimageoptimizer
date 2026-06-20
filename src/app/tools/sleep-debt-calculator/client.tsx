"use client";
import { useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SleepDebtCalculatorClient() {
  const [target, setTarget] = useState(8);
  const [actual, setActual] = useState<number[]>([7, 6.5, 7, 6, 5.5, 8, 8]);

  const totalDebt = actual.reduce((sum, h, i) => sum + Math.max(0, target - h), 0);
  const totalSurplus = actual.reduce((sum, h) => sum + Math.max(0, h - target), 0);
  const netDebt = totalDebt - totalSurplus;
  const avgSleep = actual.reduce((s, h) => s + h, 0) / 7;
  const daysToRecover = netDebt > 0 ? Math.ceil(netDebt / 1) : 0;

  function setDay(i: number, val: number) {
    setActual(a => { const n = [...a]; n[i] = val; return n; });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">Sleep Target per Night (hours)</label>
          <div className="flex gap-2">
            {[7, 7.5, 8, 8.5, 9].map(h => (
              <button key={h} onClick={() => setTarget(h)}
                className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${target === h ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
                {h}h
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Actual Sleep This Week</p>
          <div className="space-y-2">
            {DAYS.map((day, i) => {
              const diff = actual[i] - target;
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-24 text-[12px] text-muted-foreground">{day}</span>
                  <input
                    type="range" min={0} max={12} step={0.5} value={actual[i]}
                    onChange={e => setDay(i, Number(e.target.value))}
                    className="flex-1 accent-foreground" />
                  <span className="w-10 text-[13px] font-medium text-foreground text-right">{actual[i]}h</span>
                  <span className={`w-14 text-[12px] font-medium text-right ${diff < 0 ? "text-red-500" : diff > 0 ? "text-emerald-600" : "text-neutral-400"}`}>
                    {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Net Sleep Debt", val: netDebt > 0 ? `${netDebt.toFixed(1)}h` : "None", sub: netDebt > 0 ? "accumulated" : "you're on track!", emerald: netDebt <= 0 },
            { label: "Avg per Night", val: `${avgSleep.toFixed(1)}h`, sub: `vs ${target}h target`, emerald: avgSleep >= target },
            { label: "Deficit Days", val: actual.filter((h) => h < target).toString().split(",").length - 1 + actual.filter((h) => h < target).length + " days", sub: "below target", emerald: false },
            { label: "Days to Recover", val: daysToRecover > 0 ? `${daysToRecover} days` : "0 days", sub: "at +1h/night extra", emerald: daysToRecover === 0 },
          ].map(r => (
            <div key={r.label} className={`rounded-xl border p-3 text-center ${r.emerald ? "bg-emerald-50 border-emerald-100" : "bg-neutral-50 border-neutral-200"}`}>
              <p className={`text-[11px] font-medium mb-1 ${r.emerald ? "text-emerald-700" : "text-muted-foreground"}`}>{r.label}</p>
              <p className={`text-[15px] font-semibold ${r.emerald ? "text-emerald-800" : "text-foreground"}`}>{r.val}</p>
              <p className="text-[11px] text-muted-foreground">{r.sub}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground">The CDC recommends 7–9 hours for adults. You cannot fully "bank" sleep in advance, but recovery sleep (catching up) does help reduce sleep debt over time.</p>
      </div>
    </div>
  );
}
