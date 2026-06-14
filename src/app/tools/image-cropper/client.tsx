"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, ArrowCounterClockwise } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type Ratio = { label: string; w: number; h: number } | null;

const RATIOS: { label: string; w: number; h: number }[] = [
  { label: "Free", w: 0, h: 0 },
  { label: "1 : 1", w: 1, h: 1 },
  { label: "16 : 9", w: 16, h: 9 },
  { label: "4 : 3", w: 4, h: 3 },
  { label: "3 : 2", w: 3, h: 2 },
  { label: "2 : 3", w: 2, h: 3 },
  { label: "9 : 16", w: 9, h: 16 },
];

interface CropBox { x: number; y: number; w: number; h: number }

const MIN_SIZE = 20;

type Handle = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r" | "move";

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

export function ImageCropperClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [ratio, setRatio] = useState<Ratio>(null); // null = Free
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 });
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Canvas display refs
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayW, setDisplayW] = useState(0);
  const [displayH, setDisplayH] = useState(0);

  // Drag state
  const dragRef = useRef<{
    handle: Handle;
    startX: number; startY: number;
    startCrop: CropBox;
  } | null>(null);

  const imgUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const computeDisplay = useCallback((nw: number, nh: number) => {
    const container = containerRef.current;
    if (!container || !nw || !nh) return;
    const maxW = container.clientWidth;
    const maxH = 400;
    const scale = Math.min(maxW / nw, maxH / nh, 1);
    setDisplayW(Math.round(nw * scale));
    setDisplayH(Math.round(nh * scale));
  }, []);

  const initCrop = useCallback((nw: number, nh: number, r: Ratio) => {
    let w = nw, h = nh;
    if (r && r.w && r.h) {
      const aspect = r.w / r.h;
      if (nw / nh > aspect) { h = nh; w = Math.round(nh * aspect); }
      else { w = nw; h = Math.round(nw / aspect); }
    }
    setCrop({ x: Math.round((nw - w) / 2), y: Math.round((nh - h) / 2), w, h });
  }, []);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    const url = URL.createObjectURL(f);
    imgUrlRef.current = url;
    setFile(f);
    setImgUrl(url);
    setResultUrl(null);
    const img = new Image();
    img.onload = () => {
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      computeDisplay(img.naturalWidth, img.naturalHeight);
      initCrop(img.naturalWidth, img.naturalHeight, null);
    };
    img.src = url;
  }, [computeDisplay, initCrop]);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    imgUrlRef.current = null; resultUrlRef.current = null;
    setFile(null); setImgUrl(null); setNaturalW(0); setNaturalH(0);
    setRatio(null); setResultUrl(null); setDisplayW(0); setDisplayH(0);
  }, []);

  const changeRatio = (r: typeof RATIOS[number]) => {
    const newRatio = r.w === 0 ? null : r;
    setRatio(newRatio);
    if (naturalW && naturalH) initCrop(naturalW, naturalH, newRatio);
  };

  // Scale helpers
  const scaleToNatural = (v: number, axis: "x" | "y") =>
    axis === "x" ? Math.round((v / displayW) * naturalW) : Math.round((v / displayH) * naturalH);
  const scaleToDisplay = (v: number, axis: "x" | "y") =>
    axis === "x" ? (v / naturalW) * displayW : (v / naturalH) * displayH;

  const getHandle = (e: React.MouseEvent<HTMLDivElement>): Handle => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = scaleToDisplay(crop.x, "x");
    const dy = scaleToDisplay(crop.y, "y");
    const dw = scaleToDisplay(crop.w, "x");
    const dh = scaleToDisplay(crop.h, "y");
    const EDGE = 10;
    const inX = mx >= dx && mx <= dx + dw;
    const inY = my >= dy && my <= dy + dh;
    const nearL = Math.abs(mx - dx) < EDGE;
    const nearR = Math.abs(mx - (dx + dw)) < EDGE;
    const nearT = Math.abs(my - dy) < EDGE;
    const nearB = Math.abs(my - (dy + dh)) < EDGE;
    if (nearT && nearL) return "tl";
    if (nearT && nearR) return "tr";
    if (nearB && nearL) return "bl";
    if (nearB && nearR) return "br";
    if (nearT && inX) return "t";
    if (nearB && inX) return "b";
    if (nearL && inY) return "l";
    if (nearR && inY) return "r";
    if (inX && inY) return "move";
    return "move";
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!file) return;
    e.preventDefault();
    const handle = getHandle(e);
    dragRef.current = { handle, startX: e.clientX, startY: e.clientY, startCrop: { ...crop } };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current) return;
    const { handle, startX, startY, startCrop } = dragRef.current;
    const dx = scaleToNatural(e.clientX - startX, "x");
    const dy = scaleToNatural(e.clientY - startY, "y");
    let { x, y, w, h } = startCrop;
    const aspect = ratio && ratio.w ? ratio.w / ratio.h : 0;

    if (handle === "move") {
      x = clamp(x + dx, 0, naturalW - w);
      y = clamp(y + dy, 0, naturalH - h);
    } else {
      if (handle === "tl" || handle === "l" || handle === "bl") {
        const newW = clamp(w - dx, MIN_SIZE, x + w);
        if (aspect) { const newH = newW / aspect; y = clamp(startCrop.y + (startCrop.h - newH), 0, naturalH - MIN_SIZE); h = newH; }
        x = x + w - newW; w = newW;
      }
      if (handle === "tr" || handle === "r" || handle === "br") {
        w = clamp(w + dx, MIN_SIZE, naturalW - x);
        if (aspect) h = w / aspect;
      }
      if (handle === "tl" || handle === "t" || handle === "tr") {
        if (!aspect) { const newH = clamp(h - dy, MIN_SIZE, y + h); y = y + h - newH; h = newH; }
      }
      if (handle === "bl" || handle === "b" || handle === "br") {
        if (!aspect) h = clamp(h + dy, MIN_SIZE, naturalH - y);
      }
      x = clamp(x, 0, naturalW - MIN_SIZE);
      y = clamp(y, 0, naturalH - MIN_SIZE);
      w = clamp(w, MIN_SIZE, naturalW - x);
      h = clamp(h, MIN_SIZE, naturalH - y);
    }
    setCrop({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [naturalW, naturalH, ratio, crop]);

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove]);

  useEffect(() => () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove, onMouseUp]);

  const handleCrop = async () => {
    if (!imgUrl || !naturalW) return;
    const img = new Image();
    img.src = imgUrl;
    await new Promise((r) => { img.onload = r; if (img.complete) r(null); });
    const canvas = document.createElement("canvas");
    canvas.width = crop.w;
    canvas.height = crop.h;
    canvas.getContext("2d")!.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    canvas.toBlob((b) => {
      if (!b) return;
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const url = URL.createObjectURL(b);
      resultUrlRef.current = url;
      setResultUrl(url);
    }, "image/png");
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(/\.[^.]+$/, "") + "-cropped.png";
    a.click();
  };

  const dx = displayW ? scaleToDisplay(crop.x, "x") : 0;
  const dy = displayH ? scaleToDisplay(crop.y, "y") : 0;
  const dw = displayW ? scaleToDisplay(crop.w, "x") : 0;
  const dh = displayH ? scaleToDisplay(crop.h, "y") : 0;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {!file && (
        <div
          onDrop={handleFileDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors select-none",
            dragging ? "border-foreground/30 bg-neutral-50" : "border-border hover:border-foreground/20 hover:bg-neutral-50/60",
          )}
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
            <UploadSimple size={20} />
          </div>
          <div>
            <p className="text-[14px] font-medium text-foreground">Drop your image here</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · any format</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        </div>
      )}

      {file && !resultUrl && (
        <>
          {/* Ratio pills */}
          <div className="flex flex-wrap gap-1.5">
            {RATIOS.map((r) => {
              const active = r.w === 0 ? ratio === null : ratio?.w === r.w && ratio?.h === r.h;
              return (
                <button key={r.label} onClick={() => changeRatio(r)}
                  className={cn("h-7 rounded-full px-3 text-[12px] font-medium transition-colors",
                    active ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}>
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Crop canvas */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/6 select-none cursor-crosshair"
            style={{ width: "100%", height: displayH || 300 }}
            onMouseDown={onMouseDown}
          >
            {imgUrl && displayW > 0 && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt="" className="absolute inset-0" style={{ width: displayW, height: displayH }} draggable={false} />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                {/* Crop window */}
                <div
                  className="absolute pointer-events-none border-2 border-white"
                  style={{ left: dx, top: dy, width: dw, height: dh, boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)" }}
                >
                  {/* Rule-of-thirds grid */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute border-white/30 border-r" style={{ left: "33.33%", top: 0, bottom: 0, width: 0 }} />
                    <div className="absolute border-white/30 border-r" style={{ left: "66.66%", top: 0, bottom: 0, width: 0 }} />
                    <div className="absolute border-white/30 border-b" style={{ top: "33.33%", left: 0, right: 0, height: 0 }} />
                    <div className="absolute border-white/30 border-b" style={{ top: "66.66%", left: 0, right: 0, height: 0 }} />
                  </div>
                  {/* Corner handles */}
                  {(["tl","tr","bl","br"] as const).map((h) => (
                    <div key={h} className="absolute size-3 bg-white rounded-sm"
                      style={{
                        top: h.startsWith("t") ? -5 : undefined,
                        bottom: h.startsWith("b") ? -5 : undefined,
                        left: h.endsWith("l") ? -5 : undefined,
                        right: h.endsWith("r") ? -5 : undefined,
                      }} />
                  ))}
                </div>
              </>
            )}
          </div>

          <p className="text-center text-[11px] text-muted-foreground">
            {crop.w} × {crop.h}px | drag edges or corners to adjust
          </p>

          <div className="flex gap-2">
            <SoftPillButton variant="primary" onClick={handleCrop} className="flex-1 h-10 text-[13px]">
              <Check size={13} /> Crop Image
            </SoftPillButton>
            <button onClick={reset} className="flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors">
              <X size={14} />
            </button>
          </div>
        </>
      )}

      {resultUrl && file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="flex justify-center bg-neutral-100 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Cropped" className="max-h-64 max-w-full rounded-xl object-contain" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">Cropped to {crop.w} × {crop.h}px</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="flex-1 h-9 text-[13px]">Download PNG</SoftPillButton>
              <SoftPillButton variant="secondary" onClick={() => setResultUrl(null)} className="h-9 px-4 text-[13px]">
                <ArrowCounterClockwise size={13} /> Re-crop
              </SoftPillButton>
              <button onClick={reset} className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors" title="Start over">
                <X size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
