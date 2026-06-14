"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FilePdf, DownloadSimple, CircleNotch, CaretLeft, X, Eraser, UploadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SignPdfClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigImgInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageThumb, setPageThumb] = useState<string | null>(null);
  const [pageThumbLoading, setPageThumbLoading] = useState(false);

  const [mode, setMode] = useState<"draw" | "type" | "upload">("draw");
  const [typedSig, setTypedSig] = useState("");
  const [uploadedSig, setUploadedSig] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const [page, setPage] = useState(1);
  const [xPct, setXPct] = useState(10);
  const [yPct, setYPct] = useState(70);
  const [sigScale, setSigScale] = useState(30);

  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const renderPageThumb = useCallback(async (f: File, pageNum: number) => {
    setPageThumb(null);
    setPageThumbLoading(true);
    try {
      const { getPdfJs } = await import("@/lib/pdf-utils");
      const lib = await getPdfJs();
      const pdf = await lib.getDocument({ data: await f.arrayBuffer() }).promise;
      const p = await pdf.getPage(Math.min(pageNum, pdf.numPages));
      const vp = p.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = vp.width; canvas.height = vp.height;
      await p.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
      setPageThumb(canvas.toDataURL("image/jpeg", 0.9));
      p.cleanup();
    } finally {
      setPageThumbLoading(false);
    }
  }, []);

  const loadFile = useCallback(async (f: File) => {
    setFile(f); setResult(null); setError(null);
    const { getPdfPageCount } = await import("@/lib/pdf-utils");
    const count = await getPdfPageCount(f);
    setTotalPages(count);
    setPage(1);
    renderPageThumb(f, 1);
  }, [renderPageThumb]);

  useEffect(() => {
    if (file && page) renderPageThumb(file, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Canvas drawing
  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const src = "touches" in e ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  };
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => { setIsDrawing(true); lastPos.current = getPos(e); };
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !sigCanvasRef.current) return;
    e.preventDefault();
    const ctx = sigCanvasRef.current.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath(); ctx.moveTo(lastPos.current!.x, lastPos.current!.y); ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#111"; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.stroke();
    lastPos.current = pos;
  };
  const clearCanvas = () => sigCanvasRef.current?.getContext("2d")!.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);

  const handleSigImageUpload = (f: File) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        setUploadedSig(canvas.toDataURL("image/png"));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
  };

  const getSigDataUrl = (): string | null => {
    if (mode === "upload") return uploadedSig;
    if (mode === "type") {
      if (!typedSig.trim()) return null;
      const canvas = document.createElement("canvas");
      canvas.width = 400; canvas.height = 80;
      const ctx = canvas.getContext("2d")!;
      ctx.font = "italic 42px Georgia, serif";
      ctx.fillStyle = "#111";
      ctx.fillText(typedSig, 10, 60);
      return canvas.toDataURL("image/png");
    }
    const canvas = sigCanvasRef.current;
    if (!canvas) return null;
    const data = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
    if (!data.some(d => d !== 0)) return null;
    return canvas.toDataURL("image/png");
  };

  const startSigDrag = (e: React.PointerEvent<HTMLElement>) => {
    e.preventDefault();
    const container = previewContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const startXPct = xPct, startYPct = yPct;

    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / rect.width * 100;
      const dy = (ev.clientY - startY) / rect.height * 100;
      setXPct(Math.max(0, Math.min(95, startXPct + dx)));
      setYPct(Math.max(0, Math.min(95, startYPct + dy)));
    };
    const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const process = async () => {
    const sigUrl = getSigDataUrl();
    if (!sigUrl) return setError(
      mode === "draw" ? "Please draw your signature first." :
      mode === "type" ? "Please type your signature first." :
      "Please upload a signature image first."
    );
    if (!file) return;
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const pages = doc.getPages();
      const target = pages[Math.min(page - 1, pages.length - 1)];
      const { width, height } = target.getSize();
      const res = await fetch(sigUrl);
      const bytes = new Uint8Array(await res.arrayBuffer());
      const img = await doc.embedPng(bytes);
      const sigW = width * (sigScale / 100);
      const sigH = sigW * (img.height / img.width);
      const x = width * (xPct / 100);
      const y = height * (1 - yPct / 100) - sigH;
      target.drawImage(img, { x, y, width: sigW, height: sigH });
      const blob = new Blob([(await doc.save()) as unknown as BlobPart], { type: "application/pdf" });
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to sign PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const sigPreview = getSigDataUrl();

  return (
    <div className="pt-4">
      {!file && (
        <div
          className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-8rem)] rounded-xl transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
        >
          <div className="text-center space-y-3 max-w-lg">
            <h2 className="text-5xl font-bold tracking-tight text-foreground">Sign PDF</h2>
            <p className="text-[18px] text-muted-foreground">Draw, type, or upload your signature onto any page of a PDF.</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-md h-16 rounded-2xl bg-foreground text-white text-[16px] font-semibold hover:bg-foreground/90 active:scale-[0.99] transition-all"
          >
            Select PDF File
          </button>
          <p className="text-[13px] text-muted-foreground">or drag and drop your PDF here</p>
        </div>
      )}

      {file && (
        <div className="flex flex-col sm:flex-row min-h-[calc(100vh-4rem)]">
          {/* Left: page preview with draggable signature */}
          <div className="flex-1 px-6 sm:px-10 pt-6 pb-10 space-y-4 min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0">
                <CaretLeft size={11} weight="bold" />All tools
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Sign PDF</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white ring-1 ring-black/5">
              <FilePdf size={18} className="shrink-0 text-red-400" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-[12px] font-medium text-foreground">{file.name}</p>
                <p className="text-[11px] text-muted-foreground">{totalPages} pages · {formatBytes(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setTotalPages(0); setResult(null); setPageThumb(null); }}
                className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={13} />
              </button>
            </div>

            {/* Page preview */}
            <div className="max-w-xl mx-auto">
              {pageThumbLoading && (
                <div className="flex items-center justify-center h-48 bg-neutral-100 ring-1 ring-black/5">
                  <CircleNotch size={20} className="animate-spin text-neutral-400" />
                </div>
              )}
              {!pageThumbLoading && pageThumb && (
                <div ref={previewContainerRef} className="relative ring-1 ring-black/10 overflow-hidden select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pageThumb} alt={`Page ${page}`} className="w-full block pointer-events-none" />
                  {sigPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sigPreview}
                      alt="signature"
                      draggable={false}
                      className="absolute cursor-grab active:cursor-grabbing drop-shadow-sm"
                      style={{ left: `${xPct}%`, top: `${yPct}%`, width: `${sigScale}%` }}
                      onPointerDown={startSigDrag}
                    />
                  )}
                  {!sigPreview && (
                    <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
                      <p className="text-[11px] text-neutral-400 bg-white/80 rounded-full px-3 py-1">Create a signature in the panel →</p>
                    </div>
                  )}
                </div>
              )}
              {sigPreview && (
                <p className="mt-1.5 text-[11px] text-muted-foreground/60 text-center">Drag the signature to reposition it</p>
              )}
            </div>
          </div>

          {/* Right: sticky sidebar */}
          <div className="w-full sm:w-80 shrink-0 border-t sm:border-t-0 sm:border-l border-border bg-white sm:sticky sm:top-16 sm:h-[calc(100vh-4rem)] flex flex-col p-6 gap-4 overflow-y-auto">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Sign PDF</h2>

            {/* Mode */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Signature</p>
              <div className="flex gap-1.5">
                {(["draw", "type", "upload"] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={cn("flex-1 rounded-lg py-1.5 text-[12px] font-medium capitalize transition-colors",
                      mode === m ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature input */}
            {mode === "draw" && (
              <div className="relative">
                <canvas ref={sigCanvasRef} width={544} height={124}
                  className="w-full rounded-xl border-2 border-border bg-white cursor-crosshair touch-none"
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)}
                  onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)}
                />
                <button onClick={clearCanvas} className="absolute top-2 right-2 rounded-lg p-1.5 bg-white ring-1 ring-black/10 text-neutral-400 hover:text-neutral-600 transition-colors">
                  <Eraser size={13} />
                </button>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Draw your signature above</p>
              </div>
            )}

            {mode === "type" && (
              <input type="text" placeholder="Type your name"
                value={typedSig} onChange={e => setTypedSig(e.target.value)}
                className="w-full rounded-xl border-2 border-border bg-white px-3 py-2.5 text-[18px] text-foreground outline-none focus:border-foreground/40 transition-colors"
                style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
              />
            )}

            {mode === "upload" && (
              <div className="space-y-2">
                {uploadedSig ? (
                  <div className="relative rounded-xl border-2 border-border bg-neutral-50 p-3 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uploadedSig} alt="Uploaded signature" className="max-h-16 max-w-full object-contain" />
                    <button onClick={() => setUploadedSig(null)} className="absolute top-1.5 right-1.5 rounded-lg p-1 bg-white ring-1 ring-black/10 text-neutral-400 hover:text-red-500 transition-colors">
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => sigImgInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-neutral-50 py-5 hover:border-foreground/20 hover:bg-neutral-100 transition-colors"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleSigImageUpload(f); }}
                  >
                    <UploadSimple size={18} className="text-neutral-400" />
                    <p className="text-[12px] text-muted-foreground font-medium">Upload signature image</p>
                  </button>
                )}
                <p className="text-[10px] text-muted-foreground/60 leading-tight">PNG with transparent background recommended for best results.</p>
              </div>
            )}

            {/* Page + size */}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Page</p>
                <input type="number" min={1} max={totalPages || 1} value={page}
                  onChange={e => setPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                  className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Size</p>
                  <span className="text-[11px] text-muted-foreground">{sigScale}%</span>
                </div>
                <input type="range" min={5} max={80} value={sigScale} onChange={e => setSigScale(Number(e.target.value))}
                  className="w-full h-1.5 cursor-pointer accent-foreground" />
              </div>
            </div>

            {error && <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>}

            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">Ready · {formatBytes(result.blob.size)}</p>
                <SoftPillButton variant="primary" onClick={() => {
                  const a = document.createElement("a"); a.href = result.url; a.download = "signed.pdf"; a.click();
                }} className="h-8 px-3 text-[12px]">
                  <DownloadSimple size={12} />Download
                </SoftPillButton>
              </div>
            )}

            <div className="mt-auto space-y-2">
              <SoftPillButton variant="primary" onClick={process} disabled={processing} className="w-full h-12 text-[14px]">
                {processing ? <><CircleNotch size={14} className="animate-spin" />Processing…</> : "Sign PDF"}
              </SoftPillButton>
              <p className="text-center text-[11px] text-muted-foreground/60">Runs locally · no upload</p>
            </div>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = ""; }} />
      <input ref={sigImgInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleSigImageUpload(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}
