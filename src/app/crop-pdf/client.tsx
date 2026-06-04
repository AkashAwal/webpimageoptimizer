"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { FilePdf, DownloadSimple, CircleNotch, CaretLeft, X } from "@phosphor-icons/react";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

interface CropBox { x1: number; y1: number; x2: number; y2: number; }

const DEFAULT_BOX: CropBox = { x1: 0, y1: 0, x2: 1, y2: 1 };
const MIN_SIZE = 0.04;

const HANDLES = [
  { id: "nw", cx: "x1", cy: "y1", cursor: "nw-resize" },
  { id: "n",  cx: "xm", cy: "y1", cursor: "n-resize"  },
  { id: "ne", cx: "x2", cy: "y1", cursor: "ne-resize" },
  { id: "e",  cx: "x2", cy: "ym", cursor: "e-resize"  },
  { id: "se", cx: "x2", cy: "y2", cursor: "se-resize" },
  { id: "s",  cx: "xm", cy: "y2", cursor: "s-resize"  },
  { id: "sw", cx: "x1", cy: "y2", cursor: "sw-resize" },
  { id: "w",  cx: "x1", cy: "ym", cursor: "w-resize"  },
] as const;

function handleLeft(id: string, x1: number, x2: number) {
  if (id === "x1") return x1;
  if (id === "x2") return x2;
  return (x1 + x2) / 2;
}
function handleTop(id: string, y1: number, y2: number) {
  if (id === "y1") return y1;
  if (id === "y2") return y2;
  return (y1 + y2) / 2;
}

export default function CropPdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const cropBoxRef = useRef<CropBox>(DEFAULT_BOX);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cropBox, _setCropBox] = useState<CropBox>(DEFAULT_BOX);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setCropBox = (b: CropBox) => { cropBoxRef.current = b; _setCropBox(b); };

  const loadFile = useCallback(async (f: File) => {
    setFile(f); setResult(null); setError(null); setThumbnails([]); setCropBox(DEFAULT_BOX);
    setLoading(true); setProgress(0);
    try {
      const { getPdfJs } = await import("@/lib/pdf-utils");
      const lib = await getPdfJs();
      const bytes = await f.arrayBuffer();
      const pdf = await lib.getDocument({ data: bytes }).promise;
      const total = pdf.numPages;
      const items: string[] = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 0.6 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
        items.push(canvas.toDataURL("image/jpeg", 0.85));
        page.cleanup();
        setProgress(Math.round((i / total) * 100));
      }
      setThumbnails(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load PDF.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDrag = (e: React.PointerEvent<HTMLElement>, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    const card = (e.currentTarget as HTMLElement).closest("[data-crop-card]") as HTMLElement;
    const rect = card.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startBox = { ...cropBoxRef.current };
    const cardW = rect.width;
    const cardH = rect.height;

    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / cardW;
      const dy = (ev.clientY - startY) / cardH;
      let { x1, y1, x2, y2 } = startBox;

      if (handle === "move") {
        const w = x2 - x1, h = y2 - y1;
        x1 = Math.max(0, Math.min(1 - w, x1 + dx));
        y1 = Math.max(0, Math.min(1 - h, y1 + dy));
        x2 = x1 + w; y2 = y1 + h;
      } else {
        if (handle.includes("w")) x1 = Math.max(0, Math.min(x2 - MIN_SIZE, x1 + dx));
        if (handle.includes("e")) x2 = Math.min(1, Math.max(x1 + MIN_SIZE, x2 + dx));
        if (handle.includes("n")) y1 = Math.max(0, Math.min(y2 - MIN_SIZE, y1 + dy));
        if (handle.includes("s")) y2 = Math.min(1, Math.max(y1 + MIN_SIZE, y2 + dy));
      }

      setCropBox({ x1, y1, x2, y2 });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const process = async () => {
    if (!file || processing) return;
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const { x1, y1, x2, y2 } = cropBox;
      doc.getPages().forEach(page => {
        const { width, height } = page.getSize();
        page.setCropBox(x1 * width, (1 - y2) * height, (x2 - x1) * width, (y2 - y1) * height);
      });
      const blob = new Blob([(await doc.save()) as unknown as BlobPart], { type: "application/pdf" });
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to crop PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const { x1, y1, x2, y2 } = cropBox;

  return (
    <div>
      {/* Landing screen */}
      {!file && (
        <div
          className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-8rem)] rounded-2xl transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
        >
          <div className="text-center space-y-3 max-w-lg">
            <h2 className="text-5xl font-bold tracking-tight text-foreground">Crop PDF</h2>
            <p className="text-[18px] text-muted-foreground">Trim the margins of every page in your PDF.</p>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full max-w-md h-16 rounded-2xl bg-foreground text-white text-[16px] font-semibold hover:bg-foreground/90 active:scale-[0.99] transition-all"
          >
            Select PDF File
          </button>
          <p className="text-[13px] text-muted-foreground">or drag and drop your PDF here</p>
        </div>
      )}

      {/* Active: two-column layout */}
      {file && (
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left: page thumbnails with interactive crop */}
          <div className="flex-1 px-6 sm:px-10 pt-6 pb-10 min-w-0">
            {/* Nav */}
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <CaretLeft size={11} weight="bold" />All tools
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Crop PDF</span>
              {thumbnails.length > 0 && (
                <span className="text-muted-foreground">— {thumbnails.length} page{thumbnails.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {/* Loading progress */}
            {loading && (
              <div className="space-y-3 py-12">
                <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden max-w-sm mx-auto">
                  <div className="h-full bg-neutral-900 transition-all rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[12px] text-center text-muted-foreground">Rendering pages… {progress}%</p>
              </div>
            )}

            {/* Page grid */}
            {!loading && thumbnails.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {thumbnails.map((thumb, idx) => (
                  <div
                    key={idx}
                    data-crop-card
                    className="relative overflow-hidden ring-1 ring-black/10 select-none bg-neutral-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb} alt={`Page ${idx + 1}`} className="w-full block pointer-events-none" />

                    {/* Dark overlay outside crop — 4 strips */}
                    <div className="absolute inset-x-0 top-0 bg-black/50 pointer-events-none" style={{ height: `${y1 * 100}%` }} />
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 pointer-events-none" style={{ height: `${(1 - y2) * 100}%` }} />
                    <div className="absolute left-0 bg-black/50 pointer-events-none" style={{ top: `${y1 * 100}%`, bottom: `${(1 - y2) * 100}%`, width: `${x1 * 100}%` }} />
                    <div className="absolute right-0 bg-black/50 pointer-events-none" style={{ top: `${y1 * 100}%`, bottom: `${(1 - y2) * 100}%`, width: `${(1 - x2) * 100}%` }} />

                    {/* Crop box border — also the move target */}
                    <div
                      className="absolute border border-white/90 cursor-move"
                      style={{
                        left: `${x1 * 100}%`,
                        top: `${y1 * 100}%`,
                        width: `${(x2 - x1) * 100}%`,
                        height: `${(y2 - y1) * 100}%`,
                      }}
                      onPointerDown={e => startDrag(e, "move")}
                    />

                    {/* Rule-of-thirds grid lines inside crop */}
                    <div className="absolute border-white/20 pointer-events-none" style={{
                      left: `${x1 * 100}%`, top: `${y1 * 100}%`,
                      width: `${(x2 - x1) * 100}%`, height: `${(y2 - y1) * 100}%`,
                    }}>
                      <div className="absolute inset-y-0 border-l border-white/20" style={{ left: "33.33%" }} />
                      <div className="absolute inset-y-0 border-l border-white/20" style={{ left: "66.66%" }} />
                      <div className="absolute inset-x-0 border-t border-white/20" style={{ top: "33.33%" }} />
                      <div className="absolute inset-x-0 border-t border-white/20" style={{ top: "66.66%" }} />
                    </div>

                    {/* Resize handles */}
                    {HANDLES.map(h => (
                      <div
                        key={h.id}
                        className="absolute z-10 size-3 rounded-full bg-white shadow border border-neutral-300 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${handleLeft(h.cx, x1, x2) * 100}%`,
                          top: `${handleTop(h.cy, y1, y2) * 100}%`,
                          cursor: h.cursor,
                        }}
                        onPointerDown={e => startDrag(e, h.id)}
                      />
                    ))}

                    {/* Page number */}
                    <div className="absolute bottom-1 left-1.5 pointer-events-none z-10">
                      <span className="text-[9px] font-bold text-white drop-shadow">{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="mt-3 text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>
            )}
          </div>

          {/* Right: sticky sidebar */}
          <div className="w-80 shrink-0 border-l border-border bg-white sticky top-16 h-[calc(100vh-4rem)] flex flex-col p-6 gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Crop PDF</h2>
              <button onClick={() => { setFile(null); setThumbnails([]); setResult(null); setCropBox(DEFAULT_BOX); }}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={13} />
              </button>
            </div>

            {file && (
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-neutral-50 ring-1 ring-black/5">
                <FilePdf size={14} className="text-red-400 shrink-0" />
                <p className="truncate text-[12px] text-muted-foreground">{file.name}</p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">How to use</p>
              {[
                { n: "1", text: "Drag the white handles to resize the crop area." },
                { n: "2", text: "Drag inside the bright region to move the crop box." },
                { n: "3", text: "The same crop is applied to every page." },
              ].map(({ n, text }) => (
                <div key={n} className="flex gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-bold text-neutral-500">{n}</span>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCropBox(DEFAULT_BOX)}
              className="text-left text-[12px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Reset crop
            </button>

            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">Ready · {formatBytes(result.blob.size)}</p>
                <SoftPillButton variant="primary" onClick={() => {
                  const a = document.createElement("a"); a.href = result.url; a.download = "cropped.pdf"; a.click();
                }} className="h-8 px-3 text-[12px]">
                  <DownloadSimple size={12} />Download
                </SoftPillButton>
              </div>
            )}

            <div className="mt-auto space-y-2">
              <SoftPillButton variant="primary" onClick={process} disabled={processing || loading} className="w-full h-12 text-[14px]">
                {processing ? <><CircleNotch size={14} className="animate-spin" />Processing…</> : "Crop PDF"}
              </SoftPillButton>
              <p className="text-center text-[11px] text-muted-foreground/60">Runs locally · no upload</p>
            </div>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}
