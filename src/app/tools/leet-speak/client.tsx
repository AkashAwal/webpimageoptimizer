"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Level = "basic" | "medium" | "extreme";

const LEVELS: { id: Level; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "medium", label: "Medium" },
  { id: "extreme", label: "Extreme" },
];

const BASIC: Record<string, string> = {
  a: "4", e: "3", i: "1", o: "0", s: "5", t: "7",
};

const MEDIUM: Record<string, string> = {
  ...BASIC,
  b: "8", g: "9", l: "1", z: "2",
};

const EXTREME: Record<string, string> = {
  ...MEDIUM,
  a: "@", s: "$", f: "ph", x: "><", v: "\\/",
};

function toLeet(text: string, level: Level): string {
  const map = level === "basic" ? BASIC : level === "medium" ? MEDIUM : EXTREME;
  return text
    .toLowerCase()
    .replace(/ck/g, level === "extreme" ? "xx" : "ck")
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
}

export function LeetSpeakClient() {
  const [input, setInput] = useState("");
  const [level, setLevel] = useState<Level>("basic");
  const [copied, setCopied] = useState(false);

  const output = toLeet(input, level);

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
          placeholder="Type or paste text to convert to leet speak…"
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      <div className="flex gap-2">
        {LEVELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setLevel(id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ring-1",
              level === id
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
            <p className="text-[13px] font-mono leading-relaxed text-foreground break-words whitespace-pre-wrap pr-20">
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
