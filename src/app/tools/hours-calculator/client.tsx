"use client";

import { useState } from "react";

function parseTime(t: string): number | null {
  const m = t.match(/^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/i);
  if (!m) return null;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const ampm = m[3]?.toLowerCase();
  if (min > 59) return null;
  if (ampm === "pm" && h < 12) h += 12;
  if (ampm === "am" && h === 12) h = 0;
  if (h > 23) return null;
  return h * 60 + min;
}

function fmtHHMM(mins: number) {
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function fmtDecimal(mins: number) {
  return (Math.abs(mins) / 60).toFixed(2);
}

const ENTRIES_DEFAULT = [{ start: "", end: "", break: "" }];

export function HoursCalculatorClient() {
  const [entries, setEntries] = useState(ENTRIES_DEFAULT);

  const update = (i: number, field: "start" | "end" | "break", val: string) => {
    setEntries((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  };

  const addRow = () => setEntries((prev) => [...prev, { start: "", end: "", break: "" }]);
  const removeRow = (i: number) => setEntries((prev) => prev.filter((_, idx) => idx !== i));

  const rows = entries.map((e) => {
    const s = parseTime(e.start);
    const en = parseTime(e.end);
    if (s === null || en === null) return null;
    let diff = en - s;
    if (diff < 0) diff += 24 * 60; // overnight
    const brk = Math.max(0, parseInt(e.break) || 0);
    const worked = Math.max(0, diff - brk);
    return { worked, diff, brk };
  });

  const validRows = rows.filter(Boolean) as { worked: number; diff: number; brk: number }[];
  const total = validRows.reduce((sum, r) => sum + r.worked, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-3">
        <div className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 text-[11px] font-medium text-muted-foreground px-1">
          <span>Start</span>
          <span>End</span>
          <span>Break (min)</span>
          <span />
        </div>
        {entries.map((e, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-center">
            <input
              type="text"
              value={e.start}
              onChange={(ev) => update(i, "start", ev.target.value)}
              placeholder="9:00 am"
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
            <input
              type="text"
              value={e.end}
              onChange={(ev) => update(i, "end", ev.target.value)}
              placeholder="5:30 pm"
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
            <input
              type="number"
              value={e.break}
              onChange={(ev) => update(i, "break", ev.target.value)}
              placeholder="30"
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
            <button
              onClick={() => removeRow(i)}
              disabled={entries.length === 1}
              className="size-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-foreground transition-colors disabled:opacity-30"
              aria-label="Remove row"
            >
              ×
            </button>
            {rows[i] !== null && (
              <div className="col-span-3 text-[12px] text-muted-foreground pl-1">
                → {fmtHHMM(rows[i]!.worked)} worked ({fmtDecimal(rows[i]!.worked)} hrs)
              </div>
            )}
          </div>
        ))}
        <button
          onClick={addRow}
          className="text-[13px] font-medium text-neutral-500 hover:text-foreground transition-colors"
        >
          + Add another period
        </button>
      </div>

      {total > 0 && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-[12px] text-neutral-400">Total hours worked</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-[40px] font-bold">{fmtDecimal(total)}</span>
            <span className="text-[16px] text-neutral-400">hrs decimal</span>
          </div>
          <div className="text-[16px] text-neutral-300">{fmtHHMM(total)}</div>
        </div>
      )}

      <p className="text-[12px] text-muted-foreground">
        Accepts 12-hour (9:00 am / 5:30 pm) or 24-hour (09:00 / 17:30) format. End times before start times are treated as overnight shifts.
      </p>
    </div>
  );
}
