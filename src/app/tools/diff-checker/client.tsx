"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type DiffLine = { type: "add" | "remove" | "same"; text: string };

function diffLines(a: string, b: string): DiffLine[] {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const m = aLines.length;
  const n = bLines.length;

  // LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aLines[i - 1] === bLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: "same", text: aLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "add", text: bLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: "remove", text: aLines[i - 1] });
      i--;
    }
  }
  return result;
}

export function DiffCheckerClient() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  function compare() {
    setDiff(diffLines(original, modified));
  }

  const added = diff?.filter((d) => d.type === "add").length ?? 0;
  const removed = diff?.filter((d) => d.type === "remove").length ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">Original</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here…"
            rows={8}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">Modified</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here…"
            rows={8}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
          />
        </div>
      </div>

      <button
        onClick={compare}
        className="rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white hover:bg-foreground/90 transition-colors"
      >
        Compare
      </button>

      {diff !== null && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-[12px] font-medium">
            <span className="text-emerald-600">+ {added} line{added !== 1 ? "s" : ""} added</span>
            <span className="text-red-600">− {removed} line{removed !== 1 ? "s" : ""} removed</span>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-black/6 overflow-hidden shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
            {diff.length === 0 ? (
              <p className="px-5 py-4 text-[13px] text-muted-foreground">No differences found.</p>
            ) : (
              <div className="divide-y divide-black/5">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-5 py-1.5 font-mono text-[12px] leading-relaxed",
                      line.type === "add" && "bg-emerald-50 text-emerald-700",
                      line.type === "remove" && "bg-red-50 text-red-700",
                      line.type === "same" && "text-foreground"
                    )}
                  >
                    <span className="mr-3 text-[11px] select-none opacity-50">
                      {line.type === "add" ? "+" : line.type === "remove" ? "−" : " "}
                    </span>
                    {line.text || " "}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
