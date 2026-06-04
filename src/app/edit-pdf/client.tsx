"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UploadSimple, FilePdf, DownloadSimple, CircleNotch, CaretLeft, X, TextT, Rectangle, Circle, Highlighter, PencilSimple, Eraser } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type Tool = "text" | "rect" | "circle" | "highlight" | "freehand" | "whiteout";

interface Annotation {
  id: string;
  tool: Tool;
  x: number; y: number; w?: number; h?: number;
  text?: string;
  color: string;
  points?: Array<[number, number]>;
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function EditPdfClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImage, setPageImage] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("text");
  const [color, setColor] = useState("#ff0000");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState<[number, number] | null>(null);
  const [currentPoints, setCurrentPoints] = useState<Array<[number, number]>>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageAnns, setPageAnns] = useState<Record<number, Annotation[]>>({});

  const loadPage = useCallback(async (f: File, n: number) => {
    const { renderPageToCanvas } = await import("@/lib/pdf-utils");
    const canvas = await renderPageToCanvas(f, n, 1.5);
    setPageImage(canvas.toDataURL());
    setAnnotations(pageAnns[n] ?? []);
  }, [pageAnns]);

  const loadFile = useCallback(async (f: File) => {
    setFile(f); setResult(null); setError(null); setPageAnns({}); setAnnotations([]);
    const { getPdfPageCount } = await import("@/lib/pdf-utils");
    const count = await getPdfPageCount(f);
    setTotalPages(count); setCurrentPage(1);
    await loadPage(f, 1);
  }, [loadPage]);

  const changePage = async (n: number) => {
    if (!file) return;
    setPageAnns(prev => ({ ...prev, [currentPage]: annotations }));
    setCurrentPage(n);
    await loadPage(file, n);
  };

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = pageImage;
    if (!canvas || !img) return;
    const image = new window.Image();
    image.onload = () => {
      canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, 0, 0);
      annotations.forEach(ann => drawAnnotation(ctx, ann));
    };
    image.src = img;
  }, [pageImage, annotations]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, ann: Annotation) => {
    ctx.save();
    if (ann.tool === "text" && ann.text) {
      ctx.font = "18px Arial"; ctx.fillStyle = ann.color;
      ctx.fillText(ann.text, ann.x, ann.y);
    } else if (ann.tool === "rect" && ann.w !== undefined && ann.h !== undefined) {
      ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
      ctx.strokeRect(ann.x, ann.y, ann.w, ann.h);
    } else if (ann.tool === "circle" && ann.w !== undefined && ann.h !== undefined) {
      ctx.strokeStyle = ann.color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(ann.x + ann.w / 2, ann.y + ann.h / 2, Math.abs(ann.w / 2), Math.abs(ann.h / 2), 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (ann.tool === "highlight" && ann.w !== undefined && ann.h !== undefined) {
      ctx.globalAlpha = 0.3; ctx.fillStyle = ann.color;
      ctx.fillRect(ann.x, ann.y, ann.w, ann.h);
    } else if (ann.tool === "whiteout" && ann.w !== undefined && ann.h !== undefined) {
      ctx.fillStyle = "#ffffff"; ctx.fillRect(ann.x, ann.y, ann.w, ann.h);
    } else if (ann.tool === "freehand" && ann.points?.length) {
      ctx.strokeStyle = ann.color; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(ann.points[0][0], ann.points[0][1]);
      ann.points.forEach(([px, py]) => ctx.lineTo(px, py));
      ctx.stroke();
    }
    ctx.restore();
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>): [number, number] => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return [
      (e.clientX - rect.left) * (canvas.width / rect.width),
      (e.clientY - rect.top) * (canvas.height / rect.height),
    ];
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e);
    if (tool === "text") {
      const t = prompt("Enter text:");
      if (t) setAnnotations(prev => [...prev, { id: crypto.randomUUID(), tool: "text", x: pos[0], y: pos[1], text: t, color }]);
    } else {
      setDrawing(true); setStartPos(pos);
      if (tool === "freehand") setCurrentPoints([pos]);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !startPos) return;
    const pos = getCanvasPos(e);
    if (tool === "freehand") {
      setCurrentPoints(prev => [...prev, pos]);
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(pos[0] - 1, pos[1]); ctx.lineTo(pos[0], pos[1]); ctx.stroke();
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !startPos) return;
    const pos = getCanvasPos(e);
    const [sx, sy] = startPos;
    if (tool !== "freehand") {
      setAnnotations(prev => [...prev, { id: crypto.randomUUID(), tool, x: sx, y: sy, w: pos[0] - sx, h: pos[1] - sy, color }]);
    } else {
      setAnnotations(prev => [...prev, { id: crypto.randomUUID(), tool: "freehand", x: 0, y: 0, points: currentPoints, color }]);
      setCurrentPoints([]);
    }
    setDrawing(false); setStartPos(null);
  };

  const save = async () => {
    if (!file) return;
    setProcessing(true); setError(null);
    const allAnns = { ...pageAnns, [currentPage]: annotations };
    try {
      const { getPdfJs } = await import("@/lib/pdf-utils");
      const { PDFDocument, rgb } = await import("pdf-lib");

      const lib = await getPdfJs();
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdfDoc.getPages();

      for (const [pageNumStr, anns] of Object.entries(allAnns)) {
        const pageNum = parseInt(pageNumStr);
        if (!anns.length) continue;
        const page = pages[pageNum - 1];
        const pdfPage = pdfDoc.getPage(pageNum - 1);
        const { width: pdfW, height: pdfH } = pdfPage.getSize();

        const pdfPageCanvas = await (await lib.getDocument({ data: await file.arrayBuffer() }).promise).getPage(pageNum);
        const vp = pdfPageCanvas.getViewport({ scale: 1.5 });
        const scaleX = pdfW / vp.width;
        const scaleY = pdfH / vp.height;

        for (const ann of anns) {
          const hexToRgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return rgb(r, g, b);
          };
          const c = hexToRgb(ann.color || "#ff0000");

          if (ann.tool === "rect" && ann.w !== undefined) {
            page.drawRectangle({ x: ann.x * scaleX, y: pdfH - (ann.y + (ann.h ?? 0)) * scaleY, width: (ann.w ?? 0) * scaleX, height: Math.abs((ann.h ?? 0) * scaleY), borderColor: c, borderWidth: 1.5 });
          } else if (ann.tool === "highlight" && ann.w !== undefined) {
            page.drawRectangle({ x: ann.x * scaleX, y: pdfH - (ann.y + (ann.h ?? 0)) * scaleY, width: (ann.w ?? 0) * scaleX, height: Math.abs((ann.h ?? 0) * scaleY), color: rgb(1, 1, 0), opacity: 0.3 });
          } else if (ann.tool === "whiteout" && ann.w !== undefined) {
            page.drawRectangle({ x: ann.x * scaleX, y: pdfH - (ann.y + (ann.h ?? 0)) * scaleY, width: (ann.w ?? 0) * scaleX, height: Math.abs((ann.h ?? 0) * scaleY), color: rgb(1, 1, 1) });
          }
        }
      }

      const blob = new Blob([(await pdfDoc.save()) as unknown as BlobPart], { type: "application/pdf" });
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: "text",      icon: <TextT size={14} />,        label: "Text"      },
    { id: "rect",      icon: <Rectangle size={14} />,    label: "Rectangle" },
    { id: "circle",    icon: <Circle size={14} />,        label: "Circle"    },
    { id: "highlight", icon: <Highlighter size={14} />,  label: "Highlight" },
    { id: "freehand",  icon: <PencilSimple size={14} />, label: "Draw"      },
    { id: "whiteout",  icon: <Eraser size={14} />,       label: "White-out" },
  ];

  return (
    <div className="pt-4">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white">
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-neutral-50/60">
          <Link href="/" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <CaretLeft size={11} weight="bold" />All tools
          </Link>
          <span className="text-neutral-300 text-[12px]">/</span>
          <h1 className="text-[13px] font-semibold text-foreground">Edit PDF</h1>
          {totalPages > 0 && (
            <div className="ml-auto flex items-center gap-1.5">
              <button onClick={() => currentPage > 1 && changePage(currentPage - 1)} disabled={currentPage <= 1}
                className="rounded-lg px-2 py-1 text-[12px] bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-30 transition-colors">â€¹</button>
              <span className="text-[12px] text-muted-foreground">{currentPage} / {totalPages}</span>
              <button onClick={() => currentPage < totalPages && changePage(currentPage + 1)} disabled={currentPage >= totalPages}
                className="rounded-lg px-2 py-1 text-[12px] bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-30 transition-colors">â€º</button>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          {!file ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border aspect-square cursor-pointer hover:border-foreground/20 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}>
              <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500"><UploadSimple size={20} /></div>
              <p className="text-[15px] font-semibold text-foreground">Drop your PDF here</p>
              <p className="text-[12px] text-muted-foreground">Add annotations, shapes, and highlights</p>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex gap-1">
                  {TOOLS.map(t => (
                    <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
                      className={cn("flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors",
                        tool === t.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                      {t.icon}<span className="hidden sm:inline">{t.label}</span>
                    </button>
                  ))}
                </div>
                <input type="color" value={color} onChange={e => setColor(e.target.value)}
                  className="size-7 rounded cursor-pointer border border-border" title="Colour" />
                <button onClick={() => setAnnotations(prev => prev.slice(0, -1))}
                  className="ml-auto rounded-lg px-2 py-1.5 text-[11px] bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors">Undo</button>
                <button onClick={() => setAnnotations([])}
                  className="rounded-lg px-2 py-1.5 text-[11px] bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors">Clear page</button>
              </div>

              {/* Canvas */}
              <div className="rounded-xl overflow-hidden ring-1 ring-black/10 cursor-crosshair max-h-[60vh] overflow-y-auto">
                <canvas ref={canvasRef}
                  onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
                <FilePdf size={13} className="text-red-400" />
                {file.name} Â· {formatBytes(file.size)}
                <button onClick={() => { setFile(null); setPageImage(null); setAnnotations([]); setPageAnns({}); setResult(null); }}
                  className="ml-auto text-neutral-400 hover:text-red-500 transition-colors"><X size={13} /></button>
              </div>
            </>
          )}

          {error && <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>}

          {result && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
              <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="flex-1 text-[12px] text-emerald-700 font-medium">PDF saved Â· {formatBytes(result.blob.size)}</p>
              <SoftPillButton variant="primary" onClick={() => {
                const a = document.createElement("a"); a.href = result.url; a.download = "edited.pdf"; a.click();
              }} className="h-8 px-3 text-[12px]">
                <DownloadSimple size={12} />Download
              </SoftPillButton>
            </div>
          )}

          {file && (
            <SoftPillButton variant="primary" onClick={save} disabled={processing} className="w-full h-9 text-[12px]">
              {processing ? <><CircleNotch size={12} className="animate-spin" />Savingâ€¦</> : "Save Annotated PDF"}
            </SoftPillButton>
          )}
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) loadFile(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}
