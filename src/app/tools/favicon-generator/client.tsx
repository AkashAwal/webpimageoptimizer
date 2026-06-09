"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, CircleNotch, Check, DownloadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

const SIZES = [16, 32, 48, 64, 128, 256];

type State = "idle" | "generating" | "done" | "error";

async function resizeToCanvas(img: HTMLImageElement, size: number): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d")!.drawImage(img, 0, 0, size, size);
  return canvas;
}

async function canvasToBlob(canvas: HTMLCanvasElement, mime = "image/png"): Promise<Blob> {
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Canvas export failed"))), mime),
  );
}

// Minimal ICO builder: 1-bit header + directory + PNG data for each size
async function buildIco(sizes: number[], img: HTMLImageElement): Promise<Blob> {
  const blobs: Blob[] = [];
  for (const s of sizes) {
    const canvas = await resizeToCanvas(img, s);
    blobs.push(await canvasToBlob(canvas, "image/png"));
  }
  const buffers = await Promise.all(blobs.map((b) => b.arrayBuffer()));
  const count = sizes.length;
  const HEADER = 6;
  const DIR_ENTRY = 16;
  const dirOffset = HEADER + DIR_ENTRY * count;
  let offset = dirOffset;
  for (const buf of buffers) offset += buf.byteLength;
  const total = offset;
  const ico = new DataView(new ArrayBuffer(total));
  // ICONDIR header
  ico.setUint16(0, 0, true);  // reserved
  ico.setUint16(2, 1, true);  // type: ICO
  ico.setUint16(4, count, true);
  // Directory entries + image data
  let dataOffset = dirOffset;
  for (let i = 0; i < count; i++) {
    const s = sizes[i];
    const buf = buffers[i];
    const entryStart = HEADER + i * DIR_ENTRY;
    ico.setUint8(entryStart, s >= 256 ? 0 : s);   // width (0 = 256)
    ico.setUint8(entryStart + 1, s >= 256 ? 0 : s); // height
    ico.setUint8(entryStart + 2, 0);   // colour count
    ico.setUint8(entryStart + 3, 0);   // reserved
    ico.setUint16(entryStart + 4, 1, true); // planes
    ico.setUint16(entryStart + 6, 32, true); // bpp
    ico.setUint32(entryStart + 8, buf.byteLength, true);
    ico.setUint32(entryStart + 12, dataOffset, true);
    new Uint8Array(ico.buffer).set(new Uint8Array(buf), dataOffset);
    dataOffset += buf.byteLength;
  }
  return new Blob([ico.buffer], { type: "image/x-icon" });
}

export function FaviconGeneratorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<State>("idle");
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const zipUrlRef = useRef<string | null>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (zipUrlRef.current) { URL.revokeObjectURL(zipUrlRef.current); zipUrlRef.current = null; }
    const url = URL.createObjectURL(f);
    previewUrlRef.current = url;
    setFile(f);
    setPreviewUrl(url);
    setState("idle");
    setZipUrl(null);
    setError(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const reset = useCallback(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (zipUrlRef.current) URL.revokeObjectURL(zipUrlRef.current);
    previewUrlRef.current = null; zipUrlRef.current = null;
    setFile(null); setPreviewUrl(null); setState("idle"); setZipUrl(null); setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!previewUrl) return;
    setState("generating");
    setError(null);
    try {
      const { default: JSZip } = await import("jszip");
      const img = new Image();
      img.src = previewUrl;
      await new Promise((r) => { img.onload = r; if (img.complete) r(null); });

      const zip = new JSZip();

      // PNG sizes
      for (const s of SIZES) {
        const canvas = await resizeToCanvas(img, s);
        const blob = await canvasToBlob(canvas);
        zip.file(`favicon-${s}x${s}.png`, blob);
      }

      // ICO (16, 32, 48)
      const icoBlob = await buildIco([16, 32, 48], img);
      zip.file("favicon.ico", icoBlob);

      // apple-touch-icon (180×180)
      const appleCanvas = await resizeToCanvas(img, 180);
      zip.file("apple-touch-icon.png", await canvasToBlob(appleCanvas));

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      zipUrlRef.current = url;
      setZipUrl(url);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
      setState("error");
    }
  };

  const handleDownload = () => {
    if (!zipUrl) return;
    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = "favicon-set.zip";
    a.click();
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors select-none",
            dragging ? "border-foreground/30 bg-neutral-50" : "border-border hover:border-foreground/20 hover:bg-neutral-50/60",
          )}
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
            <UploadSimple size={20} />
          </div>
          <div>
            <p className="text-[14px] font-medium text-foreground">Drop your logo or image here</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · PNG, SVG, JPEG recommended</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        </div>
      )}

      {file && state !== "done" && (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
          {previewUrl && (
            <div className="flex items-center justify-center h-36 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTVlN2ViIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNlNWU3ZWIiLz48cmVjdCB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+PHJlY3QgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==')]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="" className="h-24 w-24 object-contain" />
            </div>
          )}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
            {state !== "generating" && (
              <button onClick={reset} className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors" aria-label="Remove file">
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Size preview chips */}
      {file && state !== "done" && (
        <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">Output files</p>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => (
              <span key={s} className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
                {s}×{s} PNG
              </span>
            ))}
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">favicon.ico</span>
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">180×180 Apple</span>
          </div>
        </div>
      )}

      {file && state !== "done" && (
        <SoftPillButton variant="primary" onClick={handleGenerate} disabled={state === "generating"} className="w-full h-10 text-[13px]">
          {state === "generating" ? (
            <><CircleNotch size={13} className="animate-spin" /> Generating…</>
          ) : "Generate Favicon Set"}
        </SoftPillButton>
      )}

      {state === "error" && error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600 ring-1 ring-red-100">{error}</p>
      )}

      {state === "done" && zipUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check size={11} weight="bold" />
            </div>
            <span className="text-[13px] font-medium text-foreground">Favicon set ready</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                <Check size={9} weight="bold" /> {s}×{s}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
              <Check size={9} weight="bold" /> favicon.ico
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
              <Check size={9} weight="bold" /> Apple 180×180
            </span>
          </div>
          <div className="flex gap-2">
            <SoftPillButton variant="primary" onClick={handleDownload} className="flex-1 h-9 text-[13px]">
              <DownloadSimple size={13} /> Download ZIP
            </SoftPillButton>
            <SoftPillButton variant="secondary" onClick={reset} className="h-9 px-4 text-[13px]">New image</SoftPillButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}
