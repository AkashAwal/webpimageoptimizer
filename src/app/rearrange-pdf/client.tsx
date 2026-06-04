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
    <div>
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

      {/* Active: two-column layout */}
      {file && (
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Left: page grid */}
          <div className="flex-1 px-6 sm:px-10 pt-6 pb-10 min-w-0">
            {/* Nav */}
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <CaretLeft size={11} weight="bold" />All tools
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Manage PDF Pages</span>
              {pages.length > 0 && (
                <span className="text-muted-foreground">
                  — {activeCount} page{activeCount !== 1 ? "s" : ""}
                  {deletedCount > 0 && <span className="text-red-500"> · {deletedCount} to remove</span>}
                </span>
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
          </div>

          {/* Right: sticky sidebar — instructions */}
          <div className="w-80 shrink-0 border-l border-border bg-white sticky top-16 h-[calc(100vh-4rem)] flex flex-col p-6 gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Manage Pages</h2>
              <button onClick={() => { setFile(null); setPages([]); setResult(null); }}
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
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">How to use</p>
              {[
                { n: "1", text: "Drop your PDF — every page is rendered as a thumbnail." },
                { n: "2", text: "Drag cards to reorder pages into your preferred sequence." },
                { n: "3", text: "Hover a card and click × to mark a page for removal." },
                { n: "4", text: "Click Save Changes to download the updated PDF." },
              ].map(({ n, text }) => (
                <div key={n} className="flex gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-bold text-neutral-500">{n}</span>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">Ready · {formatBytes(result.blob.size)}</p>
                <SoftPillButton variant="primary" onClick={() => {
                  const a = document.createElement("a"); a.href = result.url; a.download = "rearranged.pdf"; a.click();
                }} className="h-8 px-3 text-[12px]">
                  <DownloadSimple size={12} />Save
                </SoftPillButton>
              </div>
            )}

            <div className="mt-auto space-y-2">
              <SoftPillButton variant="primary" onClick={process} disabled={processing || loading} className="w-full h-12 text-[14px]">
                {processing ? <><CircleNotch size={14} className="animate-spin" />Saving…</> : "Save Changes"}
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
