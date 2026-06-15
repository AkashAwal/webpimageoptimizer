"use client";

import { useState, useCallback } from "react";
import { DownloadSimple } from "@/components/ui/icons";

// ── Phrase Databases ──────────────────────────────────────────────────────────

const EXACT_PHRASES = [
  "in conclusion", "in summary", "to summarize", "as mentioned above",
  "as stated above", "it is worth noting that", "it is important to note that",
  "it should be noted that", "research has shown that", "studies have shown that",
  "according to research", "according to studies", "a wide range of",
  "in today's world", "in the modern world", "in today's society",
  "in recent years", "over the years", "throughout history",
  "at the end of the day", "at this point in time", "in the near future",
  "in the long run", "in the short term", "on the contrary",
  "as a result of", "due to the fact that", "for the purpose of",
  "with the aim of", "with a view to", "it can be argued that",
  "it can be seen that", "it is clear that", "it is evident that",
  "it is obvious that", "there is no doubt that", "there is a need for",
  "needless to say", "it goes without saying", "it is worth mentioning",
  "as previously mentioned", "as discussed earlier", "first and foremost",
  "last but not least", "on a daily basis", "on a regular basis",
  "in a timely manner", "in an efficient manner", "take into account",
  "take into consideration", "shed light on", "play a key role",
  "plays an important role", "has a significant impact",
  "over the course of", "in the course of", "during the course of",
  "as we can see", "as shown above", "based on the above",
  "based on these findings", "the purpose of this paper",
  "this paper aims to", "this study aims to", "this article explores",
  "this essay discusses", "this report examines", "a number of factors",
  "a number of reasons", "generally speaking", "broadly speaking",
  "strictly speaking", "relatively speaking", "in other words",
  "that is to say", "to put it another way", "to put it simply",
  "simply put", "in essence", "in principle", "in practice",
  "as a matter of fact", "state of the art", "cutting edge technology",
  "best practices", "return on investment", "value proposition",
  "mission critical", "moving forward", "going forward", "paradigm shift",
  "think outside the box", "low hanging fruit", "game changer",
  "disruptive innovation", "pain points", "actionable insights",
  "by and large", "in the meantime", "in the aftermath", "in the wake of",
  "pave the way for", "set the stage for", "lay the groundwork",
  "bridge the gap", "meet the needs of", "address the issue",
  "tackle the challenge", "overcome the obstacles", "foster a culture of",
  "develop a strategy for", "it has been established",
  "evidence suggests that", "data indicates that",
  "the findings suggest that", "previous research has",
  "existing literature suggests", "a growing body of evidence",
  "empirical evidence suggests", "qualitative research indicates",
  "quantitative analysis shows", "it was concluded that",
  "the results demonstrate", "the data reveals that",
  "as previously discussed", "as outlined above", "as noted earlier",
  "in accordance with", "in compliance with", "in conjunction with",
  "with this in mind", "bearing this in mind", "given the above",
  "given these considerations", "to this end", "with this in mind",
  "it must be acknowledged", "one must consider", "one should note",
];

const PARTIAL_PHRASES = [
  "the ability to", "the need to", "the potential to",
  "the opportunity to", "the challenge of", "the impact of",
  "the role of", "the importance of", "the purpose of",
  "the benefits of", "the advantages of", "the disadvantages of",
  "the implications of", "the significance of", "the effectiveness of",
  "the quality of", "the level of", "the degree of",
  "the extent to which", "the way in which",
  "be considered as", "be regarded as", "be seen as",
  "be viewed as", "be used to", "be applied to",
  "is considered to", "was found to", "has been shown",
  "has been demonstrated", "has been established",
  "may be used", "can be used", "should be noted",
  "must be considered", "could be argued", "in order to",
  "with respect to", "with regard to", "in terms of",
  "in light of", "in view of", "despite the fact",
  "for the sake of", "as a consequence",
  "it is likely that", "it is possible that",
  "there is evidence", "this suggests that",
  "this indicates that", "this demonstrates that",
  "as a whole", "on the whole", "for the most part",
  "in general", "as such", "in this regard",
  "it follows that", "it can therefore", "it is therefore",
  "in this context", "in this sense", "in this case",
  "from this perspective", "in this respect",
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface SentenceResult {
  text: string;
  status: "unique" | "partial" | "flagged";
}

interface PlagiarismResult {
  exactMatchPercent: number;
  partialMatchPercent: number;
  uniquePercent: number;
  plagiarizedPercent: number;
  sentences: SentenceResult[];
  wordCount: number;
  sentenceCount: number;
}

// ── Algorithm ─────────────────────────────────────────────────────────────────

function classifySentence(sentence: string): "unique" | "partial" | "flagged" {
  const lower = sentence.toLowerCase();

  for (const phrase of EXACT_PHRASES) {
    if (lower.includes(phrase)) return "flagged";
  }

  let hits = 0;
  for (const phrase of PARTIAL_PHRASES) {
    if (lower.includes(phrase)) {
      hits++;
      if (hits >= 2) return "partial";
    }
  }
  if (hits === 1) return "partial";

  return "unique";
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .map((s) => s.replace(/\n/g, " ").trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 4);
}

function analyze(text: string): PlagiarismResult {
  const sentences = splitSentences(text);

  if (!sentences.length) {
    return {
      exactMatchPercent: 0, partialMatchPercent: 0,
      uniquePercent: 100, plagiarizedPercent: 0,
      sentences: [], wordCount: 0, sentenceCount: 0,
    };
  }

  const results: SentenceResult[] = sentences.map((text) => ({
    text,
    status: classifySentence(text),
  }));

  const total = results.length;
  const flaggedCount = results.filter((r) => r.status === "flagged").length;
  const partialCount = results.filter((r) => r.status === "partial").length;

  const exactMatchPercent = Math.round((flaggedCount / total) * 100);
  const partialMatchPercent = Math.round((partialCount / total) * 100);
  const plagiarizedPercent = Math.min(100, exactMatchPercent + partialMatchPercent);

  return {
    exactMatchPercent,
    partialMatchPercent,
    uniquePercent: 100 - plagiarizedPercent,
    plagiarizedPercent,
    sentences: results,
    wordCount: text.trim().split(/\s+/).filter(Boolean).length,
    sentenceCount: total,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CircularGauge({ percent, color }: { percent: number; color: string }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#f0f0f0" strokeWidth="7" />
      <circle
        cx="44" cy="44" r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 44 44)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function MetricBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[12px] font-medium text-foreground">{label}</span>
        </div>
        <span className="text-[12px] font-semibold text-foreground">{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function PlagiarismCheckerClient() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleCheck = useCallback(() => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult(analyze(text));
      setAnalyzing(false);
    }, 1000);
  }, [text]);

  const handleDownload = useCallback(async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const M = 20;
      const W = 210 - M * 2;
      let y = M;

      const line = (txt: string, opts: { size?: number; bold?: boolean; rgb?: [number, number, number]; indent?: number } = {}) => {
        const { size = 10, bold = false, rgb = [30, 30, 30], indent = 0 } = opts;
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(...rgb);
        doc.text(txt, M + indent, y);
        y += size * 0.45 + 2.5;
      };

      const rule = () => {
        doc.setDrawColor(220, 220, 220);
        doc.line(M, y, 210 - M, y);
        y += 5;
      };

      const newPageIfNeeded = () => {
        if (y > 268) { doc.addPage(); y = M; }
      };

      line("PLAGIARISM CHECK REPORT", { size: 18, bold: true });
      y += 1;
      line("Generated by Pix Garage — pixgarage.com", { size: 9, rgb: [120, 120, 120] });
      line(`Date: ${new Date().toLocaleString()}`, { size: 9, rgb: [120, 120, 120] });
      y += 3;
      rule();

      line("DOCUMENT SUMMARY", { size: 11, bold: true });
      y += 1;
      line(`Words analyzed: ${result.wordCount.toLocaleString()}`, { indent: 2 });
      line(`Sentences analyzed: ${result.sentenceCount}`, { indent: 2 });
      y += 3;
      rule();

      line("SIMILARITY METRICS", { size: 11, bold: true });
      y += 1;
      const pRgb: [number, number, number] = result.plagiarizedPercent > 20 ? [200, 50, 50] : [30, 30, 30];
      line(`Plagiarized Content: ${result.plagiarizedPercent}%`, { indent: 2, bold: true, rgb: pRgb });
      line(`  Exact Match: ${result.exactMatchPercent}%`, { size: 9, indent: 4, rgb: [150, 50, 50] });
      line(`  Partial Match: ${result.partialMatchPercent}%`, { size: 9, indent: 4, rgb: [180, 120, 40] });
      y += 2;
      line(`Unique Content: ${result.uniquePercent}%`, { indent: 2, bold: true, rgb: [40, 140, 80] });
      y += 3;
      rule();

      const flagged = result.sentences.filter((s) => s.status === "flagged");
      const partial = result.sentences.filter((s) => s.status === "partial");

      if (flagged.length > 0) {
        line("FLAGGED SENTENCES (EXACT MATCH)", { size: 11, bold: true, rgb: [180, 50, 50] });
        y += 1;
        flagged.forEach((s, i) => {
          newPageIfNeeded();
          const lines = doc.splitTextToSize(`${i + 1}. ${s.text}`, W - 4);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          doc.text(lines, M + 2, y);
          y += (lines as string[]).length * 5 + 3;
        });
        y += 2;
        rule();
      }

      if (partial.length > 0) {
        line("SUSPECTED SENTENCES (PARTIAL MATCH)", { size: 11, bold: true, rgb: [160, 110, 30] });
        y += 1;
        partial.forEach((s, i) => {
          newPageIfNeeded();
          const lines = doc.splitTextToSize(`${i + 1}. ${s.text}`, W - 4);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          doc.text(lines, M + 2, y);
          y += (lines as string[]).length * 5 + 3;
        });
        y += 2;
        rule();
      }

      newPageIfNeeded();
      line("This report was generated using local phrase-matching analysis.", { size: 8, rgb: [150, 150, 150] });
      line("Results are indicative and should be verified with additional sources.", { size: 8, rgb: [150, 150, 150] });

      doc.save("plagiarism-report.pdf");
    } finally {
      setDownloading(false);
    }
  }, [result]);

  const riskLabel =
    !result ? "" :
    result.plagiarizedPercent === 0 ? "No Risk Detected" :
    result.plagiarizedPercent < 15 ? "Low Risk Content" :
    result.plagiarizedPercent < 30 ? "Moderate Risk" :
    "High Risk Content";

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your content here to check for plagiarism…"
        rows={10}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] text-muted-foreground">
          {wordCount > 0 ? `${wordCount.toLocaleString()} words` : "No word limit"}
        </span>
        <button
          onClick={handleCheck}
          disabled={!text.trim() || analyzing}
          className="rounded-full bg-foreground px-5 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-foreground/85 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {analyzing ? "Analyzing…" : "Check Plagiarism"}
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Plagiarized */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <CircularGauge percent={result.plagiarizedPercent} color="#ef4444" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[15px] font-bold text-red-500">{result.plagiarizedPercent}%</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-bold leading-tight text-foreground">Plagiarized</p>
                  <p className="mb-3 text-[12px] text-muted-foreground">{riskLabel}</p>
                  <div className="space-y-2.5">
                    <MetricBar label="Exact Match" percent={result.exactMatchPercent} color="#ef4444" />
                    <MetricBar label="Partial Match" percent={result.partialMatchPercent} color="#f59e0b" />
                  </div>
                </div>
              </div>
            </div>

            {/* Unique */}
            <div className="rounded-2xl bg-white p-5 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <CircularGauge percent={result.uniquePercent} color="#10b981" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[15px] font-bold text-emerald-600">{result.uniquePercent}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[17px] font-bold leading-tight text-foreground">Unique</p>
                  <p className="mb-3 text-[12px] text-muted-foreground">Original Content</p>
                  <div className="space-y-1">
                    <p className="text-[12px] text-muted-foreground">{result.wordCount.toLocaleString()} words checked</p>
                    <p className="text-[12px] text-muted-foreground">{result.sentenceCount} sentences analyzed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download */}
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-foreground shadow-sm hover:bg-neutral-50 disabled:opacity-50 transition-all"
            >
              <DownloadSimple size={14} />
              {downloading ? "Generating…" : "Download Report"}
            </button>
          </div>

          {/* Highlighted Text */}
          {result.sentences.length > 0 && (
            <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Content Analysis
                </p>
                <div className="ml-auto flex items-center gap-3">
                  <Legend dot="bg-red-200" label="Flagged" />
                  <Legend dot="bg-amber-200" label="Suspected" />
                  <Legend dot="bg-emerald-200" label="Unique" />
                </div>
              </div>
              <p className="text-[13px] leading-8">
                {result.sentences.map((s, i) => (
                  <span
                    key={i}
                    className={
                      s.status === "flagged"
                        ? "rounded bg-red-100 px-0.5 text-red-800"
                        : s.status === "partial"
                        ? "rounded bg-amber-100 px-0.5 text-amber-800"
                        : "text-foreground"
                    }
                  >
                    {s.text}{" "}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block size-2.5 rounded-full ${dot}`} />
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
