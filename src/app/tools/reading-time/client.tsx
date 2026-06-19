"use client";

import { useState } from "react";

const SPEEDS = [
  { label: "Slow reader", wpm: 150, desc: "~150 wpm" },
  { label: "Average", wpm: 238, desc: "~238 wpm" },
  { label: "Fast reader", wpm: 350, desc: "~350 wpm" },
  { label: "Speed reader", wpm: 700, desc: "~700 wpm" },
];

function fmtTime(minutes: number): string {
  if (minutes < 1) return `${Math.round(minutes * 60)} seconds`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} minute${m !== 1 ? "s" : ""}`;
  return `${h}h ${m}m`;
}

export function ReadingTimeClient() {
  const [mode, setMode] = useState<"text" | "count">("text");
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState("");

  const words = mode === "text"
    ? (text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0)
    : (parseInt(wordCount) || 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("text")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "text" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
        >Paste text</button>
        <button onClick={() => setMode("count")}
          className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${mode === "count" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
        >Enter word count</button>
      </div>

      {mode === "text" ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="h-40 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
        />
      ) : (
        <input
          type="number"
          value={wordCount}
          onChange={(e) => setWordCount(e.target.value)}
          placeholder="e.g. 1500"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[16px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
        />
      )}

      {words > 0 && (
        <div className="space-y-3">
          <p className="text-[12px] text-muted-foreground">{words.toLocaleString()} words</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SPEEDS.map((s) => (
              <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
                <p className="text-[18px] font-bold text-foreground">{fmtTime(words / s.wpm)}</p>
                <p className="text-[11px] font-medium text-foreground mt-1">{s.label}</p>
                <p className="text-[11px] text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-[12px] text-muted-foreground">
            Reference lengths: blog post ≈ 800–1,200 words · news article ≈ 400–800 · short story ≈ 1,500–7,500 · novel ≈ 80,000+
          </div>
        </div>
      )}
    </div>
  );
}
