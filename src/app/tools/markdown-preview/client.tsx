"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escHtml(s)
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/`([^`]+)`/g, "<code class=\"rounded bg-neutral-100 px-1 py-0.5 text-[12px] font-mono\">$1</code>")
    .replace(/\[([^\]]*)\]\((https?:\/\/[^)]*)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>');
}

function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      out.push(`<pre class="bg-neutral-100 rounded-lg p-4 overflow-x-auto my-3"><code class="text-[12px] font-mono">${escHtml(code.join("\n"))}</code></pre>`);
      i++;
      continue;
    }

    // ATX headers
    const hm = line.match(/^(#{1,6})\s+(.*)/);
    if (hm) {
      const level = hm[1].length;
      const cls = ["text-2xl font-bold mt-5 mb-2", "text-xl font-bold mt-4 mb-1.5", "text-lg font-semibold mt-3 mb-1", "text-base font-semibold mt-2 mb-1", "text-sm font-semibold mt-2", "text-xs font-semibold mt-2"][level - 1];
      out.push(`<h${level} class="${cls}">${inline(hm[2])}</h${level}>`);
      i++; continue;
    }

    // HR
    if (/^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
      out.push('<hr class="border-neutral-200 my-4" />');
      i++; continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const inner: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        inner.push(lines[i].slice(2));
        i++;
      }
      out.push(`<blockquote class="border-l-4 border-neutral-300 pl-4 text-neutral-500 my-2">${inner.map(inline).join("<br />")}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].slice(2))}</li>`);
        i++;
      }
      out.push(`<ul class="list-disc pl-5 my-2 space-y-0.5">${items.join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\d+\.\s/, ""))}</li>`);
        i++;
      }
      out.push(`<ol class="list-decimal pl-5 my-2 space-y-0.5">${items.join("")}</ol>`);
      continue;
    }

    // Blank line → spacing
    if (!line.trim()) {
      out.push('<div class="h-2"></div>');
      i++; continue;
    }

    // Paragraph
    out.push(`<p class="leading-relaxed my-1">${inline(line)}</p>`);
    i++;
  }

  return out.join("\n");
}

const SAMPLE = `# Markdown Preview

Write **bold**, *italic*, or ~~strikethrough~~ text.

## Lists

- Apples
- Bananas
- Cherries

1. First item
2. Second item
3. Third item

## Code

Inline \`code\` and fenced blocks:

\`\`\`js
const greet = name => \`Hello, \${name}!\`;
console.log(greet("world"));
\`\`\`

> Blockquotes stand out like this.

---

[Visit Pix Garage](https://pixgarage.com)`;

export function MarkdownPreviewClient() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const html = parseMarkdown(input);

  function copy() {
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-muted-foreground">Markdown</label>
            <span className="text-[12px] text-muted-foreground">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-[480px] w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            placeholder={"# Hello\n\nType **Markdown** here..."}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-muted-foreground">Preview</label>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copied ? "Copied HTML" : "Copy HTML"}
            </button>
          </div>
          <div
            className="h-[480px] overflow-y-auto rounded-xl border border-black/10 bg-white px-5 py-4 text-[13px] text-foreground"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
