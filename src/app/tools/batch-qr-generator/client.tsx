"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { DownloadSimple, CircleNotch, Check } from "@phosphor-icons/react";

type ECC = "L" | "M" | "Q" | "H";
const SIZES = [256, 512, 1024];
const ECC_LEVELS: { id: ECC; label: string }[] = [
  { id: "L", label: "L" }, { id: "M", label: "M" }, { id: "Q", label: "Q" }, { id: "H", label: "H" },
];
const labelCls = "text-[11px] font-medium text-neutral-500 uppercase tracking-wide";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "qr";
}

export function BatchQrGeneratorClient() {
  const [input, setInput] = useState("");
  const [size, setSize] = useState(512);
  const [ecc, setEcc] = useState<ECC>("M");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [state, setState] = useState<"idle" | "generating" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [preview, setPreview] = useState<string>("");
  const abortRef = useRef(false);

  const lines = input.split("\n").map(l => l.trim()).filter(Boolean);

  const firstLine = lines[0] ?? "";

  useEffect(() => {
    if (!firstLine) { setPreview(""); return; }
    let cancelled = false;
    import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(firstLine, {
        width: 256, margin: 2, errorCorrectionLevel: ecc,
        color: { dark: fg, light: bg }, type: "image/png",
      })
    ).then(url => { if (!cancelled) setPreview(url); })
     .catch(() => { if (!cancelled) setPreview(""); });
    return () => { cancelled = true; };
  }, [firstLine, ecc, fg, bg]);

  const generate = async () => {
    if (!lines.length) return;
    setState("generating");
    abortRef.current = false;
    setTotal(lines.length);
    setProgress(0);

    const [{ default: JSZip }, { default: QRCode }] = await Promise.all([
      import("jszip"),
      import("qrcode"),
    ]);
    const zip = new JSZip();
    const seen = new Map<string, number>();

    for (let i = 0; i < lines.length; i++) {
      if (abortRef.current) break;
      const text = lines[i];
      try {
        const dataUrl = await QRCode.toDataURL(text, {
          width: size,
          margin: 2,
          errorCorrectionLevel: ecc,
          color: { dark: fg, light: bg },
          type: "image/png",
        });
        const base64 = dataUrl.split(",")[1];
        let name = slugify(text);
        const count = seen.get(name) ?? 0;
        seen.set(name, count + 1);
        if (count > 0) name = `${name}-${count}`;
        zip.file(`${name}.png`, base64, { base64: true });
      } catch {}
      setProgress(i + 1);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qr-codes.zip";
    a.click();
    URL.revokeObjectURL(a.href);
    setState("done");
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setTotal(0);
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left: inputs + settings */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Input */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={labelCls}>URLs / Text | one per line</label>
              <span className="text-[11px] tabular-nums text-muted-foreground">{lines.length} item{lines.length !== 1 ? "s" : ""}</span>
            </div>
            <textarea
              value={input}
              onChange={e => { setInput(e.target.value); setState("idle"); }}
              placeholder={"https://example.com\nhttps://shop.example.com/product-1\nhttps://shop.example.com/product-2\nPlain text also works"}
              rows={8}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[13px] text-neutral-900 outline-none focus:border-neutral-400 transition-colors resize-none font-mono dark:border-neutral-600 dark:bg-white dark:text-neutral-900"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <div className="grid grid-cols-2 gap-4">
            {/* Size */}
            <div className="space-y-1.5">
              <label className={labelCls}>Size</label>
              <div className="flex gap-1.5">
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={cn("flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                      size === s ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-black/10 hover:bg-neutral-50"
                    )}>
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            {/* ECC */}
            <div className="space-y-1.5">
              <label className={labelCls}>Error correction</label>
              <div className="flex gap-1.5">
                {ECC_LEVELS.map(e => (
                  <button key={e.id} onClick={() => setEcc(e.id)}
                    className={cn("flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition-colors",
                      ecc === e.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-black/10 hover:bg-neutral-50"
                    )}>
                    {e.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="flex gap-4">
            <div className="space-y-1">
              <label className={labelCls}>Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="size-8 rounded-lg border border-neutral-200 cursor-pointer" />
                <span className="text-[12px] text-neutral-600 font-mono">{fg}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="size-8 rounded-lg border border-neutral-200 cursor-pointer" />
                <span className="text-[12px] text-neutral-600 font-mono">{bg}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {state === "generating" && (
          <div className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden dark:bg-neutral-700">
              <div className="h-full bg-foreground transition-all duration-150 rounded-full dark:bg-white" style={{ width: `${(progress / total) * 100}%` }} />
            </div>
            <p className="text-[12px] text-muted-foreground text-center">{progress} / {total} QR codes</p>
          </div>
        )}

        {/* Actions */}
        {state === "done" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900/50">
              <Check size={14} className="text-emerald-600 dark:text-emerald-400" weight="bold" />
              <span className="text-[13px] font-medium text-emerald-700 dark:text-emerald-400">{total} QR codes downloaded as ZIP</span>
            </div>
            <SoftPillButton variant="secondary" onClick={reset} className="w-full h-9 text-[13px]">Generate another batch</SoftPillButton>
          </div>
        ) : (
          <SoftPillButton
            variant="primary"
            onClick={state === "generating" ? () => { abortRef.current = true; setState("idle"); } : generate}
            disabled={!lines.length && state !== "generating"}
            className="w-full h-10 text-[13px]"
          >
            {state === "generating" ? (
              <><CircleNotch size={14} className="animate-spin" />Generating {progress}/{total} | Cancel</>
            ) : (
              <><DownloadSimple size={14} />Generate & Download ZIP ({lines.length})</>
            )}
          </SoftPillButton>
        )}
      </div>

      {/* Right: preview */}
      <div className="flex flex-col items-center gap-3 w-full lg:w-[200px] shrink-0">
        <div className="w-full max-w-[200px] rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-3 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          {preview
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={preview} alt="QR code preview" className="w-full rounded-xl" />
            : <div className="aspect-square w-full rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          }
        </div>
        <p className="text-[11px] text-muted-foreground text-center max-w-[200px]">
          {lines.length > 0 ? `Preview of item 1 / ${lines.length}` : "Preview appears as you type"}
        </p>
      </div>
    </div>
  );
}
