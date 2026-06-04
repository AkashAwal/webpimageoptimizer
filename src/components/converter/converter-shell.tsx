"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  UploadSimple, X, CircleNotch, Check, DownloadSimple,
  FrameCorners, DotsSixVertical, ArrowCounterClockwise, Trash,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConvertType =
  | "png-to-webp" | "jpg-to-webp" | "gif-to-webp" | "avif-to-webp"
  | "bmp-to-webp" | "tiff-to-webp" | "svg-to-webp" | "ico-to-webp"
  | "jfif-to-webp" | "pdf-to-webp" | "webp-to-webp" | "heic-to-webp";

type FileStatus = "queued" | "converting" | "done" | "error";

interface QueueItem {
  id: string;
  file: File;
  previewUrl: string | null;
  status: FileStatus;
  result: { blob: Blob; url: string } | null;
  error: string | null;
}

interface Settings {
  quality: number;
  width: string;
  height: string;
  namingMode: "original" | "prefix";
  prefix: string;
  sizeCapKB: string;
  stripMeta: boolean;
}

// ─── Conversion utilities ─────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function canvasConvert(
  source: File | Blob,
  quality: number,
  targetW?: number,
  targetH?: number,
): Promise<Blob> {
  const bitmap = await createImageBitmap(source);
  let w = bitmap.width;
  let h = bitmap.height;
  if (targetW && targetH) { w = targetW; h = targetH; }
  else if (targetW) { h = Math.round(bitmap.height * (targetW / bitmap.width)); w = targetW; }
  else if (targetH) { w = Math.round(bitmap.width * (targetH / bitmap.height)); h = targetH; }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      "image/webp",
      quality / 100,
    ),
  );
}

async function svgConvert(file: File, quality: number, targetW?: number, targetH?: number): Promise<Blob> {
  const url = URL.createObjectURL(file);
  return new Promise<Blob>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let w = img.naturalWidth || 800;
      let h = img.naturalHeight || 600;
      if (targetW && targetH) { w = targetW; h = targetH; }
      else if (targetW) { h = Math.round(h * (targetW / w)); w = targetW; }
      else if (targetH) { w = Math.round(w * (targetH / h)); h = targetH; }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
        "image/webp", quality / 100,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load SVG")); };
    img.src = url;
  });
}

async function heicConvert(file: File, quality: number, targetW?: number, targetH?: number): Promise<Blob> {
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/png" });
  const png = Array.isArray(out) ? out[0] : out;
  return canvasConvert(png, quality, targetW, targetH);
}

// ─── Config ───────────────────────────────────────────────────────────────────

type ConvertFn = (f: File, q: number, w?: number, h?: number) => Promise<Blob>;

const CONFIG: Record<ConvertType, { accept: string; acceptLabel: string; canPreview: boolean; convert: ConvertFn }> = {
  "png-to-webp":  { accept: "image/png,.png",                             acceptLabel: "PNG files",     canPreview: true,  convert: canvasConvert },
  "jpg-to-webp":  { accept: "image/jpeg,.jpg,.jpeg",                      acceptLabel: "JPG / JPEG",    canPreview: true,  convert: canvasConvert },
  "gif-to-webp":  { accept: "image/gif,.gif",                             acceptLabel: "GIF files",     canPreview: true,  convert: canvasConvert },
  "avif-to-webp": { accept: "image/avif,.avif",                           acceptLabel: "AVIF files",    canPreview: true,  convert: canvasConvert },
  "bmp-to-webp":  { accept: "image/bmp,.bmp",                             acceptLabel: "BMP files",     canPreview: true,  convert: canvasConvert },
  "tiff-to-webp": { accept: "image/tiff,.tiff,.tif",                      acceptLabel: "TIFF / TIF",    canPreview: false, convert: canvasConvert },
  "svg-to-webp":  { accept: "image/svg+xml,.svg",                         acceptLabel: "SVG files",     canPreview: true,  convert: svgConvert    },
  "ico-to-webp":  { accept: "image/x-icon,image/vnd.microsoft.icon,.ico", acceptLabel: "ICO files",     canPreview: false, convert: canvasConvert },
  "jfif-to-webp": { accept: "image/jpeg,.jfif",                           acceptLabel: "JFIF files",    canPreview: true,  convert: canvasConvert },
  "pdf-to-webp":  { accept: "application/pdf,.pdf",                       acceptLabel: "PDF files",     canPreview: false, convert: canvasConvert },
  "webp-to-webp": { accept: "image/webp,.webp",                           acceptLabel: "WebP files",    canPreview: true,  convert: canvasConvert },
  "heic-to-webp": { accept: ".heic,.heif,image/heic,image/heif",          acceptLabel: "HEIC / HEIF",   canPreview: false, convert: heicConvert   },
};

// ─── Before / After modal ─────────────────────────────────────────────────────

function BeforeAfterModal({ item, onClose }: { item: QueueItem; onClose: () => void }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
    const onTouch = (e: TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [updatePos]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!item.previewUrl || !item.result) return null;
  const savings = Math.round((1 - item.result.blob.size / item.file.size) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="relative bg-neutral-950 rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
        style={{ width: "min(90vw, 900px)", aspectRatio: "16/10" }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
        onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
      >
        {/* After image */}
        <img
          src={item.result.url} alt="After" draggable={false}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Before image clipped to left of slider */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={item.previewUrl} alt="Before" draggable={false}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)] pointer-events-none"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-9 rounded-full bg-white shadow-xl flex items-center justify-center">
            <FrameCorners size={16} className="text-neutral-600" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          Before · {formatBytes(item.file.size)}
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          After · {formatBytes(item.result.blob.size)}{savings > 0 ? ` · ${savings}% smaller` : ""}
        </div>

        <button
          onClick={onClose}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[12px] px-4 py-1.5 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Presets / quality mapping ────────────────────────────────────────────────

const PRESETS = [
  { label: "Web",      quality: 80 },
  { label: "Balanced", quality: 88 },
  { label: "High",     quality: 94 },
] as const;

const Q_MIN = 60, Q_MAX = 95;
const qualityToSlider = (q: number) => Math.round(((q - Q_MIN) / (Q_MAX - Q_MIN)) * 100);
const sliderToQuality = (s: number) => Math.round(Q_MIN + (s / 100) * (Q_MAX - Q_MIN));

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConverterShell({ type }: { type: ConvertType }) {
  const cfg = CONFIG[type];
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  const [files, setFiles] = useState<QueueItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [compareItemId, setCompareItemId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropDragging, setDropDragging] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    quality: 88,
    width: "",
    height: "",
    namingMode: "original",
    prefix: "image",
    sizeCapKB: "",
    stripMeta: true,
  });

  // ── File management ──────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const items: QueueItem[] = Array.from(incoming).map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        previewUrl: cfg.canPreview ? URL.createObjectURL(f) : null,
        status: "queued" as FileStatus,
        result: null,
        error: null,
      }));
      setFiles((prev) => [...prev, ...items]);
    },
    [cfg.canPreview],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item?.result?.url) URL.revokeObjectURL(item.result.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const retryFile = useCallback((id: string) => {
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, status: "queued", error: null } : f));
  }, []);

  const clearAll = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.result?.url) URL.revokeObjectURL(item.result.url);
      });
      return [];
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const current = files;
    return () => {
      current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.result?.url) URL.revokeObjectURL(item.result.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Conversion ───────────────────────────────────────────────────────────────

  const handleConvert = useCallback(async () => {
    const queued = files.filter((f) => f.status === "queued");
    if (queued.length === 0 || converting) return;
    setConverting(true);
    abortRef.current = false;

    const targetW = settings.width ? parseInt(settings.width) : undefined;
    const targetH = settings.height ? parseInt(settings.height) : undefined;

    for (const item of queued) {
      if (abortRef.current) break;
      setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: "converting" } : f));
      try {
        const blob = await cfg.convert(item.file, settings.quality, targetW, targetH);
        const url = URL.createObjectURL(blob);
        setFiles((prev) =>
          prev.map((f) => f.id === item.id ? { ...f, status: "done", result: { blob, url } } : f),
        );
      } catch (e) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: "error", error: e instanceof Error ? e.message : "Conversion failed" }
              : f,
          ),
        );
      }
    }
    setConverting(false);
  }, [files, converting, settings, cfg]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape" && converting) { abortRef.current = true; }
      if (e.key === "Enter" && !converting) { handleConvert(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [converting, handleConvert]);

  // ── Download ─────────────────────────────────────────────────────────────────

  const getOutputName = useCallback(
    (item: QueueItem, queueIndex: number) => {
      const base = item.file.name.replace(/\.[^.]+$/, "");
      const num = queueIndex + 1;
      return settings.namingMode === "original"
        ? `${base}_${num}.webp`
        : `${settings.prefix || "image"}_${num}.webp`;
    },
    [settings.namingMode, settings.prefix],
  );

  const downloadOne = useCallback(
    (item: QueueItem) => {
      if (!item.result) return;
      const idx = files.indexOf(item);
      const a = document.createElement("a");
      a.href = item.result.url;
      a.download = getOutputName(item, idx);
      a.click();
    },
    [files, getOutputName],
  );

  const downloadZip = useCallback(async () => {
    const done = files.filter((f) => f.status === "done" && f.result);
    if (!done.length) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    done.forEach((item) => {
      zip.file(getOutputName(item, files.indexOf(item)), item.result!.blob);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, [files, getOutputName]);

  // ── Drag-to-reorder ──────────────────────────────────────────────────────────

  const onItemDragStart = (id: string) => setDraggedId(id);
  const onItemDragEnd = () => { setDraggedId(null); setDragOverId(null); };
  const onItemDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOverId(id); };
  const onItemDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setFiles((prev) => {
      const from = prev.findIndex((f) => f.id === draggedId);
      const to = prev.findIndex((f) => f.id === targetId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedId(null);
    setDragOverId(null);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const capKB = settings.sizeCapKB ? parseFloat(settings.sizeCapKB) : null;
  const exceedsCap = (item: QueueItem) =>
    capKB !== null && item.result !== null && item.result.blob.size > capKB * 1024;

  const doneCount = files.filter((f) => f.status === "done").length;
  const queuedCount = files.filter((f) => f.status === "queued").length;
  const compareItem = compareItemId ? (files.find((f) => f.id === compareItemId) ?? null) : null;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="-mx-6 sm:-mx-10 overflow-x-auto">
      <div className="flex min-w-[720px] h-[calc(100vh-220px)] min-h-[580px] overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white">

        {/* ── Queue panel ─────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Queue header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
            <div className="flex items-center gap-3 text-[12px]">
              <span className="font-medium text-foreground">
                {files.length > 0 ? `${files.length} file${files.length !== 1 ? "s" : ""}` : "Queue"}
              </span>
              {doneCount > 0 && <span className="text-emerald-600">{doneCount} done</span>}
              {queuedCount > 0 && <span className="text-muted-foreground">{queuedCount} queued</span>}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                <UploadSimple size={12} />
                Add files
              </button>
              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[12px] text-muted-foreground hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* File list / empty drop zone */}
          <div
            className={cn(
              "flex-1 flex flex-col overflow-hidden",
              dropDragging && "bg-neutral-50",
            )}
            onDragOver={(e) => { e.preventDefault(); setDropDragging(true); }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDropDragging(false);
              if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
            }}
          >
            {files.length === 0 ? (
              <div
                className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-4 m-3 rounded-xl border-2 border-dashed border-border text-center transition-colors hover:border-foreground/20 hover:bg-neutral-50/60"
                onClick={() => inputRef.current?.click()}
              >
                {/* Stacked icons to suggest multiple files */}
                <div className="relative">
                  <div className="absolute -top-1.5 -right-1.5 flex size-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-500">
                    <UploadSimple size={14} />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 flex size-8 items-center justify-center rounded-lg bg-neutral-150 text-neutral-500 opacity-60">
                    <UploadSimple size={14} />
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 relative z-10">
                    <UploadSimple size={20} />
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-semibold text-foreground">Drop your files here</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Drag in one file or a whole batch · click to multi-select
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/60">{cfg.acceptLabel}</p>
                </div>

                {/* Feature pills */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
                    <UploadSimple size={11} />
                    Bulk upload
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
                    <DownloadSimple size={11} />
                    ZIP download
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {files.map((item, index) => {
                  const flagged = exceedsCap(item);
                  const savings = item.result
                    ? Math.round((1 - item.result.blob.size / item.file.size) * 100)
                    : null;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => onItemDragStart(item.id)}
                      onDragEnd={onItemDragEnd}
                      onDragOver={(e) => onItemDragOver(e, item.id)}
                      onDrop={() => onItemDrop(item.id)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all",
                        "bg-white ring-1 ring-black/5",
                        item.id === dragOverId && "ring-2 ring-foreground/20 translate-y-px",
                        item.id === draggedId && "opacity-40",
                        flagged && "ring-2 ring-red-400/50 bg-red-50/40",
                      )}
                    >
                      {/* Drag handle */}
                      <DotsSixVertical
                        size={14}
                        className="shrink-0 text-neutral-300 cursor-grab active:cursor-grabbing"
                      />

                      {/* Thumbnail */}
                      {item.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.previewUrl} alt=""
                          className="size-9 rounded-md object-cover shrink-0 bg-neutral-100"
                        />
                      ) : (
                        <div className="size-9 rounded-md bg-neutral-100 shrink-0 flex items-center justify-center">
                          <UploadSimple size={12} className="text-neutral-300" />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[12px] font-medium text-foreground leading-tight">
                          {getOutputName(item, index)}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                          {formatBytes(item.file.size)}
                          {item.status === "done" && item.result && (
                            <>
                              {" → "}{formatBytes(item.result.blob.size)}
                              {" · "}
                              <span className={savings !== null && savings > 0 ? "text-emerald-600" : "text-amber-600"}>
                                {savings !== null && savings > 0
                                  ? `${savings}% smaller`
                                  : `${savings !== null ? Math.abs(savings) : 0}% larger`}
                              </span>
                              {flagged && <span className="text-red-500"> · exceeds {capKB}KB limit</span>}
                            </>
                          )}
                          {item.status === "error" && (
                            <span className="text-red-500"> · {item.error}</span>
                          )}
                        </p>
                      </div>

                      {/* Status & actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {item.status === "converting" && (
                          <CircleNotch size={15} className="animate-spin text-neutral-400 mx-1" />
                        )}
                        {item.status === "queued" && (
                          <span className="text-[10px] text-muted-foreground/50 px-1">queued</span>
                        )}
                        {item.status === "done" && (
                          <>
                            <Check size={15} className="text-emerald-500 mx-1" />
                            {item.previewUrl && (
                              <button
                                onClick={() => setCompareItemId(item.id)}
                                title="Compare before / after"
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                              >
                                <FrameCorners size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => downloadOne(item)}
                              title="Download"
                              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                            >
                              <DownloadSimple size={16} />
                            </button>
                          </>
                        )}
                        {item.status === "error" && (
                          <button
                            onClick={() => retryFile(item.id)}
                            title="Retry conversion"
                            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-amber-600 transition-colors"
                          >
                            <ArrowCounterClockwise size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => removeFile(item.id)}
                          aria-label="Remove file"
                          className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add more strip at bottom of list */}
                <div
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-[12px] text-muted-foreground hover:bg-neutral-50/60 hover:border-foreground/20 transition-colors"
                  onClick={() => inputRef.current?.click()}
                >
                  <UploadSimple size={13} />
                  Add more {cfg.acceptLabel}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Settings panel ──────────────────────────────────────────────────── */}
        <div className="w-[260px] shrink-0 flex flex-col border-l border-border">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">

            {/* Presets */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Preset</p>
              <div className="flex gap-1">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setSettings((s) => ({ ...s, quality: p.quality }))}
                    className={cn(
                      "flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                      settings.quality === p.quality
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quality</p>
                <span className="text-[11px] tabular-nums text-muted-foreground">{settings.quality}%</span>
              </div>
              <input
                type="range" min={0} max={100}
                value={qualityToSlider(settings.quality)}
                onChange={(e) => setSettings((s) => ({ ...s, quality: sliderToQuality(Number(e.target.value)) }))}
                className="w-full h-1.5 cursor-pointer accent-foreground"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground/60">Smaller</span>
                <span className="text-[10px] text-muted-foreground/60">Higher quality</span>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Dimensions (px)</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground/70 mb-1">W</p>
                  <input
                    type="number" min={1} placeholder="Auto"
                    value={settings.width}
                    onChange={(e) => setSettings((s) => ({ ...s, width: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground/70 mb-1">H</p>
                  <input
                    type="number" min={1} placeholder="Auto"
                    value={settings.height}
                    onChange={(e) => setSettings((s) => ({ ...s, height: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-1 leading-tight">One field = aspect ratio preserved.</p>
            </div>

            {/* Naming */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">File naming</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name={`naming-${type}`} value="original"
                    checked={settings.namingMode === "original"}
                    onChange={() => setSettings((s) => ({ ...s, namingMode: "original" }))}
                    className="accent-foreground"
                  />
                  <span className="text-[12px] text-foreground">Original + number</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" name={`naming-${type}`} value="prefix"
                    checked={settings.namingMode === "prefix"}
                    onChange={() => setSettings((s) => ({ ...s, namingMode: "prefix" }))}
                    className="accent-foreground"
                  />
                  <span className="text-[12px] text-foreground">Custom prefix</span>
                </label>
                {settings.namingMode === "prefix" && (
                  <input
                    type="text" placeholder="image"
                    value={settings.prefix}
                    onChange={(e) => setSettings((s) => ({ ...s, prefix: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                  />
                )}
              </div>
            </div>

            {/* Size cap */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Size cap</p>
              <div className="flex items-center gap-1.5">
                <input
                  type="number" min={1} placeholder="e.g. 300"
                  value={settings.sizeCapKB}
                  onChange={(e) => setSettings((s) => ({ ...s, sizeCapKB: e.target.value }))}
                  className="flex-1 min-w-0 rounded-lg border border-border bg-neutral-50 px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                />
                <span className="text-[12px] text-muted-foreground shrink-0">KB</span>
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-1 leading-tight">Files over this are flagged red.</p>
            </div>

            {/* Strip metadata */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.stripMeta}
                onChange={(e) => setSettings((s) => ({ ...s, stripMeta: e.target.checked }))}
                className="accent-foreground size-3.5"
              />
              <span className="text-[12px] text-foreground">Strip metadata</span>
            </label>

          </div>

          {/* Sticky action buttons */}
          <div className="p-3 border-t border-border space-y-2 shrink-0">
            <SoftPillButton
              variant="primary"
              onClick={converting ? () => { abortRef.current = true; } : handleConvert}
              disabled={!files.length || (!converting && queuedCount === 0)}
              className="w-full h-9 text-[12px]"
            >
              {converting ? (
                <><CircleNotch size={12} className="animate-spin" />Stop (Esc)</>
              ) : (
                <>Optimize Now{queuedCount > 0 && <span className="opacity-60 ml-1">({queuedCount})</span>}</>
              )}
            </SoftPillButton>
            <SoftPillButton
              variant="secondary"
              onClick={doneCount > 0 ? downloadZip : undefined}
              disabled={doneCount === 0}
              className="w-full h-9 text-[12px]"
            >
              <DownloadSimple size={12} />
              {doneCount > 0 ? `Download all as ZIP (${doneCount})` : "Download all as ZIP"}
            </SoftPillButton>
            <p className="text-center text-[10px] text-muted-foreground/50">Enter to start · Esc to stop</p>
          </div>
        </div>

      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={cfg.accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Before/After modal */}
      {compareItem && (
        <BeforeAfterModal item={compareItem} onClose={() => setCompareItemId(null)} />
      )}
    </div>
  );
}
