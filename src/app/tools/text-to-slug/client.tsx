"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "@/components/ui/icons";

function toSlug(text: string, separator: string, maxLength: number): string {
  let s = text.normalize("NFD").replace(/[̀-ͯ]/g, ""); // strip accents
  s = s.toLowerCase();
  s = s.replace(/[^a-z0-9\s-_]/g, ""); // remove non-alphanumeric
  s = s.replace(/[\s-_]+/g, separator); // collapse whitespace/separators
  s = s.replace(new RegExp(`^[${separator}]+|[${separator}]+$`, "g"), ""); // trim
  if (maxLength > 0) s = s.slice(0, maxLength).replace(new RegExp(`[${separator}]+$`), "");
  return s;
}

export function TextToSlugClient() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState("-");
  const [maxLength, setMaxLength] = useState(0);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => toSlug(text, separator, maxLength), [text, separator, maxLength]);

  function copy() {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
        rows={3}
        placeholder="My Article Title — With Accents & Special Chars!"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex flex-wrap items-center gap-4 text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Separator</span>
          <div className="flex gap-1">
            {[
              { value: "-", label: "Hyphen  (–)" },
              { value: "_", label: "Underscore (_)" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSeparator(value)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  separator === value ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-muted-foreground font-medium">Max length</span>
          <input
            type="number"
            min={0}
            max={500}
            value={maxLength || ""}
            onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
            placeholder="∞"
            className="w-16 rounded-xl border border-black/8 bg-white px-2 py-1 text-[12px] text-center focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between border-b border-black/6 px-4 py-3">
          <span className="text-[12px] font-medium text-muted-foreground">
            Slug · {slug.length} characters
          </span>
          <button
            onClick={copy}
            disabled={!slug}
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-40 transition-colors"
          >
            {copied ? <Check size={13} weight="bold" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="px-4 py-4 min-h-[56px] font-mono text-[14px] text-foreground break-all">
          {slug || <span className="text-muted-foreground">slug will appear here…</span>}
        </div>
      </div>

      {text.length > 0 && !slug && (
        <p className="text-[13px] text-amber-600">
          All characters were removed — the text may contain only symbols or non-ASCII characters.
        </p>
      )}
    </div>
  );
}
