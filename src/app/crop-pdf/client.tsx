"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { UploadSimple, FilePdf, DownloadSimple, CircleNotch, CaretLeft, X } from "@phosphor-icons/react";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CropPdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageImage, setPageImage] = useState<string | null>(null);
  const [ptW, setPtW] = useState(0);
  const [ptH, setPtH] = useState(0);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [top, setTop]       = useState(0);
  const [right, setRight]   = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft]     = useState(0);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError]   = useState<string | null>(null);

  const loadFile = useCallback(async (f: File) => {
    setFile(f); setResult(null); setError(null); setPageImage(null);
    setLoadingPreview(true);
    try {
      const { getPdfJs } = await import("@/lib/pdf-utils");
      const lib = await getPdfJs();
      const bytes = await f.arrayBuffer();
      const pdf = await lib.getDocument({ data: bytes }).promise;
      const page = await pdf.getPage(1);
      const vp1 = page.getViewport({ scale: 1 });
      setPtW(vp1.width);
      setPtH(vp1.height);
      const vp = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width; canvas.height = vp.height;
      await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
      setPageImage(canvas.toDataURL());
      page.cleanup();
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  const process = async () => {
    if (!file || processing) return;
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.getPages().forEach(page => {
        const { width, height } = page.getSize();
        page.setCropBox(left, bottom, width - left - right, height - top - bottom);
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

  const topPct   = ptH ? Math.min(100, (top    / ptH) * 100) : 0;
  const botPct   = ptH ? Math.min(100, (bottom / ptH) * 100) : 0;
  const leftPct  = ptW ? Math.min(100, (left   / ptW) * 100) : 0;
  const rightPct = ptW ? Math.min(100, (right  / ptW) * 100) : 0;

  const inputCls = "w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors";

  return (
    <div className="pt-4">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white">
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-neutral-50/60">
          <Link href="/" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <CaretLeft size={11} weight="bold" />All tools
          </Link>
          <span className="text-neutral-300 text-[12px]">/</span>
          <h1 className="text-[13px] font-semibold text-foreground">Crop PDF</h1>
          <span className="ml-auto text-[11px] text-muted-foreground/50 hidden sm:block shrink-0">No upload · runs in your browser</span>
        </div>

        <div className="p-4 space-y-3">
          {!file ? (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border aspect-[100/81] cursor-pointer hover:border-foreground/20 hover:bg-neutral-50/60 transition-colors"
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                <UploadSimple size={20} />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-foreground">Drop your PDF here</p>
                <p className="mt-1 text-[12px] text-muted-foreground">Click to select · PDF only</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white ring-1 ring-black/5">
                <FilePdf size={18} className="shrink-0 text-red-400" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[12px] font-medium text-foreground">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <button onClick={() => { setFile(null); setPageImage(null); setResult(null); }}
                  className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={13} />
                </button>
              </div>

              {loadingPreview && (
                <div className="flex items-center justify-center h-32 rounded-xl ring-1 ring-black/10 text-neutral-400">
                  <CircleNotch size={20} className="animate-spin" />
                </div>
              )}

              {!loadingPreview && pageImage && (
                <div className="relative rounded-xl overflow-hidden ring-1 ring-black/10 select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pageImage} alt="PDF page preview" className="w-full block" />
                  {topPct > 0 && (
                    <div className="absolute inset-x-0 top-0 bg-black/40 pointer-events-none transition-all duration-100"
                      style={{ height: `${topPct}%` }} />
                  )}
                  {botPct > 0 && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 pointer-events-none transition-all duration-100"
                      style={{ height: `${botPct}%` }} />
                  )}
                  {leftPct > 0 && (
                    <div className="absolute left-0 bg-black/40 pointer-events-none transition-all duration-100"
                      style={{ top: `${topPct}%`, bottom: `${botPct}%`, width: `${leftPct}%` }} />
                  )}
                  {rightPct > 0 && (
                    <div className="absolute right-0 bg-black/40 pointer-events-none transition-all duration-100"
                      style={{ top: `${topPct}%`, bottom: `${botPct}%`, width: `${rightPct}%` }} />
                  )}
                </div>
              )}

              <div className="rounded-xl bg-neutral-50 ring-1 ring-black/5 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Margins to remove (pt)</p>
                <div className="grid grid-cols-2 gap-2">
                  {([["Top", top, setTop], ["Right", right, setRight], ["Bottom", bottom, setBottom], ["Left", left, setLeft]] as const).map(
                    ([label, val, setter]) => (
                      <div key={label}>
                        <p className="text-[10px] text-muted-foreground/70 mb-0.5">{label}</p>
                        <input type="number" min={0} value={val}
                          onChange={e => (setter as (v: number) => void)(Number(e.target.value))}
                          className={inputCls}
                        />
                      </div>
                    )
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1.5 leading-tight">Adjusts the CropBox of every page. 1 pt ≈ 0.35 mm.</p>
              </div>
            </>
          )}

          {error && (
            <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>
          )}

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

          {file && (
            <SoftPillButton variant="primary" onClick={process} disabled={processing || loadingPreview} className="w-full h-9 text-[12px]">
              {processing ? <><CircleNotch size={12} className="animate-spin" />Processing…</> : "Crop PDF"}
            </SoftPillButton>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}
