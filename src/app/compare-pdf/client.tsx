"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { UploadSimple, FilePdf, CircleNotch, CaretLeft, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

interface PdfInfo { file: File; pages: number; images: string[] }

export default function ComparePdfClient() {
  const inputA = useRef<HTMLInputElement>(null);
  const inputB = useRef<HTMLInputElement>(null);
  const [pdfA, setPdfA] = useState<PdfInfo | null>(null);
  const [pdfB, setPdfB] = useState<PdfInfo | null>(null);
  const [loading, setLoading] = useState<"a" | "b" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadPdf = async (file: File, side: "a" | "b") => {
    setLoading(side); setError(null);
    try {
      const { getPdfJs } = await import("@/lib/pdf-utils");
      const lib = await getPdfJs();
      const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
      const total = pdf.numPages;
      const images: string[] = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        images.push(canvas.toDataURL());
        page.cleanup();
      }
      const info: PdfInfo = { file, pages: total, images };
      if (side === "a") { setPdfA(info); setCurrentPage(1); }
      else { setPdfB(info); setCurrentPage(1); }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to render PDF.");
    } finally {
      setLoading(null);
    }
  };

  const maxPages = Math.max(pdfA?.pages ?? 0, pdfB?.pages ?? 0);

  const DropZone = ({ side, pdf, inputRef }: { side: "a" | "b"; pdf: PdfInfo | null; inputRef: React.RefObject<HTMLInputElement> }) => (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
        {side === "a" ? "Document A" : "Document B"}
      </p>
      {!pdf ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 cursor-pointer hover:border-foreground/20 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadPdf(f, side); }}>
          {loading === side
            ? <CircleNotch size={20} className="animate-spin text-neutral-400" />
            : <><UploadSimple size={18} className="text-neutral-400" /><p className="text-[12px] text-muted-foreground">Drop PDF</p></>}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl px-2.5 py-2 bg-white ring-1 ring-black/5">
          <FilePdf size={16} className="shrink-0 text-red-400" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-[11px] font-medium text-foreground">{pdf.file.name}</p>
            <p className="text-[10px] text-muted-foreground">{pdf.pages} pages · {formatBytes(pdf.file.size)}</p>
          </div>
          <button onClick={() => side === "a" ? setPdfA(null) : setPdfB(null)}
            className="rounded p-1 text-neutral-300 hover:text-red-400 transition-colors"><X size={12} /></button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) loadPdf(e.target.files[0], side); e.target.value = ""; }} />
    </div>
  );

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-6 py-3 sm:py-4">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white">
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-neutral-50/60">
          <Link href="/" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <CaretLeft size={11} weight="bold" />All tools
          </Link>
          <span className="text-neutral-300 text-[12px]">/</span>
          <h1 className="text-[13px] font-semibold text-foreground">Compare PDF</h1>
          {maxPages > 1 && (
            <div className="ml-auto flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}
                className="rounded-lg px-2 py-1 text-[12px] bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-30 transition-colors">‹</button>
              <span className="text-[12px] text-muted-foreground">Page {currentPage} / {maxPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(maxPages, p + 1))} disabled={currentPage >= maxPages}
                className="rounded-lg px-2 py-1 text-[12px] bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-30 transition-colors">›</button>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          {/* File pickers */}
          <div className="flex gap-3">
            <DropZone side="a" pdf={pdfA} inputRef={inputA as React.RefObject<HTMLInputElement>} />
            <DropZone side="b" pdf={pdfB} inputRef={inputB as React.RefObject<HTMLInputElement>} />
          </div>

          {error && <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>}

          {/* Side by side comparison */}
          {(pdfA || pdfB) && (
            <div className="grid grid-cols-2 gap-2">
              {([pdfA, pdfB] as const).map((pdf, i) => (
                <div key={i} className="rounded-xl overflow-hidden ring-1 ring-black/10 bg-neutral-50">
                  <div className={cn("px-2 py-1 text-[10px] font-semibold uppercase tracking-widest", i === 0 ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600")}>
                    {i === 0 ? "Document A" : "Document B"}
                  </div>
                  {pdf && pdf.images[currentPage - 1] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pdf.images[currentPage - 1]} alt={`Page ${currentPage}`} className="w-full" />
                  ) : (
                    <div className="flex items-center justify-center h-40 text-[12px] text-muted-foreground">
                      {pdf && currentPage > pdf.pages ? `Only ${pdf.pages} pages` : "No document loaded"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!pdfA && !pdfB && (
            <p className="text-center text-[12px] text-muted-foreground py-4">Load two PDFs above to compare them side by side.</p>
          )}
        </div>
      </div>
    </div>
  );
}
