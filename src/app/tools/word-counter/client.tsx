"use client";

import { useState } from "react";

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","is","was","are","were","be","been","being","have","has","had","do",
  "does","did","will","would","could","should","may","might","shall","can",
  "it","its","this","that","these","those","i","you","he","she","we","they",
  "my","your","his","her","our","their","me","him","us","them","what","which",
  "who","when","where","why","how","all","each","both","few","more","most",
  "other","some","such","no","not","only","same","so","than","too","very",
  "just","about","into","through","during","before","after","above","below",
  "between","out","off","over","under","again","then","once","s","t","don",
]);

interface Stats {
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
  topKeywords: { word: string; count: number }[];
}

function computeStats(text: string): Stats {
  const trimmed = text.trim();

  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;

  const sentences = trimmed
    ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
    : 0;

  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    : 0;

  const wpm_read = 200;
  const wpm_speak = 130;
  const wordCount = words.length;

  function formatTime(mins: number): string {
    if (mins < 1) return "< 1 min";
    const m = Math.floor(mins);
    const s = Math.round((mins - m) * 60);
    if (m === 0) return `${s}s`;
    if (s === 0) return `${m} min`;
    return `${m} min ${s}s`;
  }

  const readingTime = formatTime(wordCount / wpm_read);
  const speakingTime = formatTime(wordCount / wpm_speak);

  const freq: Record<string, number> = {};
  for (const word of words) {
    const clean = word.toLowerCase().replace(/[^a-z0-9']/g, "");
    if (clean.length < 3 || STOP_WORDS.has(clean)) continue;
    freq[clean] = (freq[clean] ?? 0) + 1;
  }

  const topKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return { words: wordCount, charsWithSpaces, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime, topKeywords };
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-black/6 p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-[22px] font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

export function WordCounterClient() {
  const [text, setText] = useState("");

  const stats = computeStats(text);

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={8}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Words" value={stats.words.toLocaleString()} />
        <StatCard label="Characters" value={stats.charsWithSpaces.toLocaleString()} />
        <StatCard label="No spaces" value={stats.charsNoSpaces.toLocaleString()} />
        <StatCard label="Sentences" value={stats.sentences.toLocaleString()} />
        <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
        <StatCard label="Reading time" value={stats.readingTime} />
        <StatCard label="Speaking time" value={stats.speakingTime} />
      </div>

      {stats.topKeywords.length > 0 && (
        <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Top Keywords</p>
          <div className="space-y-2">
            {stats.topKeywords.map(({ word, count }) => {
              const pct = Math.round((count / stats.words) * 100);
              return (
                <div key={word} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-[13px] font-medium text-foreground truncate">{word}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-foreground/70"
                      style={{ width: `${Math.max(4, pct * 5)}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-muted-foreground w-14 text-right shrink-0">
                    {count}× ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
