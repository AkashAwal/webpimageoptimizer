"use client";

import { useState } from "react";

function mdToHtml(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^(?!<h[1-6]|<ul|<ol|<li|<blockquote|<pre|<hr)(.+)$/gm, "<p>$1</p>")
    .replace(/^---$/gm, "<hr>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/<p><\/p>/g, "")
    .trim();
}

function fmtBytes(n: number) {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;
}

export function MarkdownToHtmlClient() {
  const [md, setMd] = useState("");
  const [view, setView] = useState<"html" | "preview">("preview");
  const [copied, setCopied] = useState(false);

  const html = md ? mdToHtml(md) : "";

  const copy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Markdown</label>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            placeholder={"# Hello World\n\nThis is **bold** and *italic*.\n\n- List item one\n- List item two\n\n[Link text](https://example.com)"}
            className="h-80 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[13px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-sans"
          />
          <p className="text-[11px] text-muted-foreground">{fmtBytes(new TextEncoder().encode(md).length)}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {(["preview", "html"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`rounded-full px-3 py-0.5 text-[11px] font-medium transition-colors capitalize ${view === v ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
                >{v}</button>
              ))}
            </div>
            {html && (
              <button onClick={copy} className="rounded-full bg-neutral-100 px-3 py-0.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors">
                {copied ? "Copied!" : "Copy HTML"}
              </button>
            )}
          </div>

          {view === "html" ? (
            <textarea
              readOnly
              value={html}
              className="h-80 w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-foreground font-mono outline-none"
            />
          ) : (
            <div
              className="h-80 overflow-auto rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-[14px] text-foreground leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html || "<p class='text-neutral-400 text-sm'>Preview will appear here…</p>" }}
            />
          )}
          <p className="text-[11px] text-muted-foreground">{fmtBytes(new TextEncoder().encode(html).length)} HTML</p>
        </div>
      </div>
      <p className="text-[12px] text-muted-foreground">Supports headings, bold, italic, inline code, links, unordered lists, blockquotes, and horizontal rules. Complex Markdown extensions (tables, footnotes, task lists) are out of scope.</p>
    </div>
  );
}
