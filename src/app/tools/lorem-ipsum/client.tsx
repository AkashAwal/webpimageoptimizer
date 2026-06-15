"use client";

import { useState, useRef } from "react";
import { ArrowsClockwise, Copy, Check, Sparkle } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const LOREM_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
  "Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie dictum ultricies, lacus risus aliquet sem, eget egestas justo quam vel diam. Donec ligula leo, pulvinar eu, blandit in, condimentum at, diam. Nam arcu libero, nonummy eget, consectetuer id, vulputate a, magna.",
  "Fusce fermentum. Nullam varius nulla eget libero pharetra aliquet. Pellentesque viverra purus vel magna. Quisque lobortis neque eget elit dignissim, ut molestie nunc tincidunt. Morbi egestas nibh sed risus lacinia, eu tincidunt augue tincidunt.",
  "Integer in felis sed leo vestibulum volutpat. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.",
  "Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend.",
  "Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.",
  "Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer mollis hendrerit lorem, vel congue nisi feugiat id. Ut lacinia neque non augue dictum facilisis.",
  "Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.",
];

type Mode = "classic" | "ai";

export function LoremIpsumClient() {
  const [mode, setMode] = useState<Mode>("classic");
  const [paragraphs, setParagraphs] = useState(3);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState<string>(() =>
    LOREM_PARAGRAPHS.slice(0, 3).join("\n\n")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  function generateClassic(count: number) {
    const shuffled = [...LOREM_PARAGRAPHS].sort(() => Math.random() - 0.5);
    setOutput(shuffled.slice(0, count).join("\n\n"));
    setError(null);
  }

  async function generateAI() {
    if (!topic.trim()) { setError("Enter a topic first."); return; }
    if (loading) { abortRef.current?.abort(); return; }

    abortRef.current = new AbortController();
    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const res = await fetch("/api/lorem-ipsum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), paragraphs }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleGenerate() {
    if (mode === "classic") {
      generateClassic(paragraphs);
    } else {
      generateAI();
    }
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-1 rounded-full bg-neutral-100 p-1 w-fit">
        {(["classic", "ai"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
              mode === m
                ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {m === "ai" && <Sparkle size={13} />}
            {m === "classic" ? "Classic Lorem Ipsum" : "AI Topic Mode"}
          </button>
        ))}
      </div>

      {/* AI topic input */}
      {mode === "ai" && (
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1.5">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleGenerate(); }}
            placeholder="e.g. renewable energy, coffee brewing, space exploration"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
      )}

      {/* Paragraph count */}
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium text-muted-foreground w-24 shrink-0">
          Paragraphs: <strong className="text-foreground">{paragraphs}</strong>
        </span>
        <input
          type="range"
          min={1}
          max={10}
          value={paragraphs}
          onChange={(e) => setParagraphs(Number(e.target.value))}
          className="flex-1 accent-foreground"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-foreground/90 disabled:opacity-60"
      >
        <ArrowsClockwise size={13} className={loading ? "animate-spin" : ""} />
        {loading ? "Generating…" : "Generate"}
      </button>

      {/* Error */}
      {error && (
        <p className="text-[13px] text-red-500">{error}</p>
      )}

      {/* Output */}
      {output && (
        <div className="relative">
          <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="prose prose-sm max-w-none">
              {output.split("\n\n").filter(Boolean).map((para, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-muted-foreground mb-3 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>
          <button
            onClick={copyOutput}
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
