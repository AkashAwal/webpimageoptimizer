"use client";

import { useState, useMemo } from "react";

function rangeArr(a: number, b: number): number[] {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

function parseCronField(field: string, min: number, max: number): number[] | null {
  if (field === "*") return rangeArr(min, max);
  const result: number[] = [];
  for (const part of field.split(",")) {
    const stepMatch = part.match(/^(\*|(\d+)-(\d+))\/(\d+)$/);
    if (stepMatch) {
      const step = parseInt(stepMatch[4]);
      const start = stepMatch[1] === "*" ? min : parseInt(stepMatch[2]);
      const end = stepMatch[1] === "*" ? max : parseInt(stepMatch[3]);
      if (step < 1) return null;
      for (let i = start; i <= end; i += step) result.push(i);
      continue;
    }
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const a = parseInt(rangeMatch[1]);
      const b = parseInt(rangeMatch[2]);
      if (a > b || a < min || b > max) return null;
      result.push(...rangeArr(a, b));
      continue;
    }
    const n = parseInt(part);
    if (isNaN(n) || n < min || n > max) return null;
    result.push(n);
  }
  return [...new Set(result)].sort((a, b) => a - b);
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function describeField(field: string, type: "minute" | "hour" | "dom" | "month" | "dow"): string {
  if (field === "*") return `every ${type === "minute" ? "minute" : type === "hour" ? "hour" : type === "dom" ? "day" : type === "month" ? "month" : "weekday"}`;
  if (field.startsWith("*/")) return `every ${field.slice(2)} ${type}s`;
  const stepMatch = field.match(/^(\*|(\d+)-(\d+))\/(\d+)$/);
  if (stepMatch) return `every ${stepMatch[4]} ${type}s`;
  return field;
}

function getNextRuns(expr: string, count: number): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const [minF, hourF, domF, monF, dowF] = parts;
  const mins = parseCronField(minF, 0, 59);
  const hours = parseCronField(hourF, 0, 23);
  const doms = parseCronField(domF, 1, 31);
  const months = parseCronField(monF, 1, 12);
  const dows = parseCronField(dowF, 0, 6);
  if (!mins || !hours || !doms || !months || !dows) return [];

  const runs: Date[] = [];
  const now = new Date();
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);
  const limit = now.getTime() + 366 * 24 * 60 * 60 * 1000;
  let iterations = 0;

  while (runs.length < count && now.getTime() < limit && iterations < 600000) {
    iterations++;
    const mo = now.getMonth() + 1;
    const d = now.getDate();
    const h = now.getHours();
    const m = now.getMinutes();
    const wd = now.getDay();
    if (months.includes(mo) && doms.includes(d) && dows.includes(wd) && hours.includes(h) && mins.includes(m)) {
      runs.push(new Date(now));
    }
    now.setMinutes(now.getMinutes() + 1);
  }
  return runs;
}

const EXAMPLES = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every hour", expr: "0 * * * *" },
  { label: "Daily at midnight", expr: "0 0 * * *" },
  { label: "Mon–Fri at 9am", expr: "0 9 * * 1-5" },
  { label: "1st of month", expr: "0 0 1 * *" },
];

export function CrontabExplainerClient() {
  const [expr, setExpr] = useState("0 9 * * 1-5");

  const { parts, nextRuns, error } = useMemo(() => {
    const p = expr.trim().split(/\s+/);
    if (p.length !== 5) return { parts: null, nextRuns: [], error: "Enter a 5-field cron expression: minute hour day month weekday" };
    const [minF, hourF, domF, monF, dowF] = p;
    const labels = ["Minute", "Hour", "Day of month", "Month", "Day of week"];
    const ranges = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]] as const;
    const parsed = [minF, hourF, domF, monF, dowF].map((f, i) => parseCronField(f, ranges[i][0], ranges[i][1]));
    const errIdx = parsed.findIndex((r) => r === null);
    if (errIdx !== -1) return { parts: null, nextRuns: [], error: `Invalid value in field ${errIdx + 1} (${labels[errIdx]})` };

    const partDescs = [
      { label: "Minute", field: minF, values: parsed[0]!, desc: describeField(minF, "minute") },
      { label: "Hour", field: hourF, values: parsed[1]!, desc: describeField(hourF, "hour") },
      { label: "Day of month", field: domF, values: parsed[2]!, desc: describeField(domF, "dom") },
      { label: "Month", field: monF, values: parsed[3]!.map((m) => `${MONTH_NAMES[m - 1]} (${m})`).join(", "), desc: describeField(monF, "month") },
      { label: "Day of week", field: dowF, values: parsed[4]!.map((d) => `${DAY_NAMES[d]} (${d})`).join(", "), desc: describeField(dowF, "dow") },
    ];

    return { parts: partDescs, nextRuns: getNextRuns(expr, 5), error: null };
  }, [expr]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-1">
        {EXAMPLES.map(({ label, expr: e }) => (
          <button
            key={e}
            onClick={() => setExpr(e)}
            className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 font-mono text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black/10"
          placeholder="* * * * *"
          spellCheck={false}
        />
        <div className="mt-1 flex gap-4 px-4 text-[11px] text-muted-foreground">
          <span>minute</span>
          <span>hour</span>
          <span>day</span>
          <span>month</span>
          <span>weekday</span>
        </div>
      </div>

      {error && <p className="text-[13px] text-amber-600">{error}</p>}

      {parts && (
        <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden divide-y divide-black/5">
          {parts.map(({ label, field, desc }) => (
            <div key={label} className="flex items-start gap-4 px-4 py-3">
              <span className="w-28 shrink-0 text-[12px] font-medium text-muted-foreground pt-0.5">{label}</span>
              <code className="w-16 shrink-0 font-mono text-[13px] text-foreground">{field}</code>
              <span className="text-[13px] text-foreground">{desc}</span>
            </div>
          ))}
        </div>
      )}

      {nextRuns.length > 0 && (
        <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="border-b border-black/6 px-4 py-3">
            <span className="text-[12px] font-medium text-muted-foreground">Next 5 scheduled runs</span>
          </div>
          <div className="divide-y divide-black/5">
            {nextRuns.map((d, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[13px] text-foreground">{d.toLocaleString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                <span className="text-[11px] text-muted-foreground">{DAY_NAMES[d.getDay()]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
