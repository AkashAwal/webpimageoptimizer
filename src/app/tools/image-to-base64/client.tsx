"use client";

import { useCallback, useRef, useState } from "react";
import { UploadSimple, X, Check, Copy, DownloadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type Tab = "encode" | "decode";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, []);
  return { copied, copy };
}

export function ImageToBase64Client() {
  const [tab, setTab] = useState<Tab>("encode");

  // Encode state
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [b64, setB64] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { copied: copiedB64, copy: copyB64 } = useCopy();
  const { copied: copiedUri, copy: copyUri } = useCopy();

  // Decode state
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeUrl, setDecodeUrl] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const decodeUrlRef = useRef<string | null>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setB64(null); setDataUri(null);
    const reader = new FileReader();
    reader.onload = e => {
      const uri = e.target?.result as string;
      setDataUri(uri);
      setB64(uri.split(",")[1] ?? null);
    };
    reader.readAsDataURL(f);
  }, []);

  const resetEncode = () => { setFile(null); setB64(null); setDataUri(null); };

  const handleDecode = useCallback(() => {
    setDecodeError(null);
    if (decodeUrlRef.current) { URL.revokeObjectURL(decodeUrlRef.current); decodeUrlRef.current = null; }

    let uri = decodeInput.trim();
    if (!uri) return;

    // Accept raw base64 or full data URI
    if (!uri.startsWith("data:")) {
      uri = `data:image/png;base64,${uri}`;
    }

    try {
      const [header, data] = uri.split(",");
      if (!data) throw new Error("Invalid format");
      const mime = header.replace("data:", "").replace(";base64", "");
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      decodeUrlRef.current = url;
      setDecodeUrl(url);
    } catch {
      setDecodeError("Could not decode — make sure you pasted a valid Base64 string or data URI.");
    }
  }, [decodeInput]);

  const handleDecodeDownload = () => {
    if (!decodeUrl) return;
    const a = document.createElement("a");
    a.href = decodeUrl;
    a.download = "decoded-image.png";
    a.click();
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {/* Tabs */}
      <div className="flex gap-1.5 rounded-2xl bg-neutral-100 p-1">
        {(["encode", "decode"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-xl py-2 text-[13px] font-medium capitalize transition-colors",
              tab === t ? "bg-white text-foreground shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-700",
            )}>
            {t === "encode" ? "Image → Base64" : "Base64 → Image"}
          </button>
        ))}
      </div>

      {/* ── Encode ── */}
      {tab === "encode" && (
        <>
          {!file && (
            <div
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
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
                <p className="text-[14px] font-medium text-foreground">Drop your image here</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · JPEG, PNG, WebP, GIF</p>
              </div>
              <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
            </div>
          )}

          {file && b64 && dataUri && (
            <div className="space-y-3">
              {/* File info */}
              <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{formatBytes(file.size)} · B64 ~{formatBytes(Math.ceil(b64.length * 0.75))}</p>
                </div>
                <button onClick={resetEncode} className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors ml-3">
                  <X size={13} />
                </button>
              </div>

              {/* Data URI */}
              <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Data URI</p>
                  <button onClick={() => copyUri(dataUri)}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    {copiedUri ? <Check size={11} weight="bold" className="text-emerald-600" /> : <Copy size={11} />}
                    {copiedUri ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly value={dataUri}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-neutral-50 px-3 py-2 font-mono text-[11px] text-muted-foreground outline-none"
                />
              </div>

              {/* Raw Base64 */}
              <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Raw Base64</p>
                  <button onClick={() => copyB64(b64)}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    {copiedB64 ? <Check size={11} weight="bold" className="text-emerald-600" /> : <Copy size={11} />}
                    {copiedB64 ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly value={b64}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-neutral-50 px-3 py-2 font-mono text-[11px] text-muted-foreground outline-none"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Decode ── */}
      {tab === "decode" && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Paste Base64 or Data URI</p>
            <textarea
              value={decodeInput}
              onChange={e => { setDecodeInput(e.target.value); setDecodeUrl(null); setDecodeError(null); }}
              placeholder="data:image/png;base64,iVBORw0KGgo... or raw Base64 string"
              rows={5}
              className="w-full resize-none rounded-xl border border-border bg-neutral-50 px-3 py-2 font-mono text-[11px] text-foreground placeholder:text-neutral-400 outline-none focus:border-foreground/30 focus:bg-white transition-colors"
            />
            {decodeError && <p className="text-[12px] text-red-500">{decodeError}</p>}
          </div>

          <SoftPillButton
            variant="primary" onClick={handleDecode}
            disabled={!decodeInput.trim()}
            className="w-full h-10 text-[13px]"
          >
            Decode Image
          </SoftPillButton>

          {decodeUrl && (
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-center h-56 bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={decodeUrl} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-4">
                <SoftPillButton variant="primary" onClick={handleDecodeDownload} className="w-full h-9 text-[13px]">
                  <DownloadSimple size={13} />Download Image
                </SoftPillButton>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
