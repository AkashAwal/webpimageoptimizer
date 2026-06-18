"use client";

import { useState } from "react";

export function DateDifferenceClient() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);

  const d1 = new Date(start);
  const d2 = new Date(end);
  const earlier = d1 <= d2 ? d1 : d2;
  const later = d1 <= d2 ? d2 : d1;
  const isNeg = d1 > d2;

  const totalDays = Math.round((later.getTime() - earlier.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;
  const totalHours = totalDays * 24;

  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();
  if (days < 0) {
    months--;
    days += new Date(later.getFullYear(), later.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Start date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            />
            <p className="text-[11px] text-muted-foreground">{DAYS[d1.getDay()]}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">End date</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            />
            <p className="text-[11px] text-muted-foreground">{DAYS[d2.getDay()]}</p>
          </div>
        </div>
      </div>

      {totalDays === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-center text-[13px] text-muted-foreground">
          Same date — difference is 0 days.
        </div>
      ) : (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-4">
          {isNeg && (
            <p className="text-[11px] text-amber-400">End date is before start date — showing absolute difference.</p>
          )}
          <div className="text-center">
            <p className="text-[52px] font-bold leading-none">{totalDays.toLocaleString()}</p>
            <p className="text-[16px] text-neutral-300 mt-1">days</p>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:grid-cols-4">
            {[
              { val: years, label: "years" },
              { val: months, label: "months" },
              { val: days, label: "days" },
              { val: totalWeeks, label: `weeks ${remainingDays > 0 ? `+${remainingDays}d` : ""}` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/5 p-3 text-center">
                <p className="text-[20px] font-bold">{item.val.toLocaleString()}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-[16px] font-semibold">{totalHours.toLocaleString()}</p>
              <p className="text-[11px] text-neutral-400">hours</p>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold">{(totalDays * 24 * 60).toLocaleString()}</p>
              <p className="text-[11px] text-neutral-400">minutes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
