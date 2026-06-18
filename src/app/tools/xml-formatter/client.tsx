"use client";

import { useState } from "react";

function formatXml(xml: string, indent: number): string {
  const INDENT = " ".repeat(indent);
  let result = "";
  let depth = 0;
  let i = 0;

  const text = xml.replace(/>\s+</g, "><").trim();

  while (i < text.length) {
    if (text[i] === "<") {
      const end = text.indexOf(">", i);
      if (end === -1) throw new Error("Unclosed tag");
      const tag = text.slice(i, end + 1);

      if (tag.startsWith("</")) {
        depth--;
        result += INDENT.repeat(Math.max(0, depth)) + tag + "\n";
      } else if (tag.endsWith("/>") || tag.startsWith("<?") || tag.startsWith("<!")) {
        result += INDENT.repeat(depth) + tag + "\n";
      } else {
        result += INDENT.repeat(depth) + tag + "\n";
        depth++;
      }
      i = end + 1;
    } else {
      const nextTag = text.indexOf("<", i);
      const content = nextTag >= 0 ? text.slice(i, nextTag) : text.slice(i);
      if (content.trim()) {
        depth--;
        result = result.slice(0, result.lastIndexOf("\n", result.length - 2) + 1);
        const lastLine = result.slice(result.lastIndexOf("\n", result.length - 2) + 1).trimEnd();
        result = result.slice(0, result.length - lastLine.length - 1);
        result += lastLine + content.trim();
        if (nextTag >= 0 && text[nextTag + 1] === "/") {
          const endTagEnd = text.indexOf(">", nextTag);
          const endTag = text.slice(nextTag, endTagEnd + 1);
          result += endTag + "\n";
          depth++;
          i = endTagEnd + 1;
          continue;
        }
        depth++;
      }
      i = nextTag >= 0 ? nextTag : text.length;
    }
  }
  return result.trimEnd();
}

function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
}

export function XmlFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [copied, setCopied] = useState(false);

  const process = (text: string, m: typeof mode, ind: number) => {
    setError("");
    if (!text.trim()) { setOutput(""); return; }
    try {
      if (m === "minify") {
        setOutput(minifyXml(text));
      } else {
        setOutput(formatXml(text, ind));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid XML");
      setOutput("");
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    process(val, mode, indent);
  };

  const handleMode = (m: typeof mode) => {
    setMode(m);
    process(input, m, indent);
  };

  const handleIndent = (ind: number) => {
    setIndent(ind);
    process(input, mode, ind);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {(["format", "minify"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleMode(m)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors capitalize ${
                mode === m
                  ? "bg-foreground text-background"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {m === "format" ? "Prettify" : "Minify"}
            </button>
          ))}
        </div>
        {mode === "format" && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-muted-foreground">Indent:</span>
            {[2, 4].map((n) => (
              <button
                key={n}
                onClick={() => handleIndent(n)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  indent === n
                    ? "bg-foreground text-background"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {n} spaces
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">XML input</label>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={"<root><item id=\"1\"><name>Alice</name></item></root>"}
            className="h-72 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 font-mono text-[12px] text-foreground outline-none focus:border-neutral-400 placeholder:text-neutral-400"
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
            value={error ? `Error: ${error}` : output}
            placeholder="Formatted XML appears here..."
            className={`h-72 w-full resize-none rounded-xl border bg-neutral-50 px-3 py-2.5 font-mono text-[12px] outline-none ${
              error ? "border-red-200 text-red-600" : "border-neutral-200 text-foreground"
            } placeholder:text-neutral-400`}
          />
        </div>
      </div>
    </div>
  );
}
