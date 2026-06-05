"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { DownloadSimple, UploadSimple, X } from "@phosphor-icons/react";

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 outline-none focus:border-neutral-400 transition-colors dark:border-neutral-600 dark:bg-white dark:text-neutral-900 dark:focus:border-neutral-400";
const labelCls = "text-[11px] font-medium text-neutral-500 uppercase tracking-wide";
const SIZES = [256, 512, 1024];

async function renderWithLogo(
  text: string, outputSize: number, fg: string, bg: string,
  logoSrc: string | null, logoPercent: number, circle: boolean,
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  await QRCode.toCanvas(canvas, text || "https://pixgarage.com", {
    width: outputSize, margin: 2, errorCorrectionLevel: "H",
    color: { dark: fg, light: bg },
  });
  if (!logoSrc) return canvas.toDataURL("image/png");
  return new Promise(resolve => {
    const img = new window.Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d")!;
      const lw = (outputSize * logoPercent) / 100;
      const x = (outputSize - lw) / 2;
      const y = (outputSize - lw) / 2;
      ctx.save();
      if (circle) {
        ctx.beginPath();
        ctx.arc(x + lw / 2, y + lw / 2, lw / 2, 0, Math.PI * 2);
        ctx.clip();
      } else {
        const r = lw * 0.12;
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.lineTo(x + lw - r, y); ctx.quadraticCurveTo(x + lw, y, x + lw, y + r);
        ctx.lineTo(x + lw, y + lw - r); ctx.quadraticCurveTo(x + lw, y + lw, x + lw - r, y + lw);
        ctx.lineTo(x + r, y + lw); ctx.quadraticCurveTo(x, y + lw, x, y + lw - r);
        ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.clip();
      }
      ctx.fillStyle = bg;
      ctx.fillRect(x - 4, y - 4, lw + 8, lw + 8);
      ctx.drawImage(img, x, y, lw, lw);
      ctx.restore();
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(canvas.toDataURL("image/png"));
    img.src = logoSrc;
  });
}

export function QrCodeWithLogoClient() {
  const [url, setUrl]         = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(22);
  const [circle, setCircle]   = useState(false);
  const [size, setSize]       = useState(512);
  const [fg, setFg]           = useState("#000000");
  const [bg, setBg]           = useState("#ffffff");
  const [preview, setPreview] = useState<string>("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    const u = URL.createObjectURL(file);
    setLogoFile(file); setLogoUrl(u);
  };

  const removeLogo = () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoFile(null); setLogoUrl(null);
  };

  const regenerate = useCallback(async () => {
    // Preview at 256px for performance
    const dataUrl = await renderWithLogo(url, 256, fg, bg, logoUrl, logoSize, circle);
    setPreview(dataUrl);
  }, [url, logoUrl, logoSize, circle, fg, bg]);

  useEffect(() => { regenerate(); }, [regenerate]);

  const download = async () => {
    const dataUrl = await renderWithLogo(url, size, fg, bg, logoUrl, logoSize, circle);
    const a = document.createElement("a");
    a.href = dataUrl; a.download = "qr-code-with-logo.png"; a.click();
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left */}
      <div className="flex-1 min-w-0 space-y-5">
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <div className="space-y-1">
            <label className={labelCls}>URL or text</label>
            <input className={inputCls} placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>Logo image</label>
            {!logoFile ? (
              <div
                onClick={() => logoInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border px-4 py-3 text-[13px] text-muted-foreground hover:border-foreground/20 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <UploadSimple size={16} />
                <span>Upload logo (PNG, JPG, SVG…)</span>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); e.target.value = ""; }} />
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5 ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/6">
                {logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="" className="size-8 rounded-md object-contain bg-white dark:bg-neutral-700" />
                )}
                <span className="flex-1 text-[12px] font-medium text-foreground truncate">{logoFile.name}</span>
                <button onClick={removeLogo} className="shrink-0 text-neutral-400 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {logoFile && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={labelCls}>Logo size</label>
                <span className="text-[11px] tabular-nums text-muted-foreground">{logoSize}%</span>
              </div>
              <input type="range" min={10} max={30} value={logoSize} onChange={e => setLogoSize(Number(e.target.value))}
                className="w-full h-1.5 cursor-pointer accent-foreground" />
              <div className="flex justify-between">
                <span className="text-[10px] text-muted-foreground/60">10%</span>
                <span className="text-[10px] text-muted-foreground/60">30% max</span>
              </div>
            </div>
          )}

          {logoFile && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={circle} onChange={e => setCircle(e.target.checked)} className="accent-foreground size-3.5" />
              <span className="text-[13px] text-foreground">Circle clip</span>
            </label>
          )}
        </div>

        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-white dark:ring-black/8">
          <div className="space-y-1.5">
            <label className={labelCls}>Output size</label>
            <div className="flex gap-1.5">
              {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={cn("flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                    size === s ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-black/10 hover:bg-neutral-50"
                  )}>{s}px</button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            {[{ label: "Foreground", val: fg, set: setFg }, { label: "Background", val: bg, set: setBg }].map(c => (
              <div key={c.label} className="space-y-1">
                <label className={labelCls}>{c.label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={c.val} onChange={e => c.set(e.target.value)} className="size-8 rounded-lg border border-neutral-200 cursor-pointer" />
                  <span className="text-[12px] text-neutral-600 font-mono">{c.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: preview */}
      <div className="flex flex-col items-center gap-4 w-full lg:w-[200px] shrink-0">
        <div className="w-full max-w-[200px] rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-3 dark:bg-white dark:ring-black/8">
          {preview
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={preview} alt="QR code preview" className="w-full rounded-xl" />
            : <div className="aspect-square w-full rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          }
        </div>
        <div className="w-full max-w-[200px] space-y-2">
          <SoftPillButton variant="primary" onClick={download} className="w-full h-9 text-[12px]">
            <DownloadSimple size={13} /> Download PNG
          </SoftPillButton>
          <p className="text-[11px] text-muted-foreground text-center">Always uses H error correction</p>
        </div>
      </div>
    </div>
  );
}
