"use client";

import { useState } from "react";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function DueDateCalculatorClient() {
  const [mode, setMode] = useState<"lmp" | "conception">("lmp");
  const [date, setDate] = useState("");

  const input = date ? new Date(date + "T00:00:00") : null;
  const dueDate = input ? addDays(input, mode === "lmp" ? 280 : 266) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = dueDate ? Math.round((dueDate.getTime() - today.getTime()) / 86400000) : null;
  const daysSinceStart = input ? Math.round((today.getTime() - input.getTime()) / 86400000) : null;
  const weeksPregnant = daysSinceStart !== null && daysSinceStart > 0 ? Math.floor(daysSinceStart / 7) : null;
  const daysExtra = daysSinceStart !== null && daysSinceStart > 0 ? daysSinceStart % 7 : null;

  const trimesters = dueDate ? [
    { label: "1st Trimester", start: addDays(input!, 0), end: addDays(input!, 83), weeks: "Weeks 1–12" },
    { label: "2nd Trimester", start: addDays(input!, 84), end: addDays(input!, 195), weeks: "Weeks 13–28" },
    { label: "3rd Trimester", start: addDays(input!, 196), end: dueDate, weeks: "Weeks 29–40" },
  ] : [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("lmp")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "lmp" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Last period (LMP)</button>
        <button onClick={() => setMode("conception")} className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "conception" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>Conception date</button>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">
          {mode === "lmp" ? "First day of last menstrual period" : "Estimated conception date"}
        </label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
      </div>

      {dueDate && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-neutral-900 text-white p-5 text-center">
            <p className="text-[12px] text-neutral-400 mb-2">Estimated due date</p>
            <p className="text-[24px] font-bold">{fmtDate(dueDate)}</p>
            {daysLeft !== null && (
              <p className="text-[14px] text-neutral-300 mt-2">
                {daysLeft > 0 ? `${daysLeft} days to go` : daysLeft === 0 ? "Due today!" : `${Math.abs(daysLeft)} days past due`}
              </p>
            )}
          </div>

          {weeksPregnant !== null && weeksPregnant >= 0 && weeksPregnant <= 42 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
                <p className="text-[11px] text-muted-foreground">Currently</p>
                <p className="text-[24px] font-bold text-foreground mt-1">{weeksPregnant}w {daysExtra}d</p>
                <p className="text-[11px] text-muted-foreground">pregnant</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
                <p className="text-[11px] text-muted-foreground">Trimester</p>
                <p className="text-[24px] font-bold text-foreground mt-1">
                  {weeksPregnant <= 12 ? "1st" : weeksPregnant <= 28 ? "2nd" : "3rd"}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
            <p className="text-[12px] font-medium text-muted-foreground mb-3">Trimesters</p>
            {trimesters.map((t) => (
              <div key={t.label} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground">{t.weeks}</p>
                </div>
                <div className="text-right text-[12px] text-muted-foreground">
                  <p>{fmtShort(t.start)} – {fmtShort(t.end)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="text-[12px] text-muted-foreground">Due date is an estimate based on a 40-week (280-day) pregnancy from LMP. Ultrasound dating is more accurate and may differ by 1–2 weeks.</p>
    </div>
  );
}
