"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { UploadSimple, FilePdf, DotsSixVertical, DownloadSimple, CircleNotch, CaretLeft, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function RearrangePdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setOrder(Array.from({ length: doc.getPageCount() }, (_, i) => i));
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf" || f?.name.endsWith(".pdf")) loadFile(f);
  };

  const onItemDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setOrder(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null); setDragOverIdx(null);
  };

  const process = async () => {
    if (!file || processing) return;
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, order);
      pages.forEach(p => out.addPage(p));
      const blob = new Blob([(await out.save()) as unknown as BlobPart], { type: "application/pdf" });
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-4">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white">
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-neutral-50/60">
          <Link href="/" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <CaretLeft size={11} weight="bold" />All tools
          </Link>
          <span className="text-neutral-300 text-[12px]">/</span>
          <h1 className="text-[13px] font-semibold text-foreground">Rearrange PDF Pages</h1>
        </div>

        <div className="p-4 space-y-3">
          {!file ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border aspect-[10/9] cursor-pointer hover:border-foreground/20 hover:bg-neutral-50/60 transition-colors"
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}>
              <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                <UploadSimple size={20} />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-foreground">Drop your PDF here</p>
                <p className="mt-1 text-[12px] text-muted-foreground">Click to select Â· PDF only</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white ring-1 ring-black/5">
                <FilePdf size={18} className="shrink-0 text-red-400" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[12px] font-medium text-foreground">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{order.length} pages Â· {formatBytes(file.size)}</p>
                </div>
                <button onClick={() => { setFile(null); setOrder([]); setResult(null); }}
                  className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={13} />
                </button>
              </div>

              <div className="rounded-xl bg-neutral-50 ring-1 ring-black/5 p-2 space-y-1 max-h-64 overflow-y-auto">
                {order.map((pageIdx, i) => (
                  <div key={`${i}-${pageIdx}`}
                    draggable
                    onDragStart={() => setDragIdx(i)}
                    onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                    onDragOver={e => { e.preventDefault(); setDragOverIdx(i); }}
                    onDrop={() => onItemDrop(i)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 bg-white ring-1 ring-black/5 cursor-grab active:cursor-grabbing transition-all",
                      dragIdx === i && "opacity-40",
                      dragOverIdx === i && dragIdx !== i && "ring-2 ring-neutral-400",
                    )}>
                    <DotsSixVertical size={14} className="text-neutral-300 shrink-0" />
                    <span className="flex size-6 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600 shrink-0">{i + 1}</span>
                    <span className="text-[12px] text-muted-foreground">Page {pageIdx + 1}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {error && <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>}

          {result && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
              <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="flex-1 text-[12px] text-emerald-700 font-medium">Ready Â· {formatBytes(result.blob.size)}</p>
              <SoftPillButton variant="primary" onClick={() => {
                const a = document.createElement("a"); a.href = result.url; a.download = "rearranged.pdf"; a.click();
              }} className="h-8 px-3 text-[12px]">
                <DownloadSimple size={12} />Download
              </SoftPillButton>
            </div>
          )}

          <SoftPillButton variant="primary" onClick={process} disabled={!file || processing} className="w-full h-9 text-[12px]">
            {processing ? <><CircleNotch size={12} className="animate-spin" />Processingâ€¦</> : "Save New Order"}
          </SoftPillButton>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}
