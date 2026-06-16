"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Sep = "none" | "space" | "newline" | "comma" | "custom";

const SEPARATORS: { id: Sep; label: string }[] = [
  { id: "none", label: "None" },
  { id: "space", label: "Space" },
  { id: "newline", label: "New Line" },
  { id: "comma", label: "Comma" },
  { id: "custom", label: "Custom" },
];

function getSep(sep: Sep, custom: string): string {
  if (sep === "none") return "";
  if (sep === "space") return " ";
  if (sep === "newline") return "\n";
  if (sep === "comma") return ", ";
  return custom;
}

export function TextRepeaterClient() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(3);
  const [sep, setSep] = useState<Sep>("newline");
  const [customSep, setCustomSep] = useState(" | ");
  const [copied, setCopied] = useState(false);

  const separator = getSep(sep, customSep);
  const output = input ? Array(count).fill(input).join(separator) : "";

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
        <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">Text to repeat</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter the text you want to repeat…"
          rows={3}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium text-muted-foreground w-24 shrink-0">
          Repeat: <strong className="text-foreground">{count}×</strong>
        </span>
        <input
          type="range"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="flex-1 accent-foreground"
        />
      </div>

      <div>
        <p className="text-[12px] font-medium text-muted-foreground mb-2">Separator</p>
        <div className="flex flex-wrap gap-2">
          {SEPARATORS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSep(id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ring-1",
                sep === id
                  ? "bg-foreground text-white ring-foreground"
                  : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {sep === "custom" && (
          <input
            type="text"
            value={customSep}
            onChange={(e) => setCustomSep(e.target.value)}
            placeholder="Enter separator…"
            className="mt-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 w-full sm:w-48"
          />
        )}
      </div>

      {output && (
        <div className="relative">
          <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] max-h-64 overflow-y-auto">
            <p className="text-[13px] leading-relaxed text-foreground break-words whitespace-pre-wrap pr-16">
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
