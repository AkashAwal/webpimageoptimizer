"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Mode = "encode" | "decode";

export function UrlEncoderClient() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";

  if (input) {
    if (mode === "encode") {
      output = encodeURIComponent(input);
    } else {
      try {
        output = decodeURIComponent(input);
      } catch {
        error = "Invalid percent-encoded string.";
      }
    }
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
      <div className="flex gap-2">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ring-1 capitalize",
              mode === m
                ? "bg-foreground text-white ring-foreground"
                : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div>
        <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">
          {mode === "encode" ? "Text or URL to encode" : "Percent-encoded string to decode"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "https://example.com/path?q=hello world" : "https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello%20world"}
          rows={4}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 resize-y",
            error ? "border-red-300 focus:ring-red-200" : "border-black/10 focus:ring-foreground/20"
          )}
        />
        {error && <p className="mt-1.5 text-[12px] text-red-600">{error}</p>}
      </div>

      {output && !error && (
        <div className="relative">
          <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">
            {mode === "encode" ? "Encoded output" : "Decoded output"}
          </label>
          <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
            <p className="text-[13px] font-mono leading-relaxed text-foreground break-all pr-20">
              {output}
            </p>
          </div>
          <button
            onClick={copy}
            className="absolute top-8 right-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
          >
            {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
