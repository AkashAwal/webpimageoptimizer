"use client";

import { Info } from "lucide-react";

export interface OptimizeOptions {
  quality: number;
  nearLossless: boolean;
  stripMetadata: boolean;
  format: "webp" | "avif";
  maxWidth: string;
  maxHeight: string;
  renameTemplate: string;
  sizeBudget: string;
}

interface Props {
  options: OptimizeOptions;
  onChange: (opts: OptimizeOptions) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 focus:outline-none disabled:opacity-40
        ${checked ? "bg-violet-600" : "bg-gray-200 dark:bg-zinc-700"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">{label}</p>
      {children}
    </div>
  );
}

export default function QualityControls({ options, onChange, disabled }: Props) {
  const set = <K extends keyof OptimizeOptions>(key: K, value: OptimizeOptions[K]) =>
    onChange({ ...options, [key]: value });

  const qualityLabel =
    options.quality >= 90 ? "Maximum" :
    options.quality >= 80 ? "High" :
    options.quality >= 65 ? "Balanced" :
    options.quality >= 50 ? "Small" : "Aggressive";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Settings</h3>
      </div>

      <div className="p-4 space-y-5">
        {/* Format */}
        <Section label="Output format">
          <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-zinc-800/60 rounded-xl">
            {(["webp", "avif"] as const).map((f) => (
              <button
                key={f}
                disabled={disabled}
                onClick={() => set("format", f)}
                className={`py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50
                  ${options.format === f
                    ? "bg-violet-600 text-white shadow"
                    : "text-gray-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  }`}
              >
                {f.toUpperCase()}
                {f === "avif" && options.format !== "avif" && (
                  <span className="ml-1.5 text-[9px] font-bold text-emerald-500 dark:text-emerald-400">SMALLER</span>
                )}
              </button>
            ))}
          </div>
          {options.format === "avif" && (
            <p className="flex items-start gap-1.5 text-xs text-gray-400 dark:text-zinc-500 leading-relaxed">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              20–30% smaller than WebP, requires modern browsers (2021+)
            </p>
          )}
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Quality */}
        <Section label="Quality">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 tabular-nums">{options.quality}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md
              ${options.nearLossless || options.quality >= 80
                ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : options.quality >= 60
                ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                : "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
              }`}>
              {options.nearLossless ? "Near-lossless" : qualityLabel}
            </span>
          </div>
          <input
            type="range" min={30} max={100} value={options.quality}
            disabled={disabled || options.nearLossless}
            onChange={(e) => set("quality", parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-zinc-700 accent-violet-600
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
          />
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-zinc-600 font-medium mt-1.5">
            <span>Smaller Size</span>
            <span>Best quality</span>
          </div>
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Toggles */}
        <Section label="Options">
          <div className="space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Near-lossless</p>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-1.5 py-0.5 rounded-md">REC</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Visually identical, noticeably smaller (WebP)</p>
              </div>
              <Toggle checked={options.nearLossless} onChange={(v) => set("nearLossless", v)} disabled={disabled || options.format === "avif"} />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Strip metadata</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Removes EXIF, GPS, camera info</p>
              </div>
              <Toggle checked={options.stripMetadata} onChange={(v) => set("stripMetadata", v)} disabled={disabled} />
            </div>
          </div>
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Resize */}
        <Section label="Max dimensions">
          <p className="text-[11px] text-gray-400 dark:text-zinc-600 -mt-1">Optional — preserves aspect ratio</p>
          <div className="grid grid-cols-2 gap-2">
            {(["maxWidth", "maxHeight"] as const).map((key) => (
              <div key={key} className="relative">
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*"
                  placeholder={key === "maxWidth" ? "Width" : "Height"}
                  value={options[key]}
                  disabled={disabled}
                  onChange={(e) => set(key, e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg pl-3 pr-7 py-2
                    text-sm text-zinc-800 dark:text-zinc-200 placeholder-gray-300 dark:placeholder-zinc-600
                    focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20
                    disabled:opacity-40 transition-colors"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 dark:text-zinc-600 pointer-events-none">px</span>
              </div>
            ))}
          </div>
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Rename template */}
        <Section label="Output filename">
          <input
            type="text"
            placeholder="{name}  or  hero-{n}  or  site-{n}"
            value={options.renameTemplate}
            disabled={disabled}
            onChange={(e) => set("renameTemplate", e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2
              text-sm text-zinc-800 dark:text-zinc-200 placeholder-gray-300 dark:placeholder-zinc-600 font-mono
              focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20
              disabled:opacity-40 transition-colors"
          />
          <p className="text-[11px] text-gray-400 dark:text-zinc-500 leading-relaxed">
            <span className="font-mono text-violet-500">{"{name}"}</span> = original name ·{" "}
            <span className="font-mono text-violet-500">{"{n}"}</span> = counter · empty = keep original
          </p>
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Size budget */}
        <Section label="Size budget">
          <div className="relative">
            <input
              type="text" inputMode="numeric" pattern="[0-9]*"
              placeholder="e.g. 200"
              value={options.sizeBudget}
              disabled={disabled}
              onChange={(e) => set("sizeBudget", e.target.value.replace(/\D/g, ""))}
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg pl-3 pr-10 py-2
                text-sm text-zinc-800 dark:text-zinc-200 placeholder-gray-300 dark:placeholder-zinc-600
                focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20
                disabled:opacity-40 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 dark:text-zinc-500 pointer-events-none font-medium">KB</span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-zinc-500">Files exceeding this will be flagged red. Leave empty to disable.</p>
        </Section>
      </div>
    </div>
  );
}
