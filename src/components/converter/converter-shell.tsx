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
  | "jfif-to-webp" | "pdf-to-webp" | "webp-to-webp" | "heic-to-webp"
  | "jpg-to-pdf" | "png-to-pdf" | "webp-to-pdf" | "heic-to-pdf"
  | "bmp-to-pdf" | "tiff-to-pdf" | "gif-to-pdf" | "svg-to-pdf"
  | "avif-to-pdf" | "ico-to-pdf" | "jfif-to-pdf";

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
  // PDF-specific
  pdfType: "standard" | "print";
  pdfPageSize: "fit" | "a4" | "letter" | "legal" | "a3";
  pdfOrientation: "auto" | "portrait" | "landscape";
  pdfMarginMm: number;
  pdfFitMode: "contain" | "fill" | "actual";
  pdfCompress: boolean;
  pdfFlatten: boolean;
  pdfPageNumbers: boolean;
  pdfWatermark: string;
  pdfWatermarkPos: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  pdfPassword: string;
  pdfMetaTitle: string;
  pdfMetaAuthor: string;
  pdfFilename: string;
}

interface PdfOptions {
  password?: string;
  compress: boolean;
  flatten: boolean;
  pageSize: "fit" | "a4" | "letter" | "legal" | "a3";
  orientation: "auto" | "portrait" | "landscape";
  marginMm: number;
  fitMode: "contain" | "fill" | "actual";
  pageNumbers: boolean;
  watermark: string;
  watermarkPos: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  metaTitle: string;
  metaAuthor: string;
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
  const bitmap = await createImageBitmap(source).catch((e: unknown) => {
    throw new Error(e instanceof Error ? e.message : "This file format cannot be decoded in your browser.");
  });
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

// ─── PDF helpers ──────────────────────────────────────────────────────────────

type PdfPage = { dataUrl: string; w: number; h: number };

async function blobToPage(source: Blob, quality: number, targetW?: number, targetH?: number, flatten = false): Promise<PdfPage> {
  const bitmap = await createImageBitmap(source).catch((e: unknown) => {
    throw new Error(e instanceof Error ? e.message : "This file format cannot be decoded in your browser.");
  });
  let w = bitmap.width, h = bitmap.height;
  if (targetW && targetH) { w = targetW; h = targetH; }
  else if (targetW) { h = Math.round(bitmap.height * (targetW / bitmap.width)); w = targetW; }
  else if (targetH) { w = Math.round(bitmap.width * (targetH / bitmap.height)); h = targetH; }
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  if (flatten) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return { dataUrl: canvas.toDataURL("image/jpeg", quality / 100), w, h };
}

async function svgToPage(file: File, quality: number, targetW?: number, targetH?: number, flatten = false): Promise<PdfPage> {
  const url = URL.createObjectURL(file);
  return new Promise<PdfPage>((res, rej) => {
    const img = new window.Image();
    img.onload = () => {
      let w = img.naturalWidth || 800, h = img.naturalHeight || 600;
      if (targetW && targetH) { w = targetW; h = targetH; }
      else if (targetW) { h = Math.round(h * (targetW / w)); w = targetW; }
      else if (targetH) { w = Math.round(w * (targetH / h)); h = targetH; }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      if (flatten) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      res({ dataUrl: canvas.toDataURL("image/jpeg", quality / 100), w, h });
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Failed to load SVG")); };
    img.src = url;
  });
}

async function heicToPage(file: File, quality: number, targetW?: number, targetH?: number, flatten = false): Promise<PdfPage> {
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/png" });
  return blobToPage(Array.isArray(out) ? out[0] : out, quality, targetW, targetH, flatten);
}

// 1px at 96 DPI = 25.4/96 mm
const MM_PER_PX = 25.4 / 96;

const PAGE_DIMS_MM: Record<string, [number, number]> = {
  a4:     [210,    297],
  a3:     [297,    420],
  letter: [215.9,  279.4],
  legal:  [215.9,  355.6],
};

async function buildPdf(pages: PdfPage[], opts: PdfOptions): Promise<Blob> {
  const { jsPDF } = await import("jspdf");

  function getPageDims(imgW: number, imgH: number): { pageW: number; pageH: number } {
    if (opts.pageSize === "fit") return { pageW: imgW * MM_PER_PX, pageH: imgH * MM_PER_PX };
    let [pw, ph] = PAGE_DIMS_MM[opts.pageSize];
    const landscape = opts.orientation === "landscape" || (opts.orientation === "auto" && imgW > imgH);
    if (landscape) [pw, ph] = [ph, pw];
    return { pageW: pw, pageH: ph };
  }

  function placeImage(pdf: InstanceType<typeof jsPDF>, page: PdfPage, pageW: number, pageH: number) {
    if (opts.pageSize === "fit") {
      pdf.addImage(page.dataUrl, "JPEG", 0, 0, pageW, pageH);
      return;
    }
    const m = opts.marginMm;
    const availW = pageW - m * 2;
    const availH = pageH - m * 2;
    const imgWmm = page.w * MM_PER_PX;
    const imgHmm = page.h * MM_PER_PX;
    let dw: number, dh: number, dx: number, dy: number;
    if (opts.fitMode === "contain") {
      const s = Math.min(availW / imgWmm, availH / imgHmm);
      dw = imgWmm * s; dh = imgHmm * s;
    } else if (opts.fitMode === "fill") {
      const s = Math.max(availW / imgWmm, availH / imgHmm);
      dw = imgWmm * s; dh = imgHmm * s;
    } else {
      dw = Math.min(imgWmm, availW); dh = Math.min(imgHmm, availH);
    }
    dx = m + (availW - dw) / 2;
    dy = m + (availH - dh) / 2;
    pdf.addImage(page.dataUrl, "JPEG", dx, dy, dw, dh);
  }

  const first = pages[0];
  const firstDims = getPageDims(first.w, first.h);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initOpts: any = {
    orientation: firstDims.pageW >= firstDims.pageH ? "landscape" : "portrait",
    unit: "mm",
    format: [firstDims.pageW, firstDims.pageH],
    compress: opts.compress,
  };
  if (opts.password) {
    initOpts.encryption = {
      userPassword: opts.password,
      ownerPassword: opts.password,
      userPermissions: ["print", "copy"],
    };
  }

  const pdf = new jsPDF(initOpts);

  if (opts.metaTitle || opts.metaAuthor) {
    pdf.setProperties({ title: opts.metaTitle, author: opts.metaAuthor });
  }

  // Add pages
  pages.forEach((page, i) => {
    const { pageW, pageH } = getPageDims(page.w, page.h);
    if (i > 0) pdf.addPage([pageW, pageH], pageW >= pageH ? "landscape" : "portrait");
    placeImage(pdf, page, pageW, pageH);
  });

  const total = pages.length;

  // Page numbers
  if (opts.pageNumbers) {
    for (let i = 0; i < total; i++) {
      pdf.setPage(i + 1);
      const { pageW, pageH } = getPageDims(pages[i].w, pages[i].h);
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 140);
      pdf.text(`${i + 1} / ${total}`, pageW / 2, pageH - 5, { align: "center" });
    }
  }

  // Watermark
  if (opts.watermark) {
    for (let i = 0; i < total; i++) {
      pdf.setPage(i + 1);
      const { pageW, pageH } = getPageDims(pages[i].w, pages[i].h);
      pdf.setTextColor(190, 190, 190);
      const pad = Math.max(5, opts.pageSize === "fit" ? 8 : opts.marginMm + 4);
      if (opts.watermarkPos === "center") {
        const size = Math.max(8, Math.min(pageW, pageH) * 0.09);
        pdf.setFontSize(size);
        pdf.text(opts.watermark, pageW / 2, pageH / 2, { align: "center", angle: 45 });
      } else {
        pdf.setFontSize(10);
        const left  = opts.watermarkPos.includes("left");
        const top   = opts.watermarkPos.includes("top");
        const x = left ? pad : pageW - pad;
        const y = top  ? pad + 6 : pageH - pad;
        pdf.text(opts.watermark, x, y, { align: left ? "left" : "right" });
      }
    }
  }

  return pdf.output("blob");
}

async function fileToPage(file: File, quality: number, targetW?: number, targetH?: number, flatten = false): Promise<PdfPage> {
  const name = file.name.toLowerCase();
  if (file.type === "image/svg+xml" || name.endsWith(".svg")) return svgToPage(file, quality, targetW, targetH, flatten);
  if (name.match(/\.(heic|heif)$/) || file.type === "image/heic" || file.type === "image/heif") return heicToPage(file, quality, targetW, targetH, flatten);
  return blobToPage(file, quality, targetW, targetH, flatten);
}

const DEFAULT_PDF_OPTS: PdfOptions = {
  compress: true, flatten: false, pageSize: "fit", orientation: "auto",
  marginMm: 10, fitMode: "contain", pageNumbers: false, watermark: "",
  watermarkPos: "center", metaTitle: "", metaAuthor: "",
};

async function canvasToPdf(file: File, quality: number, targetW?: number, targetH?: number, opts?: PdfOptions): Promise<Blob> {
  const page = await blobToPage(file, quality, targetW, targetH, opts?.flatten);
  return buildPdf([page], opts ?? DEFAULT_PDF_OPTS);
}

async function svgToPdf(file: File, quality: number, targetW?: number, targetH?: number, opts?: PdfOptions): Promise<Blob> {
  const page = await svgToPage(file, quality, targetW, targetH, opts?.flatten);
  return buildPdf([page], opts ?? DEFAULT_PDF_OPTS);
}

async function heicToPdf(file: File, quality: number, targetW?: number, targetH?: number, opts?: PdfOptions): Promise<Blob> {
  const page = await heicToPage(file, quality, targetW, targetH, opts?.flatten);
  return buildPdf([page], opts ?? DEFAULT_PDF_OPTS);
}

// ─── Config ───────────────────────────────────────────────────────────────────

type ConvertFn = (f: File, q: number, w?: number, h?: number, opts?: PdfOptions) => Promise<Blob>;

const CONFIG: Record<ConvertType, { accept: string; acceptLabel: string; canPreview: boolean; convert: ConvertFn; outputType: "webp" | "pdf" }> = {
  "png-to-webp":  { accept: "image/png,.png",                             acceptLabel: "PNG files",   canPreview: true,  convert: canvasConvert, outputType: "webp" },
  "jpg-to-webp":  { accept: "image/jpeg,.jpg,.jpeg",                      acceptLabel: "JPG / JPEG",  canPreview: true,  convert: canvasConvert, outputType: "webp" },
  "gif-to-webp":  { accept: "image/gif,.gif",                             acceptLabel: "GIF files",   canPreview: true,  convert: canvasConvert, outputType: "webp" },
  "avif-to-webp": { accept: "image/avif,.avif",                           acceptLabel: "AVIF files",  canPreview: true,  convert: canvasConvert, outputType: "webp" },
  "bmp-to-webp":  { accept: "image/bmp,.bmp",                             acceptLabel: "BMP files",   canPreview: true,  convert: canvasConvert, outputType: "webp" },
  "tiff-to-webp": { accept: "image/tiff,.tiff,.tif",                      acceptLabel: "TIFF / TIF",  canPreview: false, convert: canvasConvert, outputType: "webp" },
  "svg-to-webp":  { accept: "image/svg+xml,.svg",                         acceptLabel: "SVG files",   canPreview: true,  convert: svgConvert,    outputType: "webp" },
  "ico-to-webp":  { accept: "image/x-icon,image/vnd.microsoft.icon,.ico", acceptLabel: "ICO files",   canPreview: false, convert: canvasConvert, outputType: "webp" },
  "jfif-to-webp": { accept: "image/jpeg,.jfif",                           acceptLabel: "JFIF files",  canPreview: true,  convert: canvasConvert, outputType: "webp" },
  "pdf-to-webp":  { accept: "application/pdf,.pdf",                       acceptLabel: "PDF files",   canPreview: false, convert: canvasConvert, outputType: "webp" },
  "webp-to-webp": { accept: "image/webp,.webp",                           acceptLabel: "WebP files",  canPreview: true,  convert: canvasConvert, outputType: "webp" },
  "heic-to-webp": { accept: ".heic,.heif,image/heic,image/heif",          acceptLabel: "HEIC / HEIF", canPreview: false, convert: heicConvert,   outputType: "webp" },
  "jpg-to-pdf":   { accept: "image/jpeg,.jpg,.jpeg",                      acceptLabel: "JPG / JPEG",  canPreview: true,  convert: canvasToPdf,   outputType: "pdf"  },
  "png-to-pdf":   { accept: "image/png,.png",                             acceptLabel: "PNG files",   canPreview: true,  convert: canvasToPdf,   outputType: "pdf"  },
  "webp-to-pdf":  { accept: "image/webp,.webp",                           acceptLabel: "WebP files",  canPreview: true,  convert: canvasToPdf,   outputType: "pdf"  },
  "heic-to-pdf":  { accept: ".heic,.heif,image/heic,image/heif",          acceptLabel: "HEIC / HEIF", canPreview: false, convert: heicToPdf,     outputType: "pdf"  },
  "bmp-to-pdf":   { accept: "image/bmp,.bmp",                             acceptLabel: "BMP files",   canPreview: true,  convert: canvasToPdf,   outputType: "pdf"  },
  "tiff-to-pdf":  { accept: "image/tiff,.tiff,.tif",                      acceptLabel: "TIFF / TIF",  canPreview: false, convert: canvasToPdf,   outputType: "pdf"  },
  "gif-to-pdf":   { accept: "image/gif,.gif",                             acceptLabel: "GIF files",   canPreview: true,  convert: canvasToPdf,   outputType: "pdf"  },
  "svg-to-pdf":   { accept: "image/svg+xml,.svg",                         acceptLabel: "SVG files",   canPreview: true,  convert: svgToPdf,      outputType: "pdf"  },
  "avif-to-pdf":  { accept: "image/avif,.avif",                           acceptLabel: "AVIF files",  canPreview: true,  convert: canvasToPdf,   outputType: "pdf"  },
  "ico-to-pdf":   { accept: "image/x-icon,image/vnd.microsoft.icon,.ico", acceptLabel: "ICO files",   canPreview: false, convert: canvasToPdf,   outputType: "pdf"  },
  "jfif-to-pdf":  { accept: "image/jpeg,.jfif",                           acceptLabel: "JFIF files",  canPreview: true,  convert: canvasToPdf,   outputType: "pdf"  },
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
    pdfType: "standard", pdfPageSize: "fit", pdfOrientation: "auto", pdfMarginMm: 10,
    pdfFitMode: "contain", pdfCompress: true, pdfFlatten: false, pdfPageNumbers: false,
    pdfWatermark: "", pdfWatermarkPos: "center", pdfPassword: "", pdfMetaTitle: "", pdfMetaAuthor: "", pdfFilename: "converted",
  });
  const [mergedResult, setMergedResult] = useState<{ blob: Blob; url: string } | null>(null);

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

  const pdfOpts = useCallback((): PdfOptions => ({
    compress: settings.pdfCompress,
    flatten: settings.pdfFlatten,
    password: settings.pdfPassword || undefined,
    pageSize: settings.pdfPageSize,
    orientation: settings.pdfOrientation,
    marginMm: settings.pdfMarginMm,
    fitMode: settings.pdfFitMode,
    pageNumbers: settings.pdfPageNumbers,
    watermark: settings.pdfWatermark,
    watermarkPos: settings.pdfWatermarkPos,
    metaTitle: settings.pdfMetaTitle,
    metaAuthor: settings.pdfMetaAuthor,
  }), [settings]);

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
    const pdfQuality = settings.pdfType === "print" ? 95 : 80;

    // ── PDF: all queued images → one multi-page PDF ──────────────────────────
    if (cfg.outputType === "pdf") {
      const pages: PdfPage[] = [];
      for (const item of queued) {
        if (abortRef.current) break;
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "converting" } : f));
        try {
          const page = await fileToPage(item.file, pdfQuality, targetW, targetH, settings.pdfFlatten);
          pages.push(page);
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "done", result: null } : f));
        } catch (e) {
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "error", error: e instanceof Error ? e.message : "Conversion failed" } : f));
        }
        setBatchDone(prev => prev + 1);
      }
      if (pages.length > 0) {
        const blob = await buildPdf(pages, pdfOpts());
        if (mergedResult?.url) URL.revokeObjectURL(mergedResult.url);
        setMergedResult({ blob, url: URL.createObjectURL(blob) });
      }
      setConverting(false);
      return;
    }

    // ── WebP: per-file conversion ─────────────────────────────────────────────
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
  }, [converting, settings, fileQuality, cfg, pdfOpts, mergedResult]);

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
    const ext = cfg.outputType;
    return settings.namingMode === "original" ? `${base}_${num}.${ext}` : `${settings.prefix || "image"}_${num}.${ext}`;
  }, [settings.namingMode, settings.prefix, cfg.outputType]);

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

  const downloadMergedPdf = useCallback(() => {
    if (!mergedResult) return;
    const a = document.createElement("a");
    a.href = mergedResult.url;
    a.download = `${settings.pdfFilename || "converted"}.pdf`;
    a.click();
  }, [mergedResult, settings.pdfFilename]);

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
              try {
                const collected = await collectFilesFromDataTransfer(e.dataTransfer.items);
                if (collected.length) { addFiles(collected); return; }
              } catch { /* folder traversal failed — fall back to flat file list */ }
              if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
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
                            <img
                              src={item.previewUrl} alt=""
                              className="size-9 rounded-md object-cover bg-neutral-100 hover:opacity-80 transition-opacity"
                              onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
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
                              {item.previewUrl && cfg.outputType === "webp" && (
                                <button onClick={() => setCompareItemId(item.id)} title="Compare before / after" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                                  <FrameCorners size={16} />
                                </button>
                              )}
                              {cfg.outputType === "webp" && (
                                <button onClick={() => copyToClipboard(item)} title="Copy to clipboard" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                                  {copiedId === item.id ? <Check size={15} className="text-emerald-500" /> : <ClipboardText size={15} />}
                                </button>
                              )}
                              {item.result ? (
                                <button onClick={() => downloadOne(item)} title="Download" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                                  <DownloadSimple size={16} />
                                </button>
                              ) : cfg.outputType === "pdf" && (
                                <span className="text-[10px] text-muted-foreground/50 px-1">merged</span>
                              )}
                            </>
                          )}
                          {item.status === "error" && (
                            <button onClick={() => retryFile(item.id)} title="Retry" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-amber-600 transition-colors">
                              <ArrowCounterClockwise size={16} />
                            </button>
                          )}
                          {/* Per-file quality override — WebP only */}
                          {cfg.outputType === "webp" && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              title="Override quality for this file"
                              className={cn("rounded-lg p-1.5 transition-colors", isExpanded ? "bg-neutral-900 text-white" : "text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600")}
                            >
                              <SlidersHorizontal size={14} />
                            </button>
                          )}
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
        <div className={cn("shrink-0 flex flex-col border-l border-border", cfg.outputType === "pdf" ? "w-[560px]" : "w-[320px]")}>
          <div className="flex-1 overflow-y-auto p-3 space-y-3.5">

            {cfg.outputType === "pdf" ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">

                {/* ── Row: PDF Type (full width) ── */}
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">PDF Type</p>
                  <div className="flex gap-1.5">
                    {([
                      { id: "standard", label: "Standard", sub: "Screen & email" },
                      { id: "print",    label: "Print",    sub: "High fidelity"  },
                    ] as const).map(opt => (
                      <button key={opt.id} onClick={() => setSettings(s => ({ ...s, pdfType: opt.id }))}
                        className={cn("flex-1 flex flex-col items-center rounded-lg px-1 py-1.5 transition-colors",
                          settings.pdfType === opt.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                        <span className="text-[11px] font-medium leading-tight">{opt.label}</span>
                        <span className={cn("text-[10px] mt-0.5", settings.pdfType === opt.id ? "text-white/60" : "text-neutral-400")}>{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Row: Page Size | Image Fit ── */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Page size</p>
                  <select value={settings.pdfPageSize}
                    onChange={e => setSettings(s => ({ ...s, pdfPageSize: e.target.value as Settings["pdfPageSize"] }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors cursor-pointer">
                    <option value="fit">Fit to image</option>
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="letter">Letter (216 × 279 mm)</option>
                    <option value="legal">Legal (216 × 356 mm)</option>
                    <option value="a3">A3 (297 × 420 mm)</option>
                  </select>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Image fit</p>
                  <div className="flex gap-1.5">
                    {([
                      { id: "contain", label: "Contain", disabled: settings.pdfPageSize === "fit" },
                      { id: "fill",    label: "Fill",    disabled: settings.pdfPageSize === "fit" },
                      { id: "actual",  label: "1 : 1",   disabled: settings.pdfPageSize === "fit" },
                    ] as const).map(opt => (
                      <button key={opt.id}
                        onClick={() => !opt.disabled && setSettings(s => ({ ...s, pdfFitMode: opt.id }))}
                        disabled={opt.disabled}
                        className={cn("flex-1 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors",
                          opt.disabled ? "bg-neutral-50 text-neutral-300 cursor-not-allowed" :
                          settings.pdfFitMode === opt.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Row: Orientation | Margin ── */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Orientation</p>
                  <div className="flex gap-1.5">
                    {([
                      { id: "auto",      label: "Auto" },
                      { id: "portrait",  label: "Port" },
                      { id: "landscape", label: "Land" },
                    ] as const).map(opt => (
                      <button key={opt.id}
                        onClick={() => settings.pdfPageSize !== "fit" && setSettings(s => ({ ...s, pdfOrientation: opt.id }))}
                        disabled={settings.pdfPageSize === "fit"}
                        className={cn("flex-1 rounded-lg px-1 py-1.5 text-[11px] font-medium transition-colors",
                          settings.pdfPageSize === "fit" ? "bg-neutral-50 text-neutral-300 cursor-not-allowed" :
                          settings.pdfOrientation === opt.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Margin</p>
                    <span className={cn("text-[11px] tabular-nums", settings.pdfPageSize === "fit" ? "text-muted-foreground/30" : "text-muted-foreground")}>{settings.pdfMarginMm} mm</span>
                  </div>
                  <input type="range" min={0} max={40} value={settings.pdfMarginMm}
                    disabled={settings.pdfPageSize === "fit"}
                    onChange={e => setSettings(s => ({ ...s, pdfMarginMm: Number(e.target.value) }))}
                    className="w-full h-1.5 cursor-pointer accent-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-muted-foreground/60">None</span>
                    <span className="text-[10px] text-muted-foreground/60">40 mm</span>
                  </div>
                </div>

                {/* ── Row: Pages (full width) ── */}
                <div className="col-span-2 flex items-center justify-between gap-4 rounded-lg bg-neutral-50 px-3 py-2 ring-1 ring-black/5">
                  <p className="text-[11px] text-muted-foreground/70 leading-relaxed">Drag files in the queue to set page order.</p>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0">
                    <input type="checkbox" checked={settings.pdfPageNumbers}
                      onChange={e => setSettings(s => ({ ...s, pdfPageNumbers: e.target.checked }))}
                      className="accent-foreground size-3.5"
                    />
                    <span className="text-[12px] text-foreground">Page numbers</span>
                  </label>
                </div>

                {/* ── Row: Output | Watermark ── */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Output</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={settings.pdfCompress}
                        onChange={e => setSettings(s => ({ ...s, pdfCompress: e.target.checked }))}
                        className="accent-foreground size-3.5"
                      />
                      <span className="text-[12px] text-foreground">Compress PDF</span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={settings.pdfFlatten}
                        onChange={e => setSettings(s => ({ ...s, pdfFlatten: e.target.checked }))}
                        className="accent-foreground size-3.5 mt-0.5 shrink-0"
                      />
                      <div>
                        <span className="text-[12px] text-foreground">Flatten</span>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-tight">White background — required for printing.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Watermark</p>
                  <input type="text" placeholder="e.g. CONFIDENTIAL"
                    value={settings.pdfWatermark}
                    onChange={e => setSettings(s => ({ ...s, pdfWatermark: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors mb-1.5"
                  />
                  {/* Position picker — 2×2 corners + center */}
                  <div className={cn("grid gap-0.5", "grid-cols-[1fr_auto_1fr]")}>
                    {/* Top row */}
                    {(["top-left", "top-right"] as const).map((pos, i) => (
                      <button key={pos}
                        onClick={() => setSettings(s => ({ ...s, pdfWatermarkPos: pos }))}
                        className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors", i === 1 && "col-start-3",
                          settings.pdfWatermarkPos === pos ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200")}>
                        {i === 0 ? "↖ Top left" : "Top right ↗"}
                      </button>
                    ))}
                    {/* Center */}
                    <button onClick={() => setSettings(s => ({ ...s, pdfWatermarkPos: "center" }))}
                      className={cn("col-span-3 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                        settings.pdfWatermarkPos === "center" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200")}>
                      ⊙ Center diagonal
                    </button>
                    {/* Bottom row */}
                    {(["bottom-left", "bottom-right"] as const).map((pos, i) => (
                      <button key={pos}
                        onClick={() => setSettings(s => ({ ...s, pdfWatermarkPos: pos }))}
                        className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors", i === 1 && "col-start-3",
                          settings.pdfWatermarkPos === pos ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200")}>
                        {i === 0 ? "↙ Bot left" : "Bot right ↘"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Row: Password | Metadata ── */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Password</p>
                  <input type="password" placeholder="Leave blank for none"
                    value={settings.pdfPassword}
                    onChange={e => setSettings(s => ({ ...s, pdfPassword: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Metadata</p>
                  <div className="space-y-1.5">
                    <input type="text" placeholder="Title"
                      value={settings.pdfMetaTitle}
                      onChange={e => setSettings(s => ({ ...s, pdfMetaTitle: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                    />
                    <input type="text" placeholder="Author"
                      value={settings.pdfMetaAuthor}
                      onChange={e => setSettings(s => ({ ...s, pdfMetaAuthor: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* ── Row: Source dimensions | Output filename ── */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Source dimensions (px)</p>
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

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Output filename</p>
                  <input type="text" placeholder="converted" value={settings.pdfFilename}
                    onChange={e => setSettings(s => ({ ...s, pdfFilename: e.target.value }))}
                    className="w-full rounded-lg border border-border bg-neutral-50 px-2 py-1 text-[12px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                  />
                  <p className="text-[10px] text-muted-foreground/50 mt-0.5 leading-tight">Saved as {settings.pdfFilename || "converted"}.pdf</p>
                </div>

              </div>
            ) : (
              <>
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
              </>
            )}

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
                <>
                  {cfg.outputType === "pdf" ? "Convert to PDF" : "Optimize Now"}
                  {queuedCount > 0 && <span className="opacity-60 ml-1">({queuedCount})</span>}
                </>
              )}
            </SoftPillButton>
            {cfg.outputType === "pdf" ? (
              <SoftPillButton variant="secondary" onClick={mergedResult ? downloadMergedPdf : undefined} disabled={!mergedResult} className="w-full h-9 text-[12px]">
                <DownloadSimple size={12} />
                {mergedResult ? `Download PDF (${files.filter(f => f.status === "done").length} pages)` : "Download PDF"}
              </SoftPillButton>
            ) : (
              <SoftPillButton variant="secondary" onClick={doneCount > 0 ? downloadZip : undefined} disabled={doneCount === 0} className="w-full h-9 text-[12px]">
                <DownloadSimple size={12} />
                {doneCount > 0 ? `Download all as ZIP (${doneCount})` : "Download all as ZIP"}
              </SoftPillButton>
            )}
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
