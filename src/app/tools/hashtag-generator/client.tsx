"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const STOPWORDS = new Set([
  "a","an","the","and","but","or","for","nor","on","at","to","by","in","of","up","as","is",
  "are","was","were","be","been","being","have","has","had","do","does","did","will","would",
  "could","should","may","might","shall","can","need","dare","ought","used","that","this",
  "these","those","it","its","i","me","my","we","our","you","your","he","she","they","them",
  "his","her","their","with","from","about","into","through","during","before","after","above",
  "below","between","each","few","more","most","other","some","such","than","then","there",
  "when","where","which","who","whom","why","how","all","both","each","either","neither",
  "not","only","own","same","so","too","very","just","because","if","while","although",
]);

const CATEGORIES: Record<string, string[]> = {
  Fitness: ["#fitness","#workout","#gym","#fitlife","#health","#bodybuilding","#motivation","#exercise","#fitnessmotivation","#training"],
  Food: ["#food","#foodie","#instafood","#yummy","#delicious","#foodphotography","#cooking","#recipe","#foodlover","#homemade"],
  Travel: ["#travel","#wanderlust","#adventure","#explore","#travelgram","#vacation","#travelphotography","#holiday","#trip","#instatravel"],
  Fashion: ["#fashion","#style","#ootd","#outfit","#clothing","#fashionista","#streetstyle","#instafashion","#lookoftheday","#trendy"],
  Tech: ["#tech","#technology","#coding","#programming","#developer","#software","#innovation","#ai","#gadgets","#startup"],
  Gaming: ["#gaming","#gamer","#videogames","#games","#twitch","#esports","#playstation","#xbox","#nintendo","#gamingcommunity"],
  Photography: ["#photography","#photo","#photographer","#photooftheday","#picoftheday","#camera","#portrait","#landscape","#macro","#naturephotography"],
  Business: ["#business","#entrepreneur","#marketing","#success","#startup","#hustle","#branding","#leadership","#growth","#smallbusiness"],
};

export function HashtagGeneratorClient() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const generated = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .map((w) => `#${w}`);

  const allTags = [...new Set([...generated, ...Array.from(selected)])];

  function togglePreset(tag: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function addCategory(tags: string[]) {
    setSelected((prev) => {
      const next = new Set(prev);
      tags.forEach((t) => next.add(t));
      return next;
    });
  }

  function copyTag(tag: string) {
    navigator.clipboard.writeText(tag).then(() => {
      setCopiedTag(tag);
      setTimeout(() => setCopiedTag(null), 1500);
    });
  }

  function copyAll() {
    if (!allTags.length) return;
    navigator.clipboard.writeText(allTags.join(" ")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">
          Describe your post or topic
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. morning workout at the gym, healthy breakfast…"
          rows={3}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      {/* Category presets */}
      <div>
        <p className="text-[12px] font-medium text-muted-foreground mb-2">Quick-add category tags</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([cat, tags]) => (
            <button
              key={cat}
              onClick={() => addCategory(tags)}
              className="rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ring-1 bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {allTags.length > 0 && (
        <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium text-muted-foreground">{allTags.length} hashtags</span>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy All"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => copyTag(tag)}
                className={cn(
                  "rounded-full px-3 py-1 text-[12px] font-medium transition-colors ring-1",
                  copiedTag === tag
                    ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                    : "bg-neutral-100 text-neutral-700 ring-black/5 hover:bg-neutral-200"
                )}
              >
                {copiedTag === tag ? "Copied!" : tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preset tags */}
      {Object.entries(CATEGORIES).map(([cat, tags]) => (
        <div key={cat}>
          <p className="text-[12px] font-medium text-muted-foreground mb-2">{cat}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => togglePreset(tag)}
                className={cn(
                  "rounded-full px-3 py-1 text-[12px] font-medium transition-colors ring-1",
                  selected.has(tag)
                    ? "bg-foreground text-white ring-foreground"
                    : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
