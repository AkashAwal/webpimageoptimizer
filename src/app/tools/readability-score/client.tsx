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

function analyse(text: string) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const syllableCount = words.reduce((s, w) => s + countSyllables(w), 0);
  const charCount = text.replace(/\s/g, "").length;

  const asl = wordCount / sentences;
  const asw = syllableCount / wordCount;

  const fleschEase = 206.835 - 1.015 * asl - 84.6 * asw;
  const fleschGrade = 0.39 * asl + 11.8 * asw - 15.59;
  const colemanLiau = 0.0588 * (charCount / wordCount * 100) - 0.296 * (sentences / wordCount * 100) - 15.8;
  const gunningFog = 0.4 * (asl + (words.filter((w) => countSyllables(w) >= 3).length / wordCount) * 100);

  return {
    sentences,
    wordCount,
    syllableCount,
    fleschEase: Math.min(100, Math.max(0, fleschEase)),
    fleschGrade: Math.max(1, fleschGrade),
    colemanLiau: Math.max(1, colemanLiau),
    gunningFog: Math.max(1, gunningFog),
  };
}

function easeLabel(score: number) {
  if (score >= 90) return { label: "Very Easy", color: "text-emerald-600 bg-emerald-50" };
  if (score >= 70) return { label: "Easy", color: "text-blue-600 bg-blue-50" };
  if (score >= 60) return { label: "Standard", color: "text-indigo-600 bg-indigo-50" };
  if (score >= 50) return { label: "Fairly Difficult", color: "text-amber-600 bg-amber-50" };
  if (score >= 30) return { label: "Difficult", color: "text-orange-600 bg-orange-50" };
  return { label: "Very Confusing", color: "text-red-600 bg-red-50" };
}

export function ReadabilityScoreClient() {
  const [text, setText] = useState("");

  const stats = text.trim().length > 10 ? analyse(text) : null;
  const easeTag = stats ? easeLabel(stats.fleschEase) : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Paste your text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an article, essay, or any block of text here to analyse its readability..."
          className="h-48 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
        />
        {text && (
          <p className="text-[12px] text-muted-foreground">
            {stats?.wordCount.toLocaleString()} words · {stats?.sentences.toLocaleString()} sentences · {stats?.syllableCount.toLocaleString()} syllables
          </p>
        )}
      </div>

      {stats && easeTag && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-neutral-900 text-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-neutral-400">Flesch Reading Ease</span>
              <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${easeTag.color}`}>{easeTag.label}</span>
            </div>
            <div className="text-[48px] font-bold">{stats.fleschEase.toFixed(1)}</div>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${stats.fleschEase}%` }} />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">0 = Very Difficult · 100 = Very Easy</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Flesch-Kincaid Grade", val: stats.fleschGrade.toFixed(1), desc: "US school grade level" },
              { label: "Coleman-Liau Index", val: stats.colemanLiau.toFixed(1), desc: "Grade level by characters" },
              { label: "Gunning Fog Index", val: stats.gunningFog.toFixed(1), desc: "Years of education needed" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
                <p className="text-[11px] text-muted-foreground">{item.label}</p>
                <p className="text-[28px] font-bold text-foreground mt-1">{item.val}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
