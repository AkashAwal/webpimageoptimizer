"use client";

import { useState, useCallback } from "react";

function parseYaml(yaml: string): unknown {
  const lines = yaml.split("\n");
  const root: Record<string, unknown> = {};
  const stack: Array<{ obj: Record<string, unknown> | unknown[]; indent: number; key?: string }> = [
    { obj: root, indent: -1 },
  ];

  function setVal(key: string, val: unknown, parent: Record<string, unknown> | unknown[]) {
    if (Array.isArray(parent)) {
      parent.push(val);
    } else {
      parent[key] = val;
    }
  }

  function parseScalar(s: string): unknown {
    const t = s.trim();
    if (t === "true" || t === "yes") return true;
    if (t === "false" || t === "no") return false;
    if (t === "null" || t === "~" || t === "") return null;
    if (/^-?\d+$/.test(t)) return parseInt(t, 10);
    if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      return t.slice(1, -1);
    }
    return t;
  }

  for (const rawLine of lines) {
    if (rawLine.trim() === "" || rawLine.trim().startsWith("#")) continue;
    const indent = rawLine.search(/\S/);
    const line = rawLine.trim();

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].obj;

    if (line.startsWith("- ")) {
      const val = parseScalar(line.slice(2));
      if (Array.isArray(parent)) {
        parent.push(val);
      } else {
        const lastKey = Object.keys(parent as Record<string, unknown>).pop();
        if (lastKey !== undefined) {
          const existing = (parent as Record<string, unknown>)[lastKey];
          if (!Array.isArray(existing)) {
            (parent as Record<string, unknown>)[lastKey] = [val];
          } else {
            (existing as unknown[]).push(val);
          }
        }
      }
    } else if (line.includes(": ") || line.endsWith(":")) {
      const colonIdx = line.indexOf(": ");
      const key = colonIdx >= 0 ? line.slice(0, colonIdx).trim() : line.slice(0, -1).trim();
      const raw = colonIdx >= 0 ? line.slice(colonIdx + 2).trim() : "";
      if (raw === "" || raw === "{}" || raw === "[]") {
        const newObj: Record<string, unknown> = {};
        setVal(key, newObj, parent);
        stack.push({ obj: newObj, indent, key });
      } else {
        setVal(key, parseScalar(raw), parent);
      }
    }
  }

  return root;
}

function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null) return "null";
  if (typeof obj === "boolean") return obj ? "true" : "false";
  if (typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    if (/[:#\[\]{},|>&*!'"@`]/.test(obj) || obj.includes("\n")) {
      return `"${obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => `${pad}- ${jsonToYaml(item, indent + 1).trimStart()}`).join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([k, v]) => {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
        }
        if (Array.isArray(v)) {
          return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
        }
        return `${pad}${k}: ${jsonToYaml(v, indent + 1)}`;
      })
      .join("\n");
  }
  return String(obj);
}

export function YamlToJsonClient() {
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(
    (text: string, currentMode: typeof mode) => {
      setError("");
      if (!text.trim()) { setOutput(""); return; }
      try {
        if (currentMode === "yaml-to-json") {
          const parsed = parseYaml(text);
          setOutput(JSON.stringify(parsed, null, 2));
        } else {
          const parsed = JSON.parse(text);
          setOutput(jsonToYaml(parsed));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Invalid input");
        setOutput("");
      }
    },
    []
  );

  const handleInput = (val: string) => {
    setInput(val);
    convert(val, mode);
  };

  const handleMode = (m: typeof mode) => {
    setMode(m);
    convert(input, m);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["yaml-to-json", "json-to-yaml"] as const).map((m) => (
          <button
            key={m}
            onClick={() => handleMode(m)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              mode === m
                ? "bg-foreground text-background"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {m === "yaml-to-json" ? "YAML → JSON" : "JSON → YAML"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">
            {mode === "yaml-to-json" ? "YAML input" : "JSON input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={mode === "yaml-to-json" ? "name: Alice\nage: 30\ntags:\n  - dev\n  - cloud" : '{\n  "name": "Alice",\n  "age": 30\n}'}
            className="h-64 w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 font-mono text-[12px] text-foreground outline-none focus:border-neutral-400 placeholder:text-neutral-400"
            spellCheck={false}
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-muted-foreground">
              {mode === "yaml-to-json" ? "JSON output" : "YAML output"}
            </label>
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
            placeholder="Output appears here..."
            className={`h-64 w-full resize-none rounded-xl border bg-neutral-50 px-3 py-2.5 font-mono text-[12px] outline-none ${
              error ? "border-red-200 text-red-600" : "border-neutral-200 text-foreground"
            } placeholder:text-neutral-400`}
          />
        </div>
      </div>

      {mode === "yaml-to-json" && (
        <p className="text-[12px] text-muted-foreground">
          Supports standard YAML config-file syntax: key-value pairs, nested objects, and simple arrays. Complex YAML features (anchors, aliases, multi-line blocks) are not supported.
        </p>
      )}
    </div>
  );
}
