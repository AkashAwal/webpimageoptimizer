"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  UploadSimple, X, CircleNotch, Check, DownloadSimple,
  FrameCorners, DotsSixVertical, ArrowCounterClockwise, Trash,
  ClipboardText, FolderOpen, SlidersHorizontal, ArrowUp, ArrowDown,
  CaretLeft,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConvertType =
  | "png-to-webp" | "jpg-to-webp" | "gif-to-webp" | "avif-to-webp"
  | "bmp-to-webp" | "tiff-to-webp" | "svg-to-webp" | "ico-to-webp"
  | "jfif-to-webp" | "pdf-to-webp" | "webp-to-webp" | "heic-to-webp";

type FileStatus = "queued" | "converting" | "done" | "error";
type SortMode = "added" | "name" | "size" | "savings";
type FilterMode = "all" | "queued" | "done" | "error";

interface QueueItem {
  id: string;
  file: File;
  previewUrl: string | null;
  status: FileStatus;
  result: { blob: Blob; url: string } | null;
  error: string | null;
  addedAt: number;
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

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTime(s: number) {
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function getFormat(file: File) {
  return (file.name.split(".").pop() ?? file.type.split("/").pop() ?? "?").toUpperCase();
}

async function collectFilesFromDataTransfer(items: DataTransferItemList): Promise<File[]> {
  const files: File[] = [];
  async function readEntry(entry: FileSystemEntry) {
    if (entry.isFile) {
      const f = await new Promise<File>((res, rej) => (entry as FileSystemFileEntry).file(res, rej));
      files.push(f);
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      const entries = await new Promise<FileSystemEntry[]>((res, rej) => reader.readEntries(res, rej));
      await Promise.all(entries.map(readEntry));
    }
  }
  const entries = Array.from(items).map(i => i.webkitGetAsEntry()).filter((e): e is FileSystemEntry => e !== null);
  await Promise.all(entries.map(readEntry));
  return files;
}

// ─── Conversion functions ─────────────────────────────────────────────────────

async function canvasConvert(source: File | Blob, quality: number, targetW?: number, targetH?: number): Promise<Blob> {
  const bitmap = await createImageBitmap(source);
  let w = bitmap.width, h = bitmap.height;
  if (targetW && targetH) { w = targetW; h = targetH; }
  else if (targetW) { h = Math.round(bitmap.height * (targetW / bitmap.width)); w = targetW; }
  else if (targetH) { w = Math.round(bitmap.width * (targetH / bitmap.height)); h = targetH; }
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Canvas export failed")), "image/webp", quality / 100),
  );
}

async function svgConvert(file: File, quality: number, targetW?: number, targetH?: number): Promise<Blob> {
  const url = URL.createObjectURL(file);
  return new Promise<Blob>((res, rej) => {
    const img = new window.Image();
    img.onload = () => {
      let w = img.naturalWidth || 800, h = img.naturalHeight || 600;
      if (targetW && targetH) { w = targetW; h = targetH; }
      else if (targetW) { h = Math.round(h * (targetW / w)); w = targetW; }
      else if (targetH) { w = Math.round(w * (targetH / h)); h = targetH; }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => b ? res(b) : rej(new Error("Canvas export failed")), "image/webp", quality / 100);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Failed to load SVG")); };
    img.src = url;
  });
}

async function heicConvert(file: File, quality: number, targetW?: number, targetH?: number): Promise<Blob> {
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/png" });
  return canvasConvert(Array.isArray(out) ? out[0] : out, quality, targetW, targetH);
}

// ─── Config ───────────────────────────────────────────────────────────────────

type ConvertFn = (f: File, q: number, w?: number, h?: number) => Promise<Blob>;

const CONFIG: Record<ConvertType, { accept: string; acceptLabel: string; canPreview: boolean; convert: ConvertFn }> = {
  "png-to-webp":  { accept: "image/png,.png",                             acceptLabel: "PNG files",   canPreview: true,  convert: canvasConvert },
  "jpg-to-webp":  { accept: "image/jpeg,.jpg,.jpeg",                      acceptLabel: "JPG / JPEG",  canPreview: true,  convert: canvasConvert },
  "gif-to-webp":  { accept: "image/gif,.gif",                             acceptLabel: "GIF files",   canPreview: true,  convert: canvasConvert },
  "avif-to-webp": { accept: "image/avif,.avif",                           acceptLabel: "AVIF files",  canPreview: true,  convert: canvasConvert },
  "bmp-to-webp":  { accept: "image/bmp,.bmp",                             acceptLabel: "BMP files",   canPreview: true,  convert: canvasConvert },
  "tiff-to-webp": { accept: "image/tiff,.tiff,.tif",                      acceptLabel: "TIFF / TIF",  canPreview: false, convert: canvasConvert },
  "svg-to-webp":  { accept: "image/svg+xml,.svg",                         acceptLabel: "SVG files",   canPreview: true,  convert: svgConvert    },
  "ico-to-webp":  { accept: "image/x-icon,image/vnd.microsoft.icon,.ico", acceptLabel: "ICO files",   canPreview: false, convert: canvasConvert },
  "jfif-to-webp": { accept: "image/jpeg,.jfif",                           acceptLabel: "JFIF files",  canPreview: true,  convert: canvasConvert },
  "pdf-to-webp":  { accept: "application/pdf,.pdf",                       acceptLabel: "PDF files",   canPreview: false, convert: canvasConvert },
  "webp-to-webp": { accept: "image/webp,.webp",                           acceptLabel: "WebP files",  canPreview: true,  convert: canvasConvert },
  "heic-to-webp": { accept: ".heic,.heif,image/heic,image/heif",          acceptLabel: "HEIC / HEIF", canPreview: false, convert: heicConvert   },
};

// ─── Presets / quality mapping ────────────────────────────────────────────────

const PRESETS = [
  { label: "Small File Size", quality: 75 },
  { label: "Balanced",        quality: 85 },
  { label: "Refined Quality", quality: 93 },
] as const;

const Q_MIN = 60, Q_MAX = 95;
const qualityToSlider = (q: number) => Math.round(((q - Q_MIN) / (Q_MAX - Q_MIN)) * 100);
const sliderToQuality = (s: number) => Math.round(Q_MIN + (s / 100) * (Q_MAX - Q_MIN));

const SETTINGS_KEY = "pix-garage-settings";

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
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!item.previewUrl || !item.result) return null;
  const savings = Math.round((1 - item.result.blob.size / item.file.size) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={containerRef}
        className="relative bg-neutral-950 rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
        style={{ width: "min(90vw, 900px)", aspectRatio: "16/10" }}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => { dragging.current = true; updatePos(e.clientX); }}
        onTouchStart={e => { dragging.current = true; updatePos(e.touches[0].clientX); }}
      >
        <img src={item.result.url} alt="After" draggable={false} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={item.previewUrl} alt="Before" draggable={false} className="absolute inset-0 w-full h-full object-contain" />
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.5)] pointer-events-none" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-9 rounded-full bg-white shadow-xl flex items-center justify-center">
            <FrameCorners size={16} className="text-neutral-600" />
          </div>
        </div>
        <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">Before · {formatBytes(item.file.size)}</div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">After · {formatBytes(item.result.blob.size)}{savings > 0 ? ` · ${savings}% smaller` : ""}</div>
        <button onClick={onClose} className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[12px] px-4 py-1.5 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors">Close</button>
      </div>
    </div>
  );
}

// ─── Lightbox modal ───────────────────────────────────────────────────────────

function LightboxModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm" onClick={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="max-w-[92vw] max-h-[92vh] object-contain rounded-xl shadow-2xl" draggable={false} onClick={e => e.stopPropagation()} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConverterShell({ type, title }: { type: ConvertType; title?: string }) {
  const cfg = CONFIG[type];
  const inputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);
  const filesRef = useRef<QueueItem[]>([]);
  const startTimeRef = useRef<number | null>(null);

  const [files, setFiles] = useState<QueueItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [batchTotal, setBatchTotal] = useState(0);
  const [batchDone, setBatchDone] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [compareItemId, setCompareItemId] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropDragging, setDropDragging] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fileQuality, setFileQuality] = useState<Record<string, number>>({});
  const [sortMode, setSortMode] = useState<SortMode>("added");
  const [sortAsc, setSortAsc] = useState(true);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [undoItem, setUndoItem] = useState<QueueItem | null>(null);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [settings, setSettings] = useState<Settings>({
    quality: 85, width: "", height: "", namingMode: "original", prefix: "image", sizeCapKB: "", stripMeta: true,
  });

  // Load persisted settings after mount (avoids SSR/hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) setSettings(s => ({ ...s, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  // Keep filesRef synced for removeFile
  useEffect(() => { filesRef.current = files; }, [files]);

  // Persist settings
  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);

  // Live timer while converting
  useEffect(() => {
    if (!converting) return;
    const id = setInterval(() => {
      if (startTimeRef.current) setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, [converting]);

  // ── File management ──────────────────────────────────────────────────────────

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const items: QueueItem[] = Array.from(incoming).map(f => ({
      id: crypto.randomUUID(),
      file: f,
      previewUrl: cfg.canPreview ? URL.createObjectURL(f) : null,
      status: "queued" as FileStatus,
      result: null,
      error: null,
      addedAt: Date.now(),
    }));
    setFiles(prev => [...prev, ...items]);
  }, [cfg.canPreview]);

  const removeFile = useCallback((id: string) => {
    const item = filesRef.current.find(f => f.id === id);
    if (!item) return;
    setFiles(prev => prev.filter(f => f.id !== id));
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setUndoItem(item);
    undoTimeoutRef.current = setTimeout(() => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.result?.url) URL.revokeObjectURL(item.result.url);
      setUndoItem(null);
      undoTimeoutRef.current = null;
    }, 4000);
  }, []);

  const undoRemove = useCallback(() => {
    if (!undoItem) return;
    if (undoTimeoutRef.current) { clearTimeout(undoTimeoutRef.current); undoTimeoutRef.current = null; }
    setFiles(prev => [...prev, undoItem]);
    setUndoItem(null);
  }, [undoItem]);

  const retryFile = useCallback((id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "queued", error: null } : f));
  }, []);

  const retryAllFailed = useCallback(() => {
    setFiles(prev => prev.map(f => f.status === "error" ? { ...f, status: "queued", error: null } : f));
  }, []);

  const clearAll = useCallback(() => {
    if (undoTimeoutRef.current) { clearTimeout(undoTimeoutRef.current); undoTimeoutRef.current = null; }
    setFiles(prev => {
      prev.forEach(item => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.result?.url) URL.revokeObjectURL(item.result.url);
      });
      return [];
    });
    setUndoItem(null);
  }, []);

  useEffect(() => {
    return () => {
      filesRef.current.forEach(item => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.result?.url) URL.revokeObjectURL(item.result.url);
      });
    };
  }, []);

  // ── Conversion ───────────────────────────────────────────────────────────────

  const handleConvert = useCallback(async () => {
    const queued = filesRef.current.filter(f => f.status === "queued");
    if (queued.length === 0 || converting) return;
    setConverting(true);
    abortRef.current = false;
    startTimeRef.current = Date.now();
    setElapsed(0);
    setBatchTotal(queued.length);
    setBatchDone(0);

    const targetW = settings.width ? parseInt(settings.width) : undefined;
    const targetH = settings.height ? parseInt(settings.height) : undefined;

    for (const item of queued) {
      if (abortRef.current) break;
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "converting" } : f));
      const quality = fileQuality[item.id] ?? settings.quality;
      try {
        const blob = await cfg.convert(item.file, quality, targetW, targetH);
        const url = URL.createObjectURL(blob);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "done", result: { blob, url } } : f));
      } catch (e) {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "error", error: e instanceof Error ? e.message : "Conversion failed" } : f));
      }
      setBatchDone(prev => prev + 1);
    }
    setConverting(false);
  }, [converting, settings, fileQuality, cfg]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape" && converting) abortRef.current = true;
      if (e.key === "Enter" && !converting) handleConvert();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [converting, handleConvert]);

  // ── Download ─────────────────────────────────────────────────────────────────

  const getOutputName = useCallback((item: QueueItem) => {
    const idx = filesRef.current.findIndex(f => f.id === item.id);
    const num = (idx < 0 ? 0 : idx) + 1;
    const base = item.file.name.replace(/\.[^.]+$/, "");
    return settings.namingMode === "original" ? `${base}_${num}.webp` : `${settings.prefix || "image"}_${num}.webp`;
  }, [settings.namingMode, settings.prefix]);

  const downloadOne = useCallback((item: QueueItem) => {
    if (!item.result) return;
    const a = document.createElement("a");
    a.href = item.result.url;
    a.download = getOutputName(item);
    a.click();
  }, [getOutputName]);

  const downloadZip = useCallback(async () => {
    const done = filesRef.current.filter(f => f.status === "done" && f.result);
    if (!done.length) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    done.forEach(item => zip.file(getOutputName(item), item.result!.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, [getOutputName]);

  const copyToClipboard = useCallback(async (item: QueueItem) => {
    if (!item.result) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ [item.result.blob.type]: item.result.blob })]);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard API not supported or permission denied — silent fail
    }
  }, []);

  // ── Drag-to-reorder ──────────────────────────────────────────────────────────

  const onItemDragStart = (id: string) => setDraggedId(id);
  const onItemDragEnd = () => { setDraggedId(null); setDragOverId(null); };
  const onItemDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOverId(id); };
  const onItemDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setFiles(prev => {
      const from = prev.findIndex(f => f.id === draggedId);
      const to = prev.findIndex(f => f.id === targetId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDraggedId(null); setDragOverId(null);
  };

  // ── Sort / filter ────────────────────────────────────────────────────────────

  const displayFiles = useMemo(() => {
    let result = filterMode === "all" ? [...files] : files.filter(f => f.status === filterMode);
    result.sort((a, b) => {
      let cmp = 0;
      if (sortMode === "name") cmp = a.file.name.localeCompare(b.file.name);
      else if (sortMode === "size") cmp = a.file.size - b.file.size;
      else if (sortMode === "savings") {
        const sa = a.result ? a.file.size - a.result.blob.size : -Infinity;
        const sb = b.result ? b.file.size - b.result.blob.size : -Infinity;
        cmp = sa - sb;
      } else cmp = a.addedAt - b.addedAt;
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [files, filterMode, sortMode, sortAsc]);

  // ── Derived stats ────────────────────────────────────────────────────────────

  const doneCount = files.filter(f => f.status === "done").length;
  const queuedCount = files.filter(f => f.status === "queued").length;
  const errorCount = files.filter(f => f.status === "error").length;
  const capKB = settings.sizeCapKB ? parseFloat(settings.sizeCapKB) : null;
  const exceedsCap = (item: QueueItem) => capKB !== null && item.result !== null && item.result.blob.size > capKB * 1024;
  const totalSaved = files.reduce((acc, f) => acc + (f.result ? Math.max(0, f.file.size - f.result.blob.size) : 0), 0);
  const compareItem = compareItemId ? files.find(f => f.id === compareItemId) ?? null : null;
  const progress = batchTotal > 0 ? (batchDone / batchTotal) * 100 : 0;
  const speedKBps = elapsed > 0 && doneCount > 0
    ? (files.filter(f => f.result).reduce((acc, f) => acc + f.file.size, 0) / 1024 / elapsed).toFixed(1)
    : null;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col h-[calc(100dvh-92px)] sm:h-[calc(100dvh-98px)] min-h-[480px] overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white">

        {/* ── Optional title bar ───────────────────────────────────────────────── */}
        {title && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border shrink-0 bg-neutral-50/60">
            <Link href="/" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <CaretLeft size={11} weight="bold" />All tools
            </Link>
            <span className="text-neutral-300 text-[12px]">/</span>
            <h1 className="text-[13px] font-semibold text-foreground truncate">{title}</h1>
            <span className="ml-auto text-[11px] text-muted-foreground/50 hidden sm:block shrink-0">
              Batch · no upload · ZIP download
            </span>
          </div>
        )}

        {/* ── Two-panel area ───────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

        {/* ── Queue panel ─────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
            <div className="flex items-center gap-2 text-[12px]">
              <span className="font-medium text-foreground">{files.length > 0 ? `${files.length} file${files.length !== 1 ? "s" : ""}` : "Queue"}</span>
              {errorCount > 0 && (
                <button onClick={retryAllFailed} className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 hover:bg-red-100 transition-colors">
                  <ArrowCounterClockwise size={10} />Retry all failed ({errorCount})
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">
                <UploadSimple size={12} />Add files
              </button>
              <button onClick={() => folderInputRef.current?.click()} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">
                <FolderOpen size={12} />Folder
              </button>
              {files.length > 0 && (
                <button onClick={clearAll} className="text-[12px] text-muted-foreground hover:text-red-500 transition-colors">Clear all</button>
              )}
            </div>
          </div>

          {/* Live stats strip */}
          <div className="grid grid-cols-4 divide-x divide-border border-b border-border shrink-0 bg-neutral-50/60">
            {[
              { label: "Queued", value: queuedCount.toString(), color: "" },
              { label: "Processed", value: doneCount.toString(), color: doneCount > 0 ? "text-emerald-600" : "" },
              { label: elapsed > 0 ? formatTime(elapsed) : "—", value: speedKBps ? `${speedKBps} KB/s` : "Time taken", isTime: true, color: "" },
              { label: "Saved", value: totalSaved > 0 ? formatBytes(totalSaved) : "—", color: totalSaved > 0 ? "text-emerald-600" : "" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-2 px-3">
                {stat.isTime ? (
                  <>
                    <span className="text-[17px] font-bold tabular-nums text-foreground leading-tight">{stat.label}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{stat.value}</span>
                  </>
                ) : (
                  <>
                    <span className={cn("text-[17px] font-bold tabular-nums leading-tight", stat.color || "text-foreground")}>{stat.value}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Sort / filter toolbar — only when files exist */}
          {files.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border shrink-0 bg-white">
              {/* Filter */}
              <div className="flex gap-1">
                {(["all", "queued", "done", "error"] as FilterMode[]).map(f => (
                  <button key={f} onClick={() => setFilterMode(f)}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[11px] font-medium capitalize transition-colors",
                      filterMode === f ? "bg-neutral-900 text-white" : "text-muted-foreground hover:bg-neutral-100",
                    )}>
                    {f === "all" ? `All (${files.length})` : f === "done" ? `Done (${doneCount})` : f === "error" ? `Failed (${errorCount})` : `Queued (${queuedCount})`}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              {/* Sort */}
              <div className="flex items-center gap-1">
                <select
                  value={sortMode}
                  onChange={e => setSortMode(e.target.value as SortMode)}
                  className="text-[11px] text-muted-foreground bg-transparent border-none outline-none cursor-pointer"
                >
                  <option value="added">Order added</option>
                  <option value="name">Name</option>
                  <option value="size">Original size</option>
                  <option value="savings">Savings</option>
                </select>
                <button onClick={() => setSortAsc(v => !v)} className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                  {sortAsc ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                </button>
              </div>
            </div>
          )}

          {/* File list / drop zone */}
          <div
            className={cn("flex-1 flex flex-col overflow-hidden", dropDragging && "bg-neutral-50")}
            onDragOver={async e => { e.preventDefault(); setDropDragging(true); }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropDragging(false); }}
            onDrop={async e => {
              e.preventDefault();
              setDropDragging(false);
              const collected = await collectFilesFromDataTransfer(e.dataTransfer.items);
              if (collected.length) addFiles(collected);
              else if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
            }}
          >
            {files.length === 0 ? (
              <div
                className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-4 m-3 rounded-xl border-2 border-dashed border-border text-center transition-colors hover:border-foreground/20 hover:bg-neutral-50/60"
                onClick={() => inputRef.current?.click()}
              >
                <div className="relative">
                  <div className="absolute -top-1.5 -right-1.5 flex size-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-500"><UploadSimple size={14} /></div>
                  <div className="absolute -top-0.5 -right-0.5 flex size-8 items-center justify-center rounded-lg bg-neutral-150 text-neutral-500 opacity-60"><UploadSimple size={14} /></div>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 relative z-10"><UploadSimple size={20} /></div>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-foreground">Drop your files here</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">Drag in one file or a whole batch · click to multi-select</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground/60">{cfg.acceptLabel} · or drop a folder</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500"><UploadSimple size={11} />Bulk upload</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500"><DownloadSimple size={11} />ZIP download</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {displayFiles.map(item => {
                  const flagged = exceedsCap(item);
                  const savings = item.result ? Math.round((1 - item.result.blob.size / item.file.size) * 100) : null;
                  const overrideQ = fileQuality[item.id];
                  const isExpanded = expandedId === item.id;
                  const thumbSrc = item.result?.url ?? item.previewUrl ?? null;

                  return (
                    <div key={item.id}>
                      <div
                        draggable
                        onDragStart={() => onItemDragStart(item.id)}
                        onDragEnd={onItemDragEnd}
                        onDragOver={e => onItemDragOver(e, item.id)}
                        onDrop={() => onItemDrop(item.id)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all",
                          "bg-white ring-1 ring-black/5",
                          item.id === dragOverId && "ring-2 ring-foreground/20 translate-y-px",
                          item.id === draggedId && "opacity-40",
                          flagged && "ring-2 ring-red-400/50 bg-red-50/40",
                        )}
                      >
                        <DotsSixVertical size={14} className="shrink-0 text-neutral-300 cursor-grab active:cursor-grabbing" />

                        {/* Thumbnail with format badge */}
                        <div
                          className="relative size-9 shrink-0 cursor-pointer"
                          onClick={() => thumbSrc && setLightboxSrc(thumbSrc)}
                        >
                          {item.previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.previewUrl} alt="" className="size-9 rounded-md object-cover bg-neutral-100 hover:opacity-80 transition-opacity" />
                          ) : (
                            <div className="size-9 rounded-md bg-neutral-100 flex items-center justify-center"><UploadSimple size={12} className="text-neutral-300" /></div>
                          )}
                          <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-neutral-800 text-white px-1 py-px rounded leading-tight">
                            {getFormat(item.file)}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-[12px] font-medium text-foreground leading-tight">{getOutputName(item)}</p>
                          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                            {formatBytes(item.file.size)}
                            {item.status === "done" && item.result && (
                              <> → {formatBytes(item.result.blob.size)} · <span className={savings !== null && savings > 0 ? "text-emerald-600" : "text-amber-600"}>{savings !== null && savings > 0 ? `${savings}% smaller` : `${savings !== null ? Math.abs(savings) : 0}% larger`}</span>{flagged && <span className="text-red-500"> · exceeds {capKB}KB limit</span>}</>
                            )}
                            {item.status === "error" && <span className="text-red-500"> · {item.error}</span>}
                            {overrideQ !== undefined && <span className="text-muted-foreground/60"> · {overrideQ}% quality</span>}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {item.status === "converting" && <CircleNotch size={15} className="animate-spin text-neutral-400 mx-1" />}
                          {item.status === "queued" && <span className="text-[10px] text-muted-foreground/50 px-1">queued</span>}
                          {item.status === "done" && (
                            <>
                              <Check size={15} className="text-emerald-500 mx-1" />
                              {item.previewUrl && (
                                <button onClick={() => setCompareItemId(item.id)} title="Compare before / after" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                                  <FrameCorners size={16} />
                                </button>
                              )}
                              <button onClick={() => copyToClipboard(item)} title="Copy to clipboard" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                                {copiedId === item.id ? <Check size={15} className="text-emerald-500" /> : <ClipboardText size={15} />}
                              </button>
                              <button onClick={() => downloadOne(item)} title="Download" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                                <DownloadSimple size={16} />
                              </button>
                            </>
                          )}
                          {item.status === "error" && (
                            <button onClick={() => retryFile(item.id)} title="Retry" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-amber-600 transition-colors">
                              <ArrowCounterClockwise size={16} />
                            </button>
                          )}
                          {/* Per-file quality override */}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            title="Override quality for this file"
                            className={cn("rounded-lg p-1.5 transition-colors", isExpanded ? "bg-neutral-900 text-white" : "text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600")}
                          >
                            <SlidersHorizontal size={14} />
                          </button>
                          <button onClick={() => removeFile(item.id)} aria-label="Remove" className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Per-file quality expansion */}
                      {isExpanded && (
                        <div className="mx-2 mb-1 px-3 py-2.5 rounded-b-xl bg-neutral-50 ring-1 ring-black/5 flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground shrink-0">Quality override</span>
                          <input
                            type="range" min={50} max={100}
                            value={overrideQ ?? settings.quality}
                            onChange={e => setFileQuality(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
                            className="flex-1 h-1.5 cursor-pointer accent-foreground"
                          />
                          <span className="text-[11px] tabular-nums text-muted-foreground w-8 text-right">{overrideQ ?? settings.quality}%</span>
                          {overrideQ !== undefined && (
                            <button onClick={() => setFileQuality(prev => { const n = { ...prev }; delete n[item.id]; return n; })} className="text-[11px] text-muted-foreground hover:text-foreground">reset</button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add more strip */}
                <div
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-[12px] text-muted-foreground hover:bg-neutral-50/60 hover:border-foreground/20 transition-colors"
                  onClick={() => inputRef.current?.click()}
                >
                  <UploadSimple size={13} />Add more {cfg.acceptLabel}
                </div>
              </div>
            )}
          </div>

          {/* Undo toast */}
          {undoItem && (
            <div className="shrink-0 mx-3 mb-3 flex items-center justify-between gap-3 rounded-xl bg-neutral-900 px-3 py-2 text-[12px] text-white shadow-lg">
              <span className="truncate opacity-80">Removed <strong className="opacity-100">{undoItem.file.name}</strong></span>
              <button onClick={undoRemove} className="shrink-0 font-medium text-white underline underline-offset-2 hover:no-underline transition-all">Undo</button>
            </div>
          )}
        </div>

        {/* ── Settings panel ──────────────────────────────────────────────────── */}
        <div className="w-[320px] shrink-0 flex flex-col border-l border-border">
          <div className="flex-1 overflow-y-auto p-3 space-y-3.5">

            {/* Presets */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Preset</p>
              <div className="flex gap-1.5">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => setSettings(s => ({ ...s, quality: p.quality }))}
                    className={cn(
                      "flex-1 flex flex-col items-center rounded-lg px-1 py-1.5 transition-colors",
                      settings.quality === p.quality ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                    )}
                  >
                    <span className="text-[11px] font-medium leading-tight text-center">{p.label}</span>
                    <span className={cn("text-[10px] tabular-nums mt-0.5", settings.quality === p.quality ? "text-white/60" : "text-neutral-400")}>{p.quality}%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quality</p>
                <span className="text-[11px] tabular-nums text-muted-foreground">{settings.quality}%</span>
              </div>
              <input type="range" min={0} max={100} value={qualityToSlider(settings.quality)}
                onChange={e => setSettings(s => ({ ...s, quality: sliderToQuality(Number(e.target.value)) }))}
                className="w-full h-1.5 cursor-pointer accent-foreground"
              />
              <div className="flex justify-between mt-0.5">
                <span className="text-[10px] text-muted-foreground/60">Smaller</span>
                <span className="text-[10px] text-muted-foreground/60">Higher quality</span>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Dimensions (px)</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground/70 mb-0.5">W</p>
                  <input type="number" min={1} placeholder="Auto" value={settings.width}
                    onChange={e => setSettings(s => ({ ...s, width: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground/70 mb-0.5">H</p>
                  <input type="number" min={1} placeholder="Auto" value={settings.height}
                    onChange={e => setSettings(s => ({ ...s, height: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5 leading-tight">One field = aspect ratio preserved.</p>
            </div>

            {/* Naming */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">File naming</p>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name={`naming-${type}`} value="original" checked={settings.namingMode === "original"}
                    onChange={() => setSettings(s => ({ ...s, namingMode: "original" }))} className="accent-foreground" />
                  <span className="text-[12px] text-foreground">Original + number</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name={`naming-${type}`} value="prefix" checked={settings.namingMode === "prefix"}
                    onChange={() => setSettings(s => ({ ...s, namingMode: "prefix" }))} className="accent-foreground" />
                  <span className="text-[12px] text-foreground">Custom prefix</span>
                </label>
                {settings.namingMode === "prefix" && (
                  <input type="text" placeholder="image" value={settings.prefix}
                    onChange={e => setSettings(s => ({ ...s, prefix: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                  />
                )}
              </div>
            </div>

            {/* Size cap */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Size cap</p>
              <div className="flex items-center gap-1.5">
                <input type="number" min={1} placeholder="e.g. 300" value={settings.sizeCapKB}
                  onChange={e => setSettings(s => ({ ...s, sizeCapKB: e.target.value }))}
                  className="flex-1 min-w-0 rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                />
                <span className="text-[12px] text-muted-foreground shrink-0">KB</span>
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5 leading-tight">Files over this are flagged red.</p>
            </div>

            {/* Strip metadata */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={settings.stripMeta}
                onChange={e => setSettings(s => ({ ...s, stripMeta: e.target.checked }))}
                className="accent-foreground size-3.5"
              />
              <span className="text-[12px] text-foreground">Strip metadata</span>
            </label>

          </div>

          {/* Action buttons */}
          <div className="p-3 border-t border-border space-y-2 shrink-0">
            {converting && (
              <div className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                <div className="h-full bg-neutral-900 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            )}
            <SoftPillButton
              variant="primary"
              onClick={converting ? () => { abortRef.current = true; } : handleConvert}
              disabled={!files.length || (!converting && queuedCount === 0)}
              className="w-full h-9 text-[12px]"
            >
              {converting ? (
                <><CircleNotch size={12} className="animate-spin" />{batchDone} / {batchTotal} — Stop (Esc)</>
              ) : (
                <>Optimize Now{queuedCount > 0 && <span className="opacity-60 ml-1">({queuedCount})</span>}</>
              )}
            </SoftPillButton>
            <SoftPillButton variant="secondary" onClick={doneCount > 0 ? downloadZip : undefined} disabled={doneCount === 0} className="w-full h-9 text-[12px]">
              <DownloadSimple size={12} />
              {doneCount > 0 ? `Download all as ZIP (${doneCount})` : "Download all as ZIP"}
            </SoftPillButton>
            <p className="text-center text-[10px] text-muted-foreground/50">Enter to start · Esc to stop</p>
          </div>
        </div>
        </div>{/* end two-panel area */}
      </div>

      {/* Hidden inputs */}
      <input ref={inputRef} type="file" multiple accept={cfg.accept} className="hidden"
        onChange={e => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
      />
      <input ref={folderInputRef} type="file" multiple className="hidden"
        // @ts-expect-error webkitdirectory is non-standard
        webkitdirectory=""
        onChange={e => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
      />

      {/* Modals */}
      {compareItem && <BeforeAfterModal item={compareItem} onClose={() => setCompareItemId(null)} />}
      {lightboxSrc && <LightboxModal src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
}
