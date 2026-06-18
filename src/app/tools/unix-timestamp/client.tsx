"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "@/components/ui/icons";

function formatDate(d: Date) {
  return {
    utc: d.toUTCString(),
    local: d.toLocaleString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    iso: d.toISOString(),
    relative: (() => {
      const diff = Math.round((Date.now() - d.getTime()) / 1000);
      if (Math.abs(diff) < 60) return `${Math.abs(diff)}s ${diff >= 0 ? "ago" : "from now"}`;
      if (Math.abs(diff) < 3600) return `${Math.round(Math.abs(diff) / 60)}m ${diff >= 0 ? "ago" : "from now"}`;
      if (Math.abs(diff) < 86400) return `${Math.round(Math.abs(diff) / 3600)}h ${diff >= 0 ? "ago" : "from now"}`;
      return `${Math.round(Math.abs(diff) / 86400)}d ${diff >= 0 ? "ago" : "from now"}`;
    })(),
  };
}

export function UnixTimestampClient() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  }

  const parsedTs = (() => {
    if (!tsInput.trim()) return null;
    const n = Number(tsInput.trim());
    if (isNaN(n)) return { error: "Not a valid number" };
    const ms = n > 1e12 ? n : n * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return { error: "Timestamp out of range" };
    return { date: d, fmt: formatDate(d) };
  })();

  const parsedDate = (() => {
    if (!dateInput.trim()) return null;
    const d = new Date(dateInput.trim());
    if (isNaN(d.getTime())) return { error: "Could not parse date — try ISO 8601 format (e.g., 2024-06-15T10:30:00)" };
    const ts = Math.floor(d.getTime() / 1000);
    return { ts, tsMs: d.getTime() };
  })();

  const nowFmt = formatDate(new Date(now * 1000));

  return (
    <div className="space-y-6">
      {/* Live ticker */}
      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-medium text-muted-foreground">Current Unix timestamp</span>
          <button
            onClick={() => copy(String(now), "now")}
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            {copiedKey === "now" ? <Check size={13} weight="bold" /> : <Copy size={13} />}
            {copiedKey === "now" ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="font-mono text-[28px] font-bold tracking-tight text-foreground">{now}</div>
        <div className="mt-2 text-[12px] text-muted-foreground">{nowFmt.utc}</div>
      </div>

      {/* Timestamp → Date */}
      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="border-b border-black/6 px-4 py-3">
          <span className="text-[12px] font-semibold text-foreground">Timestamp → Human date</span>
        </div>
        <div className="p-4 space-y-3">
          <input
            type="text"
            inputMode="numeric"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="Enter Unix timestamp (seconds or ms)…"
            className="w-full rounded-xl border border-black/8 bg-neutral-50 px-3 py-2.5 font-mono text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          {parsedTs && (
            parsedTs.error ? (
              <p className="text-[13px] text-red-600">{parsedTs.error}</p>
            ) : (
              <div className="divide-y divide-black/5 rounded-xl border border-black/8 overflow-hidden">
                {([
                  ["UTC", parsedTs.fmt!.utc, "utc"],
                  ["Local", parsedTs.fmt!.local, "local"],
                  ["ISO 8601", parsedTs.fmt!.iso, "iso"],
                  ["Relative", parsedTs.fmt!.relative, "rel"],
                ] as const).map(([label, val, key]) => (
                  <div key={key} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="text-[11px] font-medium text-muted-foreground w-16 shrink-0">{label}</span>
                    <span className="text-[12px] text-foreground flex-1 font-mono break-all">{val}</span>
                    <button onClick={() => copy(val, key)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                      {copiedKey === key ? <Check size={13} weight="bold" /> : <Copy size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Date → Timestamp */}
      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="border-b border-black/6 px-4 py-3">
          <span className="text-[12px] font-semibold text-foreground">Human date → Timestamp</span>
        </div>
        <div className="p-4 space-y-3">
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="2024-06-15T10:30:00Z or Jun 15 2024…"
            className="w-full rounded-xl border border-black/8 bg-neutral-50 px-3 py-2.5 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          {parsedDate && (
            parsedDate.error ? (
              <p className="text-[13px] text-red-600">{parsedDate.error}</p>
            ) : (
              <div className="divide-y divide-black/5 rounded-xl border border-black/8 overflow-hidden">
                {([
                  ["Seconds", String(parsedDate.ts), "ds"],
                  ["Milliseconds", String(parsedDate.tsMs), "dms"],
                ] as const).map(([label, val, key]) => (
                  <div key={key} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <span className="text-[11px] font-medium text-muted-foreground w-24 shrink-0">{label}</span>
                    <span className="text-[14px] font-mono font-semibold text-foreground flex-1">{val}</span>
                    <button onClick={() => copy(val, key)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                      {copiedKey === key ? <Check size={13} weight="bold" /> : <Copy size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
