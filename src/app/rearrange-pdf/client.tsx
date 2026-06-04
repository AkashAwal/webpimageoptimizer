"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { UploadSimple, FilePdf, DownloadSimple, CircleNotch, CaretLeft, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

interface PageItem {
  originalIndex: number;
  thumbnail: string;
  deleted: boolean;
}

export default function RearrangePdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (f: File) => {
    setFile(f); setResult(null); setError(null); setPages([]);
    setLoading(true); setProgress(0);
    try {
      const { getPdfJs } = await import("@/lib/pdf-utils");
      const lib = await getPdfJs();
      const bytes = await f.arrayBuffer();
      const pdf = await lib.getDocument({ data: bytes }).promise;
      const total = pdf.numPages;
      const items: PageItem[] = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
        items.push({ originalIndex: i - 1, thumbnail: canvas.toDataURL("image/jpeg", 0.75), deleted: false });
        page.cleanup();
        setProgress(Math.round((i / total) * 100));
      }
      setPages(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load PDF.");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleDelete = (idx: number) => {
    setPages(prev => prev.map((p, i) => i === idx ? { ...p, deleted: !p.deleted } : p));
  };

  const onItemDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setPages(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null); setDragOverIdx(null);
  };

  const process = async () => {
    if (!file || processing) return;
    const activePages = pages.filter(p => !p.deleted);
    if (!activePages.length) { setError("You must keep at least one page."); return; }
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, activePages.map(p => p.originalIndex));
      copied.forEach(p => out.addPage(p));
      const blob = new Blob([(await out.save()) as unknown as BlobPart], { type: "application/pdf" });
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  const deletedCount = pages.filter(p => p.deleted).length;
  const activeCount = pages.length - deletedCount;

  return (
    <div className="pt-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <CaretLeft size={11} weight="bold" />All tools
          </Link>
          <span className="text-neutral-300 text-[12px]">/</span>
          <h1 className="text-[14px] font-semibold text-foreground truncate">Rearrange & Remove Pages</h1>
          {pages.length > 0 && (
            <span className="hidden sm:inline text-[12px] text-muted-foreground shrink-0">
              — {activeCount} page{activeCount !== 1 ? "s" : ""}
              {deletedCount > 0 && <span className="text-red-500"> · {deletedCount} to remove</span>}
            </span>
          )}
        </div>

        {file && !loading && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-[12px] text-muted-foreground">
              <FilePdf size={14} className="text-red-400 shrink-0" />
              <span className="truncate max-w-[180px]">{file.name}</span>
              <span className="text-neutral-300">·</span>
              <span>{formatBytes(file.size)}</span>
            </div>
            <button onClick={() => { setFile(null); setPages([]); setResult(null); }}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <X size={13} />
            </button>
            {result ? (
              <SoftPillButton variant="primary" onClick={() => {
                const a = document.createElement("a"); a.href = result.url; a.download = "rearranged.pdf"; a.click();
              }} className="h-8 px-3 text-[12px]">
                <DownloadSimple size={12} />Download
              </SoftPillButton>
            ) : (
              <SoftPillButton variant="primary" onClick={process} disabled={processing} className="h-8 px-3 text-[12px]">
                {processing ? <><CircleNotch size={12} className="animate-spin" />Saving…</> : "Save Changes"}
              </SoftPillButton>
            )}
          </div>
        )}
      </div>

      {/* Landing screen */}
      {!file && (
        <div
          className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-8rem)] rounded-2xl transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
        >
          <div className="text-center space-y-3 max-w-lg">
            <h2 className="text-5xl font-bold tracking-tight text-foreground">Manage PDF Pages</h2>
            <p className="text-[18px] text-muted-foreground">Drag to reorder and click × to remove pages — all in one view.</p>
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
      {!loading && pages.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {pages.map((page, idx) => (
            <div
              key={`${idx}-${page.originalIndex}`}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              onDragOver={e => { e.preventDefault(); setDragOverIdx(idx); }}
              onDrop={() => onItemDrop(idx)}
              className={cn(
                "relative group rounded-xl overflow-hidden ring-1 cursor-grab active:cursor-grabbing transition-all select-none",
                page.deleted ? "ring-red-200 opacity-40" : "ring-black/10 hover:ring-black/20",
                dragIdx === idx && "opacity-30 scale-95",
                dragOverIdx === idx && dragIdx !== idx && "ring-2 ring-neutral-400 scale-[1.02]",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={page.thumbnail} alt={`Page ${idx + 1}`} className="w-full block" />

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1.5">
                <span className="text-[10px] font-semibold text-white">{idx + 1}</span>
              </div>

              <button
                onClick={e => { e.stopPropagation(); toggleDelete(idx); }}
                className={cn(
                  "absolute top-1.5 right-1.5 size-5 rounded-full flex items-center justify-center text-white transition-all",
                  page.deleted ? "bg-red-500 opacity-100" : "bg-black/50 opacity-0 group-hover:opacity-100",
                )}
              >
                <X size={9} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>
      )}

      {/* Privacy note */}
      {file && !loading && (
        <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
          All processing happens locally in your browser. No files leave your device.
        </p>
      )}

      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}
