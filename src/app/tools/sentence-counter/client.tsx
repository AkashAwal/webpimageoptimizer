"use client";

import { useState } from "react";

export function SentenceCounterClient() {
  const [text, setText] = useState("");

  const sentences = text.trim()
    ? text.split(/(?<=[.!?])\s+(?=[A-Z"'])|(?<=[.!?])$/).filter((s) => s.trim().length > 1)
    : [];

  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const paragraphs = text.trim() ? text.split(/\n{2,}/).filter((p) => p.trim()) : [];
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;

  const wordCounts = sentences.map((s) => s.trim().split(/\s+/).filter(Boolean).length);
  const avgWords = wordCounts.length > 0 ? (wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length).toFixed(1) : null;
  const longest = wordCounts.length > 0 ? Math.max(...wordCounts) : null;
  const shortest = wordCounts.length > 0 ? Math.min(...wordCounts) : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Enter text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to count sentences, words, characters, and paragraphs..."
          className="h-48 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
        />
      </div>

      {text.trim() && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Sentences", val: sentences.length },
              { label: "Words", val: words.length },
              { label: "Paragraphs", val: paragraphs.length },
              { label: "Characters", val: chars },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] text-center">
                <p className="text-[26px] font-bold text-foreground">{item.val.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {sentences.length > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[18px] font-bold text-foreground">{avgWords}</p>
                  <p className="text-[11px] text-muted-foreground">avg words/sentence</p>
                </div>
                <div>
                  <p className="text-[18px] font-bold text-foreground">{longest}</p>
                  <p className="text-[11px] text-muted-foreground">longest sentence (words)</p>
                </div>
                <div>
                  <p className="text-[18px] font-bold text-foreground">{shortest}</p>
                  <p className="text-[11px] text-muted-foreground">shortest sentence (words)</p>
                </div>
              </div>
              <div className="mt-3 border-t border-neutral-100 pt-3 text-[12px] text-muted-foreground text-center">
                {charsNoSpaces.toLocaleString()} characters (no spaces)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
