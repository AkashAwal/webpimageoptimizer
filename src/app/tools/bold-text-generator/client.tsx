"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { FANCY_STYLES } from "@/lib/unicode-text";

const BOLD_STYLES = FANCY_STYLES.filter((s) =>
  ["bold", "boldItalic", "boldScript", "boldFraktur", "sansBold", "sansBoldItalic"].includes(s.id)
);

export function BoldTextClient() {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copy(id: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  const charCount = input.length;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Input text</label>
          <span className="text-[12px] text-muted-foreground">
            {wordCount} word{wordCount !== 1 ? "s" : ""} · {charCount} char{charCount !== 1 ? "s" : ""}
          </span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here…"
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {BOLD_STYLES.map((style) => {
          const preview = input ? style.convert(input) : style.convert(style.name);
          const isCopied = copiedId === style.id;
          return (
            <div
              key={style.id}
              className="relative rounded-2xl bg-white ring-1 ring-black/6 p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <p className="text-[11px] font-medium text-neutral-400 mb-1.5">{style.name}</p>
              <p className="text-[14px] leading-relaxed break-words pr-20 text-foreground">
                {preview}
              </p>
              <button
                onClick={() => copy(style.id, preview)}
                className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
              >
                {isCopied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
