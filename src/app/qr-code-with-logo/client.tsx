"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { DownloadSimple, UploadSimple, X } from "@phosphor-icons/react";

const inputCls = "w-full rounded-xl border border-border bg-neutral-50 px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors dark:bg-neutral-800 dark:focus:bg-neutral-700";
const labelCls = "text-[11px] font-medium text-muted-foreground uppercase tracking-wide";

const SIZES = [256, 512, 1024];

export function QrCodeWithLogoClient() {
  const [url, setUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(22);
  const [circle, setCircle] = useState(false);
  const [size, setSize] = useState(512);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    const url = URL.createObjectURL(file);
    setLogoFile(file);
    setLogoUrl(url);
  };

  const removeLogo = () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoFile(null);
    setLogoUrl(null);
  };

  const generate = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = url || "https://pixgarage.com";

    try {
      await QRCode.toCanvas(canvas, data, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: fg, light: bg },
      });

      if (!logoUrl) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const logoImg = new window.Image();
      logoImg.onload = () => {
        const logoW = (size * logoSize) / 100;
        const logoH = logoW;
        const x = (size - logoW) / 2;
        const y = (size - logoH) / 2;

        ctx.save();
        if (circle) {
          ctx.beginPath();
          ctx.arc(x + logoW / 2, y + logoH / 2, logoW / 2, 0, Math.PI * 2);
          ctx.clip();
        } else {
          const r = logoW * 0.12;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + logoW - r, y);
          ctx.quadraticCurveTo(x + logoW, y, x + logoW, y + r);
          ctx.lineTo(x + logoW, y + logoH - r);
          ctx.quadraticCurveTo(x + logoW, y + logoH, x + logoW - r, y + logoH);
          ctx.lineTo(x + r, y + logoH);
          ctx.quadraticCurveTo(x, y + logoH, x, y + logoH - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.clip();
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 4, y - 4, logoW + 8, logoH + 8);
        ctx.drawImage(logoImg, x, y, logoW, logoH);
        ctx.restore();
      };
      logoImg.src = logoUrl;
    } catch {}
  }, [url, logoUrl, logoSize, circle, size, fg, bg]);

  useEffect(() => { generate(); }, [generate]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code-with-logo.png";
    a.click();
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto]">
      {/* Left */}
      <div className="space-y-5">
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          <div className="space-y-1">
            <label className={labelCls}>URL or text</label>
            <input className={inputCls} placeholder="https://example.com" value={url} onChange={e => setUrl(e.target.value)} />
          </div>

          {/* Logo upload */}
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

          {/* Logo size */}
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

          {/* Circle clip */}
          {logoFile && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={circle} onChange={e => setCircle(e.target.checked)} className="accent-foreground size-3.5" />
              <span className="text-[13px] text-foreground">Circle clip</span>
            </label>
          )}
        </div>

        {/* Settings */}
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-4 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          <div className="space-y-1.5">
            <label className={labelCls}>Output size</label>
            <div className="flex gap-1.5">
              {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={cn("flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                    size === s ? "bg-foreground text-white dark:bg-neutral-600" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  )}>
                  {s}px
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="space-y-1">
              <label className={labelCls}>Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="size-8 rounded-lg border border-border cursor-pointer" />
                <span className="text-[12px] text-muted-foreground font-mono">{fg}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="size-8 rounded-lg border border-border cursor-pointer" />
                <span className="text-[12px] text-muted-foreground font-mono">{bg}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: preview */}
      <div className="flex flex-col items-center gap-4 sm:w-[220px]">
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-4 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          <canvas ref={canvasRef} className="rounded-xl" style={{ width: 188, height: 188 }} />
        </div>
        <SoftPillButton variant="primary" onClick={download} className="w-full h-9 text-[12px]">
          <DownloadSimple size={13} /> Download PNG
        </SoftPillButton>
        <p className="text-[11px] text-muted-foreground text-center">Always uses H error correction for logo support</p>
      </div>
    </div>
  );
}
