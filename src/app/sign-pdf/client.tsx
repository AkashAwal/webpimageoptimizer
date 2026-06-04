"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UploadSimple, FilePdf, DownloadSimple, CircleNotch, CaretLeft, X, Eraser } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SignPdfClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typedSig, setTypedSig] = useState("");
  const [page, setPage] = useState(1);
  const [xPct, setXPct] = useState(10);
  const [yPct, setYPct] = useState(85);
  const [sigScale, setSigScale] = useState(30);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const loadFile = useCallback(async (f: File) => {
    setFile(f); setResult(null); setError(null);
    const { getPdfPageCount } = await import("@/lib/pdf-utils");
    const count = await getPdfPageCount(f);
    setTotalPages(count);
    setPage(1);
  }, []);

  // Canvas drawing
  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const src = "touches" in e ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width), y: (src.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !sigCanvasRef.current) return;
    e.preventDefault();
    const ctx = sigCanvasRef.current.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const clearCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getSigDataUrl = (): string | null => {
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
    // Check if canvas is blank
    const data = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
    if (!data.some(d => d !== 0)) return null;
    return canvas.toDataURL("image/png");
  };

  const process = async () => {
    const sigUrl = getSigDataUrl();
    if (!sigUrl) return setError(mode === "draw" ? "Please draw your signature first." : "Please type your signature first.");
    if (!file) return;
    setProcessing(true); setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const pages = doc.getPages();
      const target = pages[Math.min(page - 1, pages.length - 1)];
      const { width, height } = target.getSize();

      // Convert data URL to Uint8Array
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
                  <p className="text-[18px] text-muted-foreground">Draw or type your signature onto any page of a PDF.</p>
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
              <div className="overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white">
          <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-neutral-50/60">
            <Link href="/" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <CaretLeft size={11} weight="bold" />All tools
            </Link>
            <span className="text-neutral-300 text-[12px]">/</span>
            <h1 className="text-[13px] font-semibold text-foreground">Sign PDF</h1>
          </div>
  
          <div className="p-4 space-y-3">
            {/* File */}
            {/* file loaded: active content */}
            <div className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white ring-1 ring-black/5">
                <FilePdf size={18} className="shrink-0 text-red-400" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[12px] font-medium text-foreground">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{totalPages} pages · {formatBytes(file.size)}</p>
                </div>
                <button onClick={() => { setFile(null); setTotalPages(0); setResult(null); }}
                  className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <X size={13} />
                </button>
              </div>
  
            {file && (
              <div className="rounded-xl bg-neutral-50 ring-1 ring-black/5 p-3 space-y-3">
                {/* Sig mode */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Signature</p>
                  <div className="flex gap-1.5 mb-2">
                    {(["draw", "type"] as const).map(m => (
                      <button key={m} onClick={() => setMode(m)}
                        className={cn("flex-1 rounded-lg py-1.5 text-[12px] font-medium capitalize transition-colors",
                          mode === m ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                        {m === "draw" ? "Draw" : "Type"}
                      </button>
                    ))}
                  </div>
                  {mode === "draw" ? (
                    <div className="relative">
                      <canvas ref={sigCanvasRef} width={500} height={120}
                        className="w-full rounded-lg border border-border bg-white cursor-crosshair touch-none"
                        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)}
                        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)}
                      />
                      <button onClick={clearCanvas} className="absolute top-2 right-2 rounded-lg p-1.5 bg-white ring-1 ring-black/10 text-neutral-400 hover:text-neutral-600 transition-colors">
                        <Eraser size={13} />
                      </button>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">Draw your signature above</p>
                    </div>
                  ) : (
                    <input type="text" placeholder="Type your name"
                      value={typedSig} onChange={e => setTypedSig(e.target.value)}
                      className="w-full rounded-lg border border-border bg-white px-2 py-2 text-[18px] text-foreground outline-none focus:border-foreground/30 transition-colors"
                      style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
                    />
                  )}
                </div>
  
                {/* Placement */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Page</p>
                    <input type="number" min={1} max={totalPages || 1} value={page} onChange={e => setPage(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">X pos %</p>
                    <input type="number" min={0} max={100} value={xPct} onChange={e => setXPct(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Y pos %</p>
                    <input type="number" min={0} max={100} value={yPct} onChange={e => setYPct(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Signature size</p>
                    <span className="text-[11px] text-muted-foreground">{sigScale}% of page width</span>
                  </div>
                  <input type="range" min={5} max={80} value={sigScale} onChange={e => setSigScale(Number(e.target.value))}
                    className="w-full h-1.5 cursor-pointer accent-foreground" />
                </div>
              </div>
            )}
  
            {error && <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>}
  
            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">Signed PDF ready · {formatBytes(result.blob.size)}</p>
                <SoftPillButton variant="primary" onClick={() => {
                  const a = document.createElement("a"); a.href = result.url; a.download = "signed.pdf"; a.click();
                }} className="h-8 px-3 text-[12px]">
                  <DownloadSimple size={12} />Download
                </SoftPillButton>
              </div>
            )}
  
            <SoftPillButton variant="primary" onClick={process} disabled={!file || processing} className="w-full h-9 text-[12px]">
              {processing ? <><CircleNotch size={12} className="animate-spin" />Processing…</> : "Sign PDF"}
            </SoftPillButton>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden"
          onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = ""; }} />
      </div>
      )}
  );
}
