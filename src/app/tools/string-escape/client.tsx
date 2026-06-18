"use client";

import { useState } from "react";

type Lang = "json" | "js" | "python" | "regex";

const ESCAPES: Record<Lang, { escape: (s: string) => string; unescape: (s: string) => string; label: string }> = {
  json: {
    label: "JSON",
    escape: (s) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/[\x00-\x1f]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")),
    unescape: (s) => {
      try { return JSON.parse(`"${s}"`); } catch { return s; }
    },
  },
  js: {
    label: "JavaScript",
    escape: (s) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t"),
    unescape: (s) =>
      s
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\`/g, "`")
        .replace(/\\\$/g, "$")
        .replace(/\\\\/g, "\\"),
  },
  python: {
    label: "Python",
    escape: (s) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t"),
    unescape: (s) =>
      s
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\"),
  },
  regex: {
    label: "Regex",
    escape: (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    unescape: (s) => s.replace(/\\([.*+?^${}()|[\]\\])/g, "$1"),
  },
};

export function StringEscapeClient() {
  const [lang, setLang] = useState<Lang>("json");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input ? ESCAPES[lang][mode](input) : "";

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1.5">
          {(Object.keys(ESCAPES) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                lang === l
                  ? "bg-foreground text-background"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {ESCAPES[l].label}
            </button>
          ))}
        </div>
        <div className="ml-2 flex gap-1.5">
          {(["escape", "unescape"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors capitalize ${
                mode === m
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {m === "escape" ? "Escape" : "Unescape"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "escape" ? 'Hello "World"\nNew line here' : 'Hello \\"World\\"\\nNew line here'}
            className="h-56 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 font-mono text-[13px] text-foreground outline-none focus:border-neutral-400 placeholder:text-neutral-400"
            spellCheck={false}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-muted-foreground">Output</label>
            {output && (
              <button
                onClick={copy}
                className="text-[12px] font-medium text-neutral-500 hover:text-foreground transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Escaped output appears here..."
            className="h-56 w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 font-mono text-[13px] text-foreground outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>
    </div>
  );
}
