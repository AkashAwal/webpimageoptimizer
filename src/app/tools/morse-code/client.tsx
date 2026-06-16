"use client";

import { useState, useRef } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Mode = "text-to-morse" | "morse-to-text";

const MORSE: Record<string, string> = {
  A:".-", B:"-...", C:"-.-.", D:"-..", E:".", F:"..-.", G:"--.", H:"....",
  I:"..", J:".---", K:"-.-", L:".-..", M:"--", N:"-.", O:"---", P:".--.",
  Q:"--.-", R:".-.", S:"...", T:"-", U:"..-", V:"...-", W:".--", X:"-..-",
  Y:"-.--", Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
  "6":"-....","7":"--...","8":"---..","9":"----.",
  ".":".-.-.-",",":"--..--","?":"..--..","'":".----.",
  "!":"-.-.--","/":"-..-.",":":"---...",";":"-.-.-.","=":"-...-",
  "+":".-.-.","-":"-....-","_":"..--.-","\"":".-..-.","$":"...-..-",
  "&":".-...","@":".--.-.","(":"-.--.",")":"-.--.-",
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);

function textToMorse(text: string): string {
  return text.toUpperCase().split("").map((c) => {
    if (c === " ") return "/";
    return MORSE[c] ?? "?";
  }).join(" ");
}

function morseToText(morse: string): string {
  return morse.split(" / ").map((word) =>
    word.split(" ").map((code) => REVERSE_MORSE[code] ?? "?").join("")
  ).join(" ");
}

export function MorseCodeClient() {
  const [mode, setMode] = useState<Mode>("text-to-morse");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef(false);

  const output = input
    ? mode === "text-to-morse"
      ? textToMorse(input)
      : morseToText(input)
    : "";

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  async function playMorse() {
    const morseStr = mode === "text-to-morse" ? output : textToMorse(output);
    if (!morseStr || typeof window === "undefined") return;

    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const dot = 60;
    const dash = dot * 3;
    const gap = dot;
    const letterGap = dot * 3;
    const wordGap = dot * 7;

    stopRef.current = false;
    setPlaying(true);

    let time = ctx.currentTime + 0.1;

    for (const ch of morseStr) {
      if (stopRef.current) break;
      if (ch === ".") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600;
        osc.start(time);
        osc.stop(time + dot / 1000);
        time += (dot + gap) / 1000;
      } else if (ch === "-") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600;
        osc.start(time);
        osc.stop(time + dash / 1000);
        time += (dash + gap) / 1000;
      } else if (ch === " ") {
        time += letterGap / 1000;
      } else if (ch === "/") {
        time += wordGap / 1000;
      }
    }

    await new Promise<void>((resolve) => setTimeout(resolve, (time - ctx.currentTime) * 1000 + 200));
    ctx.close();
    setPlaying(false);
  }

  const hasAudioContext = typeof window !== "undefined" && (typeof window.AudioContext !== "undefined" || typeof (window as unknown as Record<string, unknown>).webkitAudioContext !== "undefined");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {([
          { id: "text-to-morse" as Mode, label: "Text → Morse" },
          { id: "morse-to-text" as Mode, label: "Morse → Text" },
        ]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ring-1",
              mode === id
                ? "bg-foreground text-white ring-foreground"
                : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">
          {mode === "text-to-morse" ? "Plain text" : "Morse code (use spaces between letters, / between words)"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "text-to-morse" ? "Type text to convert to Morse…" : ".- -... -.-. / . . ."}
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      {output && (
        <div className="space-y-3">
          <div className="relative">
            <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[13px] font-mono leading-relaxed text-foreground break-words whitespace-pre-wrap pr-20">
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

          {hasAudioContext && mode === "text-to-morse" && (
            <button
              onClick={playing ? () => { stopRef.current = true; } : playMorse}
              className={cn(
                "rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors",
                playing
                  ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                  : "bg-foreground text-white hover:bg-foreground/90"
              )}
            >
              {playing ? "Stop" : "▶ Play Morse"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
