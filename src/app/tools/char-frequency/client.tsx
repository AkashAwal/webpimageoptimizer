"use client";

import { useState, useMemo } from "react";

export function CharFrequencyClient() {
  const [text, setText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [includeSpaces, setIncludeSpaces] = useState(false);
  const [sortMode, setSortMode] = useState<"freq" | "alpha">("freq");

  const { entries, totalChars } = useMemo(() => {
    const src = caseSensitive ? text : text.toLowerCase();
    const freq: Record<string, number> = {};
    for (const ch of src) {
      if (!includeSpaces && /\s/.test(ch)) continue;
      freq[ch] = (freq[ch] ?? 0) + 1;
    }
    const entries = Object.entries(freq);
    if (sortMode === "freq") entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    else entries.sort((a, b) => a[0].localeCompare(b[0]));
    const totalChars = entries.reduce((s, [, n]) => s + n, 0);
    return { entries, totalChars };
  }, [text, caseSensitive, includeSpaces, sortMode]);

  const maxCount = entries[0]?.[1] ?? 1;

  return (
    <div className="space-y-4">
      <textarea
        className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
        rows={6}
        placeholder="Paste or type your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex flex-wrap items-center gap-3 text-[13px]">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded"
          />
          Case sensitive
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeSpaces}
            onChange={(e) => setIncludeSpaces(e.target.checked)}
            className="rounded"
          />
          Include whitespace
        </label>
        <div className="ml-auto flex gap-1">
          {(["freq", "alpha"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSortMode(m)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                sortMode === m ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {m === "freq" ? "By frequency" : "Alphabetical"}
            </button>
          ))}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/6 px-4 py-3">
            <span className="text-[12px] font-medium text-muted-foreground">
              {entries.length} unique character{entries.length !== 1 ? "s" : ""} · {totalChars} total
            </span>
          </div>
          <div className="divide-y divide-black/5 max-h-[480px] overflow-y-auto">
            {entries.map(([char, count]) => {
              const pct = (count / totalChars) * 100;
              const barPct = (count / maxCount) * 100;
              return (
                <div key={char} className="flex items-center gap-3 px-4 py-2">
                  <span className="w-8 text-center font-mono text-[14px] font-semibold text-foreground shrink-0">
                    {char === " " ? "␣" : char === "\t" ? "⇥" : char === "\n" ? "↵" : char}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-foreground transition-all"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[12px] font-medium text-foreground w-8 text-right shrink-0">{count}</span>
                  <span className="text-[11px] text-muted-foreground w-12 text-right shrink-0">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {text.length > 0 && entries.length === 0 && (
        <p className="text-center text-[13px] text-muted-foreground py-8">
          No characters to count — try enabling &ldquo;Include whitespace&rdquo;.
        </p>
      )}
    </div>
  );
}
