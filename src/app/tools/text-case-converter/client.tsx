"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant";

const CASES: { id: CaseType; label: string; example: string }[] = [
  { id: "upper",    label: "UPPERCASE",     example: "HELLO WORLD" },
  { id: "lower",    label: "lowercase",     example: "hello world" },
  { id: "title",    label: "Title Case",    example: "Hello World" },
  { id: "sentence", label: "Sentence case", example: "Hello world" },
  { id: "camel",    label: "camelCase",     example: "helloWorld" },
  { id: "pascal",   label: "PascalCase",    example: "HelloWorld" },
  { id: "snake",    label: "snake_case",    example: "hello_world" },
  { id: "kebab",    label: "kebab-case",    example: "hello-world" },
  { id: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
];

const SMALL_WORDS = new Set(["a","an","the","and","but","or","for","nor","on","at","to","by","in","of","up","as","is"]);

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function convert(text: string, type: CaseType): string {
  if (!text) return "";

  if (type === "upper") return text.toUpperCase();
  if (type === "lower") return text.toLowerCase();

  const words = toWords(text);

  if (type === "title") {
    return words.map((w, i) => {
      const lower = w.toLowerCase();
      if (i !== 0 && i !== words.length - 1 && SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join(" ");
  }

  if (type === "sentence") {
    const joined = words.map(w => w.toLowerCase()).join(" ");
    return joined.charAt(0).toUpperCase() + joined.slice(1);
  }

  if (type === "camel") {
    return words.map((w, i) => {
      const lower = w.toLowerCase();
      return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join("");
  }

  if (type === "pascal") {
    return words.map(w => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join("");
  }

  if (type === "snake") return words.map(w => w.toLowerCase()).join("_");
  if (type === "kebab") return words.map(w => w.toLowerCase()).join("-");
  if (type === "constant") return words.map(w => w.toUpperCase()).join("_");

  return text;
}

export function TextCaseConverterClient() {
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("title");
  const [copied, setCopied] = useState(false);

  const output = convert(input, activeCase);

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <div className="space-y-4">
      {/* Input */}
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

      {/* Case buttons */}
      <div className="flex flex-wrap gap-2">
        {CASES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCase(id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ring-1",
              activeCase === id
                ? "bg-foreground text-white ring-foreground"
                : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Output */}
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
