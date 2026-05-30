"use client";

export interface VideoOptions {
  crf: number;
  maxWidth: string;
  stripAudio: boolean;
  speed: number;
  renameTemplate: string;
}

interface Props {
  options: VideoOptions;
  onChange: (opts: VideoOptions) => void;
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

const SPEED_OPTIONS = [
  { value: 0, label: "Slow", description: "Best compression" },
  { value: 2, label: "Balanced", description: "Recommended" },
  { value: 4, label: "Fast", description: "Quicker encode" },
  { value: 5, label: "Fastest", description: "Largest file" },
];

const crfLabel = (crf: number) =>
  crf <= 24 ? "Near-lossless" :
  crf <= 33 ? "High Quality" :
  crf <= 40 ? "Balanced" :
  "Aggressive";

export default function VideoControls({ options, onChange, disabled }: Props) {
  const set = <K extends keyof VideoOptions>(key: K, value: VideoOptions[K]) =>
    onChange({ ...options, [key]: value });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Video Settings</h3>
      </div>

      <div className="p-4 space-y-5">
        {/* Quality (CRF) */}
        <Section label="Quality (CRF)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 tabular-nums">{options.crf}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md
              ${options.crf <= 28
                ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : options.crf <= 38
                ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                : "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400"
              }`}>
              {crfLabel(options.crf)}
            </span>
          </div>
          <input
            type="range" min={18} max={51} value={options.crf}
            disabled={disabled}
            onChange={(e) => set("crf", parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-zinc-700 accent-violet-600
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
          />
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-zinc-600 font-medium mt-1.5">
            <span>Smaller file</span>
            <span>Best quality</span>
          </div>
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Encoding speed */}
        <Section label="Encoding speed">
          <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-zinc-800/60 rounded-xl">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                disabled={disabled}
                onClick={() => set("speed", opt.value)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50
                  ${options.speed === opt.value
                    ? "bg-violet-600 text-white shadow"
                    : "text-gray-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  }`}
              >
                {opt.label}
                {opt.value === 2 && options.speed !== 2 && (
                  <span className="ml-1 text-[9px] font-bold text-emerald-500 dark:text-emerald-400">REC</span>
                )}
              </button>
            ))}
          </div>
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Options */}
        <Section label="Options">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Strip audio</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Remove audio track from output</p>
            </div>
            <Toggle checked={options.stripAudio} onChange={(v) => set("stripAudio", v)} disabled={disabled} />
          </div>
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Max width */}
        <Section label="Max width">
          <p className="text-[11px] text-gray-400 dark:text-zinc-600 -mt-1">Optional — height scales proportionally</p>
          <div className="relative">
            <input
              type="text" inputMode="numeric" pattern="[0-9]*"
              placeholder="e.g. 1920"
              value={options.maxWidth}
              disabled={disabled}
              onChange={(e) => set("maxWidth", e.target.value.replace(/\D/g, ""))}
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg pl-3 pr-7 py-2
                text-sm text-zinc-800 dark:text-zinc-200 placeholder-gray-300 dark:placeholder-zinc-600
                focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20
                disabled:opacity-40 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 dark:text-zinc-600 pointer-events-none">px</span>
          </div>
        </Section>

        <div className="border-t border-gray-100 dark:border-zinc-800" />

        {/* Rename template */}
        <Section label="Output filename">
          <input
            type="text"
            placeholder="{name}  or  reel-{n}"
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
            <span className="font-mono text-violet-500">{"{n}"}</span> = counter
          </p>
        </Section>
      </div>
    </div>
  );
}
