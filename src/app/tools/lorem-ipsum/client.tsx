"use client";

import { useState } from "react";
import { ArrowsClockwise, Copy, Check } from "@/components/ui/icons";

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

export function LoremIpsumClient() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState<string>(() =>
    LOREM_PARAGRAPHS.slice(0, 3).join("\n\n")
  );
  const [copied, setCopied] = useState(false);

  function generate() {
    const shuffled = [...LOREM_PARAGRAPHS].sort(() => Math.random() - 0.5);
    setOutput(shuffled.slice(0, paragraphs).join("\n\n"));
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
        onClick={generate}
        className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-foreground/90"
      >
        <ArrowsClockwise size={13} />
        Generate
      </button>

      {/* Output */}
      {output && (
        <div className="relative">
          <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
            {output.split("\n\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-muted-foreground mb-3 last:mb-0">
                {para}
              </p>
            ))}
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
