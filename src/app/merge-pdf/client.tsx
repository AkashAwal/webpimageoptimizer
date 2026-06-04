"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Plus, X, DownloadSimple, CircleNotch, CaretLeft, Info } from "@phosphor-icons/react";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

interface PdfItem {
  id: string;
  file: File;
  thumbnail: string | null;
}

export default function MergePdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PdfItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const renderThumbnail = async (file: File): Promise<string> => {
    const { getPdfJs } = await import("@/lib/pdf-utils");
    const lib = await getPdfJs();
    const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
    const page = await pdf.getPage(1);
    const vp = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement("canvas");
    canvas.width = vp.width; canvas.height = vp.height;
    await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
    page.cleanup();
    return canvas.toDataURL("image/jpeg", 0.75);
  };

  const addFiles = useCallback(async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const newItems: PdfItem[] = arr.map(f => ({ id: crypto.randomUUID(), file: f, thumbnail: null }));
    setItems(prev => [...prev, ...newItems]);
    setResult(null); setError(null);
    for (const item of newItems) {
      try {
        const thumb = await renderThumbnail(item.file);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, thumbnail: thumb } : i));
      } catch { /* thumbnail failed silently */ }
    }
  }, []);

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setResult(null);
  };

  const process = async () => {
    if (items.length < 2 || processing) return;
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const item of items) {
        const doc = await PDFDocument.load(await item.file.arrayBuffer());
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const blob = new Blob([(await merged.save()) as unknown as BlobPart], { type: "application/pdf" });
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to merge PDFs.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pt-4">
      {/* Landing */}
      {items.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-8rem)] transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        >
          <div className="text-center space-y-3 max-w-lg">
            <h2 className="text-5xl font-bold tracking-tight text-foreground">Merge PDF</h2>
            <p className="text-[18px] text-muted-foreground">Combine multiple PDF files into one document.</p>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full max-w-md h-16 rounded-2xl bg-foreground text-white text-[16px] font-semibold hover:bg-foreground/90 active:scale-[0.99] transition-all"
          >
            Select PDF Files
          </button>
          <p className="text-[13px] text-muted-foreground">or drag and drop your PDFs here</p>
        </div>
      )}

      {/* Active: thumbnails + action panel */}
      {items.length > 0 && (
        <div className="overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white flex divide-x divide-border">

          {/* Left: thumbnail grid */}
          <div className="flex-1 p-5 relative">
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <CaretLeft size={11} weight="bold" />All tools
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Merge PDF</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {items.map(item => (
                <div key={item.id} className="relative group rounded-xl overflow-hidden ring-1 ring-black/10 bg-neutral-50 shadow-sm">
                  {item.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnail} alt={item.file.name} className="w-full block" />
                  ) : (
                    <div className="aspect-[3/4] flex items-center justify-center bg-neutral-100">
                      <CircleNotch size={16} className="animate-spin text-neutral-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
                    <p className="text-[9px] text-white truncate">{item.file.name}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-1.5 right-1.5 size-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={9} weight="bold" />
                  </button>
                </div>
              ))}
            </div>

            {/* Floating add-more badge */}
            <button
              onClick={() => inputRef.current?.click()}
              className="absolute top-4 right-4 flex items-center gap-1.5 bg-foreground text-white rounded-full h-8 px-3 text-[12px] font-semibold hover:bg-foreground/80 transition-colors"
            >
              {items.length} <Plus size={12} />
            </button>
          </div>

          {/* Right: action panel */}
          <div className="w-72 shrink-0 bg-neutral-50 p-5 flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Merge PDF</h2>

            <div className="flex gap-2.5 rounded-xl bg-blue-50 border border-blue-100 px-3 py-3">
              <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[12px] text-blue-700 leading-relaxed">
                Add more PDFs by clicking the <strong>+</strong> button. Hold{" "}
                <kbd className="bg-blue-100 px-1 rounded text-[11px]">Ctrl</kbd> (or{" "}
                <kbd className="bg-blue-100 px-1 rounded text-[11px]">⌘</kbd> on Mac) to select multiple files at once.
              </p>
            </div>

            {error && (
              <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>
            )}

            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">Ready · {formatBytes(result.blob.size)}</p>
                <button onClick={() => {
                  const a = document.createElement("a"); a.href = result.url; a.download = "merged.pdf"; a.click();
                }} className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <DownloadSimple size={12} />Save
                </button>
              </div>
            )}

            <div className="mt-auto space-y-2">
              <SoftPillButton
                variant="primary"
                onClick={process}
                disabled={items.length < 2 || processing}
                className="w-full h-12 text-[14px]"
              >
                {processing
                  ? <><CircleNotch size={14} className="animate-spin" />Merging…</>
                  : "Merge PDFs →"}
              </SoftPillButton>
              {items.length < 2 && (
                <p className="text-center text-[11px] text-muted-foreground">Add at least 2 PDFs to merge</p>
              )}
            </div>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple className="hidden"
        onChange={e => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
