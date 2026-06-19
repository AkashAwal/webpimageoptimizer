"use client";

import { useState, useEffect, useRef } from "react";

export function TextToSpeechClient() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!window.speechSynthesis) { setSupported(false); return; }
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const speak = () => {
    if (!text.trim() || !supported) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    if (voices[voiceIdx]) utt.voice = voices[voiceIdx];
    utt.rate = rate;
    utt.pitch = pitch;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  if (!supported) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center">
        <p className="text-[14px] text-muted-foreground">Your browser does not support the Web Speech API. Try Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Text to speak</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here and press Speak..."
          className="h-36 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
        />
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        {voices.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Voice</label>
            <select
              value={voiceIdx}
              onChange={(e) => setVoiceIdx(parseInt(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-neutral-400 transition-colors"
            >
              {voices.map((v, i) => (
                <option key={i} value={i}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Speed: {rate}×</label>
            <input type="range" min={0.5} max={2} step={0.1} value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-neutral-900" />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>0.5×</span><span>2×</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Pitch: {pitch}</label>
            <input type="range" min={0} max={2} step={0.1} value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-neutral-900" />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Low</span><span>High</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={speaking ? stop : speak}
            disabled={!text.trim()}
            className={`flex-1 rounded-xl py-2.5 text-[14px] font-semibold transition-colors disabled:opacity-40 ${speaking ? "bg-red-600 text-white hover:bg-red-700" : "bg-neutral-900 text-white hover:bg-neutral-800"}`}
          >
            {speaking ? "Stop" : "Speak"}
          </button>
          {speaking && (
            <div className="flex items-center gap-1 px-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1 bg-neutral-400 rounded-full animate-bounce" style={{ height: "16px", animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-[12px] text-muted-foreground">Audio is generated entirely in your browser using the Web Speech API. No text is sent to any server.</p>
    </div>
  );
}
