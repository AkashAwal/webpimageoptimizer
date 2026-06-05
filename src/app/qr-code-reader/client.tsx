"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";
import { UploadSimple, Check, X, ArrowSquareOut, Copy } from "@phosphor-icons/react";

type State = "idle" | "decoding" | "done" | "error";

export function QrCodeReaderClient() {
  const [state, setState] = useState<State>("idle");
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const decode = useCallback((file: File) => {
    setState("decoding");
    setResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setState("error"); return; }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const jsQR = (await import("jsqr")).default;
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setResult(code.data);
        setState("done");
      } else {
        setState("error");
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { setState("error"); URL.revokeObjectURL(url); };
    img.src = url;
  }, []);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    decode(file);
  };

  const reset = () => {
    setState("idle");
    setPreviewUrl(null);
    setResult(null);
    setCopied(false);
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = result ? /^https?:\/\//i.test(result) : false;

  return (
    <div className="space-y-4">
      {state === "idle" && (
        <div
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors select-none",
            dragging ? "border-foreground/30 bg-neutral-50 dark:bg-neutral-800/40" : "border-border hover:border-foreground/20 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30",
          )}
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
            <UploadSimple size={20} />
          </div>
          <div>
            <p className="text-[14px] font-medium text-foreground">Drop your image here</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · any image with a QR code</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { handleFiles(e.target.files); e.target.value = ""; }} />
        </div>
      )}

      {(state === "decoding" || state === "done" || state === "error") && (
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          {previewUrl && (
            <div className="relative h-52 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="" className="h-full w-full object-contain" />
            </div>
          )}

          <div className="p-5 space-y-4">
            {state === "decoding" && (
              <p className="text-[13px] text-muted-foreground">Decoding…</p>
            )}

            {state === "done" && result && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <Check size={11} weight="bold" />
                  </div>
                  <span className="text-[13px] font-medium text-foreground">QR code decoded</span>
                </div>
                <div className="rounded-xl bg-neutral-50 px-4 py-3 ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/6">
                  <p className="text-[13px] text-foreground break-all font-mono leading-relaxed">{result}</p>
                </div>
                <div className="flex gap-2">
                  <SoftPillButton variant="primary" onClick={copy} className="flex-1 h-9 text-[12px]">
                    {copied ? <><Check size={12} weight="bold" />Copied</> : <><Copy size={12} />Copy text</>}
                  </SoftPillButton>
                  {isUrl && (
                    <SoftPillButton variant="secondary" onClick={() => window.open(result, "_blank", "noopener")} className="h-9 px-4 text-[12px]">
                      <ArrowSquareOut size={13} /> Open URL
                    </SoftPillButton>
                  )}
                </div>
              </div>
            )}

            {state === "error" && (
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/50 dark:text-red-400">
                  <X size={11} weight="bold" />
                </div>
                <span className="text-[13px] text-muted-foreground">No QR code found in this image. Try a clearer or cropped version.</span>
              </div>
            )}

            <button onClick={reset} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
              Try another image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
