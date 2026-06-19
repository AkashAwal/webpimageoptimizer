"use client";

import { useState } from "react";

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function SyllableCounterClient() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const wordData = words.map((w) => ({ word: w, syllables: countSyllables(w) }));
  const total = wordData.reduce((s, w) => s + w.syllables, 0);
  const avg = words.length > 0 ? (total / words.length).toFixed(2) : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Enter text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here to count syllables..."
          className="h-36 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
        />
      </div>

      {words.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total syllables", val: total },
              { label: "Total words", val: words.length },
              { label: "Avg syllables/word", val: avg ?? "—" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
                <p className="text-[24px] font-bold text-foreground">{item.val}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {words.length <= 80 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
              <p className="text-[12px] font-medium text-muted-foreground mb-3">Word breakdown</p>
              <div className="flex flex-wrap gap-2">
                {wordData.map((w, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1">
                    <span className="text-[13px] text-foreground">{w.word}</span>
                    <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200 rounded-full px-1.5 py-0.5">
                      {w.syllables}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
