"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Mode = "chars" | "words" | "lines";

const MODES: { id: Mode; label: string }[] = [
  { id: "chars", label: "Reverse Characters" },
  { id: "words", label: "Reverse Words" },
  { id: "lines", label: "Reverse Lines" },
];

function reverse(text: string, mode: Mode): string {
  if (!text) return "";
  if (mode === "chars") return text.split("").reverse().join("");
  if (mode === "words") return text.split(/\s+/).reverse().join(" ");
  if (mode === "lines") return text.split("\n").reverse().join("\n");
  return text;
}

export function ReverseTextClient() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("chars");
  const [copied, setCopied] = useState(false);

  const output = reverse(input, mode);

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
        <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">Input text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to reverse…"
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {MODES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
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
          <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] min-h-[80px]">
            <p className="text-[13px] leading-relaxed text-foreground break-words whitespace-pre-wrap pr-20">
              {output}
            </p>
          </div>
          <button
            onClick={copy}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
          >
            {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
