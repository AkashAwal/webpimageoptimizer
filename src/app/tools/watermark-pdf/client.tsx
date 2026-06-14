"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { FilePdf, DownloadSimple, CircleNotch, CaretLeft, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

const POSITIONS: { id: Position; label: string }[] = [
  { id: "top-left", label: "↖" }, { id: "top-right", label: "↗" },
  { id: "center", label: "⊙" },
  { id: "bottom-left", label: "↙" }, { id: "bottom-right", label: "↘" },
];

const POSITION_CLASSES: Record<Position, string> = {
  "center":       "inset-0 flex items-center justify-center",
  "top-left":     "top-2 left-2",
  "top-right":    "top-2 right-2",
  "bottom-left":  "bottom-2 left-2",
  "bottom-right": "bottom-2 right-2",
};

export default function WatermarkPdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [position, setPosition] = useState<Position>("center");
  const [opacity, setOpacity] = useState(30);
  const [size, setSize] = useState(48);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (f: File) => {
    setFile(f); setResult(null); setError(null); setThumbnails([]);
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
        const vp = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
        items.push(canvas.toDataURL("image/jpeg", 0.75));
        page.cleanup();
        setProgress(Math.round((i / total) * 100));
      }
      setThumbnails(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load PDF.");
    } finally {
      setLoading(false);
    }
  }, []);

  const process = async () => {
    if (!file || processing) return;
    if (!text.trim()) { setError("Please enter watermark text."); return; }
    setProcessing(true); setError(null);
    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const alpha = opacity / 100;

      doc.getPages().forEach(page => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);
        const textHeight = font.heightAtSize(size);
        const pad = 20;
        let x: number, y: number, rot = 0;
        if (position === "center") {
          x = width / 2 - textWidth / 2;
          y = height / 2 - textHeight / 2;
          rot = 45;
        } else {
          const left = position.includes("left");
          const top = position.includes("top");
          x = left ? pad : width - textWidth - pad;
          y = top ? height - textHeight - pad : pad;
        }
        page.drawText(text, {
          x, y, size, font,
          color: rgb(1 - alpha * 0.8, 1 - alpha * 0.8, 1 - alpha * 0.8),
          opacity: alpha,
          rotate: degrees(rot),
        });
      });

      const blob = new Blob([(await doc.save()) as unknown as BlobPart], { type: "application/pdf" });
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

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
            <h2 className="text-5xl font-bold tracking-tight text-foreground">Watermark PDF</h2>
            <p className="text-[18px] text-muted-foreground">Stamp custom text across every page of your PDF.</p>
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
        <div className="flex flex-col sm:flex-row min-h-[calc(100vh-4rem)]">
          {/* Left: page thumbnails */}
          <div className="flex-1 px-6 sm:px-10 pt-6 pb-10 min-w-0">
            {/* Nav */}
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <CaretLeft size={11} weight="bold" />All tools
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Watermark PDF</span>
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
              <div className="grid grid-cols-4 gap-3">
                {thumbnails.map((thumb, idx) => (
                  <div key={idx} className="relative aspect-[3/4] overflow-hidden ring-1 ring-black/10 select-none bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb} alt={`Page ${idx + 1}`} className="absolute inset-0 w-full h-full object-contain" />

                    {/* Watermark overlay preview */}
                    {text.trim() && (
                      <div className={cn("absolute pointer-events-none", POSITION_CLASSES[position])}>
                        <span
                          className="text-[8px] font-bold text-neutral-600 whitespace-nowrap leading-none"
                          style={{
                            opacity: opacity / 100,
                            transform: position === "center" ? "rotate(45deg)" : undefined,
                            fontSize: `${Math.max(5, size * 0.14)}px`,
                          }}
                        >
                          {text}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 z-10">
                      <span className="text-[10px] font-semibold text-neutral-500">{idx + 1}</span>
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
          <div className="w-full sm:w-80 shrink-0 border-t sm:border-t-0 sm:border-l border-border bg-white sm:sticky sm:top-16 sm:h-[calc(100vh-4rem)] flex flex-col p-6 gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Watermark PDF</h2>
              <button onClick={() => { setFile(null); setThumbnails([]); setResult(null); }}
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

            {/* Watermark text */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Watermark text</p>
              <input type="text" placeholder="e.g. CONFIDENTIAL"
                value={text} onChange={e => setText(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
              />
            </div>

            {/* Position + sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Position</p>
                <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-fit">
                  {POSITIONS.map(p => (
                    <button key={p.id} onClick={() => setPosition(p.id)}
                      className={cn("size-7 rounded flex items-center justify-center text-[13px] transition-colors",
                        p.id === "top-left"     && "col-start-1 row-start-1",
                        p.id === "top-right"    && "col-start-3 row-start-1",
                        p.id === "center"       && "col-start-2 row-start-2",
                        p.id === "bottom-left"  && "col-start-1 row-start-3",
                        p.id === "bottom-right" && "col-start-3 row-start-3",
                        position === p.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200")}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Opacity</p>
                    <span className="text-[11px] text-muted-foreground">{opacity}%</span>
                  </div>
                  <input type="range" min={5} max={100} value={opacity} onChange={e => setOpacity(Number(e.target.value))}
                    className="w-full h-1.5 cursor-pointer accent-foreground" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Size (pt)</p>
                    <span className="text-[11px] text-muted-foreground">{size}</span>
                  </div>
                  <input type="range" min={12} max={120} value={size} onChange={e => setSize(Number(e.target.value))}
                    className="w-full h-1.5 cursor-pointer accent-foreground" />
                </div>
              </div>
            </div>

            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">Ready · {formatBytes(result.blob.size)}</p>
                <SoftPillButton variant="primary" onClick={() => {
                  const a = document.createElement("a"); a.href = result.url; a.download = "watermarked.pdf"; a.click();
                }} className="h-8 px-3 text-[12px]">
                  <DownloadSimple size={12} />Download
                </SoftPillButton>
              </div>
            )}

            <div className="mt-auto space-y-2">
              <SoftPillButton variant="primary" onClick={process} disabled={processing || loading} className="w-full h-12 text-[14px]">
                {processing ? <><CircleNotch size={14} className="animate-spin" />Processing…</> : "Add Watermark"}
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
