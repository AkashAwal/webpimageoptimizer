"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const ALL_FLAGS = [
  { f: "g", label: "g", title: "Global — find all matches" },
  { f: "i", label: "i", title: "Case insensitive" },
  { f: "m", label: "m", title: "Multiline — ^ and $ match line boundaries" },
  { f: "s", label: "s", title: "Dot-all — . matches newlines" },
  { f: "u", label: "u", title: "Unicode — full Unicode support" },
];

interface RegexMatch {
  index: number;
  end: number;
  value: string;
  groups: (string | undefined)[];
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function RegexTesterClient() {
  const [pattern, setPattern] = useState("(\\w+)");
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set(["g"]));
  const [testStr, setTestStr] = useState("Hello world! Testing 123 regex patterns here.");

  const flagStr = ALL_FLAGS.map((f) => f.f).filter((f) => activeFlags.has(f)).join("");

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: null, highlighted: escHtml(testStr) };
    try {
      // Always add g internally so exec loop works; honour user's g choice for result count
      const hasG = activeFlags.has("g");
      const internalFlags = activeFlags.has("g") ? flagStr : flagStr + "g";
      const re = new RegExp(pattern, internalFlags);
      const matches: RegexMatch[] = [];
      let m: RegExpExecArray | null;
      let guard = 0;
      while ((m = re.exec(testStr)) !== null && guard++ < 500) {
        matches.push({ index: m.index, end: m.index + m[0].length, value: m[0], groups: m.slice(1) });
        if (!hasG) break;
        if (m[0].length === 0) re.lastIndex++; // prevent infinite loop on zero-width matches
      }

      // Build highlighted HTML
      const esc = escHtml;
      let html = "";
      let last = 0;
      for (const match of matches) {
        html += esc(testStr.slice(last, match.index));
        html += `<mark class="bg-yellow-200 rounded-sm">${esc(match.value || " ")}</mark>`;
        last = match.end;
      }
      html += esc(testStr.slice(last));

      return { matches, error: null, highlighted: html };
    } catch (e) {
      return { matches: [], error: (e as Error).message, highlighted: escHtml(testStr) };
    }
  }, [pattern, flagStr, activeFlags, testStr]);

  function toggleFlag(f: string) {
    setActiveFlags((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      {/* Pattern + flags */}
      <div className="space-y-3">
        <div>
          <label className="text-[12px] font-medium text-muted-foreground">Regular expression</label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[15px] text-neutral-400">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              className={cn(
                "w-full rounded-xl border px-7 py-2.5 font-mono text-[14px] text-foreground focus:outline-none focus:ring-2",
                result.error
                  ? "border-red-300 bg-red-50 focus:ring-red-200"
                  : "border-black/10 bg-white focus:ring-foreground/20"
              )}
              placeholder="(\w+)"
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[15px] text-neutral-400">
              /{flagStr}
            </span>
          </div>
          {result.error && (
            <p className="mt-1.5 text-[12px] text-red-600">{result.error}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-medium text-muted-foreground">Flags:</span>
          {ALL_FLAGS.map(({ f, label, title }) => (
            <button
              key={f}
              onClick={() => toggleFlag(f)}
              title={title}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[13px] font-medium ring-1 transition-colors",
                activeFlags.has(f)
                  ? "bg-foreground text-white ring-foreground"
                  : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Test string */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Test string</label>
          {!result.error && (
            <span className={cn("text-[12px] font-medium", result.matches.length > 0 ? "text-emerald-600" : "text-neutral-400")}>
              {result.matches.length} match{result.matches.length !== 1 ? "es" : ""}
            </span>
          )}
        </div>
        <textarea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-mono text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      {/* Highlighted output */}
      {result.matches.length > 0 && (
        <div>
          <label className="text-[12px] font-medium text-muted-foreground">Highlighted matches</label>
          <div
            className="mt-1.5 min-h-[60px] rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: result.highlighted }}
          />
        </div>
      )}

      {/* Match list */}
      {result.matches.length > 0 && (
        <div>
          <label className="text-[12px] font-medium text-muted-foreground">
            Matches {result.matches.length > 50 ? `(showing first 50 of ${result.matches.length})` : ""}
          </label>
          <div className="mt-1.5 space-y-2">
            {result.matches.slice(0, 50).map((m, idx) => (
              <div key={idx} className="flex flex-wrap items-start gap-3 rounded-xl border border-black/10 bg-white px-4 py-2.5">
                <span className="text-[12px] text-neutral-400 shrink-0">#{idx + 1}</span>
                <code className="flex-1 text-[12px] font-mono">
                  <mark className="rounded bg-yellow-200 px-0.5">{m.value}</mark>
                </code>
                <span className="text-[11px] text-neutral-400 shrink-0">
                  {m.index}–{m.end}
                </span>
                {m.groups.length > 0 && (
                  <div className="w-full flex flex-wrap gap-x-4 gap-y-0.5 pl-6">
                    {m.groups.map((g, gi) => (
                      <span key={gi} className="text-[11px] text-neutral-500">
                        Group {gi + 1}:{" "}
                        <code className="text-foreground">{g ?? "undefined"}</code>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
