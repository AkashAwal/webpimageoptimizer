"use client";

import { useState } from "react";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function AgeCalculatorClient() {
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10));

  let result: {
    years: number; months: number; days: number;
    totalDays: number; totalWeeks: number;
    nextBirthday: string; daysUntilBirthday: number;
    dayOfWeekBorn: string;
  } | null = null;

  if (dob && asOf && dob < asOf) {
    const birth = new Date(dob);
    const ref = new Date(asOf);

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((ref.getTime() - birth.getTime()) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);

    let nextBirthdayYear = ref.getFullYear();
    const thisYearBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
    if (thisYearBirthday <= ref) nextBirthdayYear++;
    const nextBirthday = new Date(nextBirthdayYear, birth.getMonth(), birth.getDate());
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - ref.getTime()) / 86400000);

    result = {
      years, months, days,
      totalDays, totalWeeks,
      nextBirthday: `${DAYS_OF_WEEK[nextBirthday.getDay()]}, ${MONTHS[nextBirthday.getMonth()]} ${nextBirthday.getDate()}, ${nextBirthdayYear}`,
      daysUntilBirthday,
      dayOfWeekBorn: DAYS_OF_WEEK[birth.getDay()],
    };
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Date of birth</label>
            <input
              type="date"
              value={dob}
              max={asOf}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Age as of</label>
            <input
              type="date"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-4">
            <div className="text-center">
              <p className="text-[12px] text-neutral-400 mb-1">You are</p>
              <p className="text-[44px] font-bold leading-none">
                {result.years}
                <span className="text-[20px] font-normal text-neutral-400"> years</span>
              </p>
              <p className="text-[16px] text-neutral-300 mt-1">
                {result.months} months and {result.days} days old
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <p className="text-[22px] font-bold">{result.totalDays.toLocaleString()}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">total days</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <p className="text-[22px] font-bold">{result.totalWeeks.toLocaleString()}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">total weeks</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Born on a</p>
              <p className="text-[16px] font-semibold text-foreground">{result.dayOfWeekBorn}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">
                Next birthday ({result.daysUntilBirthday} days away)
              </p>
              <p className="text-[14px] font-semibold text-foreground">{result.nextBirthday}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
