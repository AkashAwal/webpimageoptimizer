"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { FilePdf, DownloadSimple, CircleNotch, CaretLeft, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfToImagesClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState(92);
  const [scale, setScale] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const process = async () => {
    if (!file || processing) return;
    setProcessing(true); setError(null); setProgress(0);
    try {
      const { getPdfJs } = await import("@/lib/pdf-utils");
      const { default: JSZip } = await import("jszip");
      const lib = await getPdfJs();
      const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
      const total = pdf.numPages;
      const zip = new JSZip();
      const ext = format === "jpeg" ? "jpg" : format;
      const mime = `image/${format}`;
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport, canvas }).promise;
        const dataUrl = canvas.toDataURL(mime, quality / 100);
        zip.file(`page_${String(i).padStart(3, "0")}.${ext}`, dataUrl.split(",")[1], { base64: true });
        setProgress(Math.round((i / total) * 100));
        page.cleanup();
      }
      const blob = await zip.generateAsync({ type: "blob" });
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to render PDF pages.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-4">
      {/* Landing — no card */}
      {!file && (
        <div
          className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-8rem)] transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setResult(null); } }}
        >
          <div className="text-center space-y-3 max-w-lg">
            <h2 className="text-5xl font-bold tracking-tight text-foreground">PDF to Images</h2>
            <p className="text-[18px] text-muted-foreground">Export every PDF page as a JPG, PNG, or WebP image.</p>
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

      {/* Active — two-column */}
      {file && (
        <div className="flex flex-col sm:flex-row min-h-[calc(100vh-4rem)]">
          {/* Left: file info + progress */}
          <div className="flex-1 px-6 sm:px-10 pt-6 pb-10 space-y-3 min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-2">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0">
                <CaretLeft size={11} weight="bold" />All tools
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">PDF to Images</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white ring-1 ring-black/5">
              <FilePdf size={18} className="shrink-0 text-red-400" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-[12px] font-medium text-foreground">{file.name}</p>
                <p className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setResult(null); }} className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={13} />
              </button>
            </div>
            {processing && (
              <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-neutral-900 transition-all rounded-full" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          {/* Right: sticky sidebar — settings */}
          <div className="w-full sm:w-80 shrink-0 border-t sm:border-t-0 sm:border-l border-border bg-white sm:sticky sm:top-16 sm:h-[calc(100vh-4rem)] flex flex-col p-6 gap-4 overflow-y-auto">
            <h2 className="text-xl font-bold tracking-tight text-foreground">PDF to Images</h2>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Format</p>
                <div className="flex gap-1">
                  {(["jpeg", "png", "webp"] as const).map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={cn("flex-1 rounded-lg py-1.5 text-[11px] font-medium uppercase transition-colors",
                        format === f ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                      {f === "jpeg" ? "JPG" : f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Scale</p>
                  <span className="text-[11px] text-muted-foreground">{scale}×</span>
                </div>
                <input type="range" min={1} max={3} step={0.5} value={scale} onChange={e => setScale(Number(e.target.value))}
                  className="w-full h-1.5 cursor-pointer accent-foreground" />
              </div>
              {format !== "png" && (
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quality</p>
                    <span className="text-[11px] text-muted-foreground">{quality}%</span>
                  </div>
                  <input type="range" min={60} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))}
                    className="w-full h-1.5 cursor-pointer accent-foreground" />
                </div>
              )}
            </div>

            {error && <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>}
            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">ZIP ready · {formatBytes(result.blob.size)}</p>
                <SoftPillButton variant="primary" onClick={() => {
                  const a = document.createElement("a"); a.href = result.url; a.download = "pages.zip"; a.click();
                }} className="h-8 px-3 text-[12px]">
                  <DownloadSimple size={12} />Download
                </SoftPillButton>
              </div>
            )}

            <div className="mt-auto space-y-2">
              <SoftPillButton variant="primary" onClick={process} disabled={processing} className="w-full h-12 text-[14px]">
                {processing ? <><CircleNotch size={14} className="animate-spin" />{progress}% — rendering…</> : "Convert to Images"}
              </SoftPillButton>
              <p className="text-center text-[11px] text-muted-foreground/60">Runs locally · no upload</p>
            </div>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setResult(null); } e.target.value = ""; }} />
    </div>
  );
}
