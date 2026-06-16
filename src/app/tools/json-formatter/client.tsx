"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Mode = "pretty2" | "pretty4" | "minify";

const MODES: { id: Mode; label: string }[] = [
  { id: "pretty2", label: "Prettify (2 spaces)" },
  { id: "pretty4", label: "Prettify (4 spaces)" },
  { id: "minify", label: "Minify" },
];

export function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("pretty2");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function format(m: Mode = mode) {
    if (!input.trim()) { setOutput(""); setError(""); return; }
    try {
      const parsed = JSON.parse(input);
      if (m === "minify") {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput(JSON.stringify(parsed, null, m === "pretty2" ? 2 : 4));
      }
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  function handleMode(m: Mode) {
    setMode(m);
    format(m);
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">JSON input</label>
          <span className="text-[12px] text-muted-foreground">{input.length} chars</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
          placeholder='{"name": "example", "value": 42}'
          rows={6}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 resize-y",
            error
              ? "border-red-300 focus:ring-red-200"
              : "border-black/10 focus:ring-foreground/20"
          )}
        />
        {error && (
          <p className="mt-1.5 text-[12px] text-red-600">{error}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleMode(id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ring-1",
              mode === id
                ? "bg-foreground text-white ring-foreground"
                : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {output && (
        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Output</label>
            <span className="text-[12px] text-muted-foreground">{output.length} chars</span>
          </div>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              rows={8}
              className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-[13px] font-mono text-foreground focus:outline-none resize-y"
            />
            <button
              onClick={copy}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
