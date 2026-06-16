"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";

function toRegional(text: string): string {
  return text.toUpperCase().split("").map((c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCodePoint(0x1F1E6 + code - 65) + "​";
    }
    if (c === " ") return "  ";
    return c;
  }).join("");
}

function toClapBeat(text: string): string {
  return text.split(" ").join(" 👏 ");
}

function toSparkleWrap(text: string): string {
  return text.split(" ").map((w) => `✨ ${w} ✨`).join(" ");
}

function toFireMode(text: string): string {
  return text.split("").join(" 🔥 ");
}

const VARIANTS = [
  { id: "regional", label: "Regional Indicator", fn: toRegional },
  { id: "clap", label: "Clap Beat", fn: toClapBeat },
  { id: "sparkle", label: "Sparkle Wrap", fn: toSparkleWrap },
  { id: "fire", label: "Fire Mode", fn: toFireMode },
];

export function EmojiTextClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  function copy(id: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">Input text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text to convert to emoji styles…"
          rows={3}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      {input && (
        <div className="space-y-3">
          {VARIANTS.map(({ id, label, fn }) => {
            const output = fn(input);
            return (
              <div key={id} className="relative">
                <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
                  <p className="text-[11px] font-medium text-muted-foreground mb-2">{label}</p>
                  <p className="text-[14px] leading-relaxed text-foreground break-words pr-20">
                    {output}
                  </p>
                </div>
                <button
                  onClick={() => copy(id, output)}
                  className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
                >
                  {copied === id ? <Check size={12} weight="bold" /> : <Copy size={12} />}
                  {copied === id ? "Copied!" : "Copy"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
