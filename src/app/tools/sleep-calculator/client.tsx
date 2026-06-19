"use client";

import { useState } from "react";

const CYCLE_MINS = 90;
const FALL_ASLEEP_MINS = 14;

function addMins(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

function subMins(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  let total = h * 60 + m - minutes;
  if (total < 0) total += 24 * 60;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

function fmt12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function SleepCalculatorClient() {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [time, setTime] = useState("07:00");

  const cycles = [6, 5, 4.5, 4, 3.5, 3].map((c) => {
    const mins = c * CYCLE_MINS;
    if (mode === "wake") {
      const sleepTime = subMins(time, Math.round(mins) + FALL_ASLEEP_MINS);
      return { cycles: c, hours: mins / 60, sleepTime, wakeTime: time };
    } else {
      const wakeTime = addMins(time, Math.round(mins) + FALL_ASLEEP_MINS);
      return { cycles: c, hours: mins / 60, sleepTime: time, wakeTime };
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("wake")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "wake" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>I want to wake up at…</button>
        <button onClick={() => setMode("sleep")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "sleep" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>I want to sleep at…</button>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">{mode === "wake" ? "Wake-up time" : "Bedtime"}</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[20px] font-semibold text-foreground outline-none focus:border-neutral-400 transition-colors" />
      </div>

      <p className="text-[12px] text-muted-foreground">Includes ~{FALL_ASLEEP_MINS} min to fall asleep. Each sleep cycle is 90 minutes.</p>

      <div className="space-y-2">
        {cycles.map(({ cycles: c, hours, sleepTime, wakeTime }, i) => {
          const good = hours >= 7;
          const ok = hours >= 6 && !good;
          return (
            <div key={i} className={`rounded-xl border p-4 ${good ? "border-emerald-200 bg-emerald-50" : ok ? "border-yellow-200 bg-yellow-50" : "border-neutral-200 bg-neutral-50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-[14px] font-semibold ${good ? "text-emerald-800" : ok ? "text-yellow-800" : "text-neutral-700"}`}>
                    {mode === "wake" ? `Sleep at ${fmt12(sleepTime)}` : `Wake at ${fmt12(wakeTime)}`}
                  </p>
                  <p className={`text-[11px] ${good ? "text-emerald-600" : ok ? "text-yellow-600" : "text-neutral-500"}`}>
                    {c} cycles · {hours} hours of sleep
                  </p>
                </div>
                {good && <span className="rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2 py-0.5">Recommended</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
