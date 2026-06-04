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

const ANGLES = [90, 180, 270] as const;

export default function RotatePdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [target, setTarget] = useState<"all" | "even" | "odd" | "custom">("all");
  const [customPages, setCustomPages] = useState("");
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
    setProcessing(true); setError(null);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const { parsePageRanges } = await import("@/lib/pdf-utils");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const total = doc.getPageCount();

      let targetIndices: Set<number> | null = null;
      if (target === "custom") {
        const indices = customPages.split(",").flatMap(r => parsePageRanges(r.trim(), total));
        targetIndices = new Set(indices);
      }

      doc.getPages().forEach((page, i) => {
        const n = i + 1;
        const shouldRotate =
          target === "all" ||
          (target === "even" && n % 2 === 0) ||
          (target === "odd" && n % 2 !== 0) ||
          (target === "custom" && targetIndices!.has(i));
        if (shouldRotate) {
          const cur = page.getRotation().angle;
          page.setRotation(degrees((cur + angle) % 360));
        }
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
            <h2 className="text-5xl font-bold tracking-tight text-foreground">Rotate PDF</h2>
            <p className="text-[18px] text-muted-foreground">Fix or change the page orientation of your PDF.</p>
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
          {/* Left: page thumbnails */}
          <div className="flex-1 px-6 sm:px-10 pt-6 pb-10 min-w-0">
            {/* Nav */}
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <CaretLeft size={11} weight="bold" />All tools
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Rotate PDF</span>
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
                {thumbnails.map((thumb, idx) => {
                  const n = idx + 1;
                  const highlighted =
                    target === "all" ||
                    (target === "even" && n % 2 === 0) ||
                    (target === "odd" && n % 2 !== 0);
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "relative overflow-hidden ring-1 select-none transition-all",
                        highlighted ? "ring-neutral-900 ring-2" : "ring-black/10 opacity-40",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb} alt={`Page ${n}`} className="w-full block" />
                      <div className="absolute bottom-0 inset-x-0 px-1.5 py-1">
                        <span className="text-[10px] font-semibold text-neutral-500">{n}</span>
                      </div>
                    </div>
                  );
                })}
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
              <h2 className="text-xl font-bold tracking-tight text-foreground">Rotate PDF</h2>
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

            {/* Rotation */}
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Rotation</p>
              <div className="flex gap-1.5">
                {ANGLES.map(a => (
                  <button key={a} onClick={() => setAngle(a)}
                    className={cn("flex-1 rounded-lg py-1.5 text-[12px] font-medium transition-colors",
                      angle === a ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                    {a}°
                  </button>
                ))}
              </div>
            </div>

            {/* Apply to */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Apply to</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(["all", "even", "odd", "custom"] as const).map(t => (
                  <button key={t} onClick={() => setTarget(t)}
                    className={cn("rounded-lg py-1.5 text-[12px] font-medium capitalize transition-colors",
                      target === t ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                    {t}
                  </button>
                ))}
              </div>
              {target === "custom" && (
                <div>
                  <input
                    type="text"
                    placeholder="e.g. 1, 3-5, 7"
                    value={customPages}
                    onChange={e => setCustomPages(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
                  />
                  <p className="text-[10px] text-muted-foreground/60 mt-1 leading-tight">Comma-separated page numbers or ranges.</p>
                </div>
              )}
            </div>

            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">Ready · {formatBytes(result.blob.size)}</p>
                <SoftPillButton variant="primary" onClick={() => {
                  const a = document.createElement("a"); a.href = result.url; a.download = "rotated.pdf"; a.click();
                }} className="h-8 px-3 text-[12px]">
                  <DownloadSimple size={12} />Download
                </SoftPillButton>
              </div>
            )}

            <div className="mt-auto space-y-2">
              <SoftPillButton variant="primary" onClick={process} disabled={processing || loading} className="w-full h-12 text-[14px]">
                {processing ? <><CircleNotch size={14} className="animate-spin" />Processing…</> : "Rotate PDF"}
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
