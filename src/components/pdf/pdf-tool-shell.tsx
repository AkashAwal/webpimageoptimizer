"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { UploadSimple, X, FilePdf, DownloadSimple, CircleNotch, CaretLeft } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export interface PdfFile {
  id: string;
  file: File;
}

interface Props {
  title?: string;
  description?: string;
  instructions?: { n: string; text: string }[];
  acceptMultiple?: boolean;
  maxFiles?: number;
  processLabel?: string;
  settingsNode?: React.ReactNode;
  onProcess: (files: File[]) => Promise<Blob | null>;
  outputFilename: string;
  outputMime?: string;
  accept?: string;
}

export default function PdfToolShell({
  title,
  description,
  instructions,
  acceptMultiple = false,
  maxFiles,
  processLabel = "Process PDF",
  settingsNode,
  onProcess,
  outputFilename,
  outputMime = "application/pdf",
  accept = "application/pdf,.pdf",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const canAddMore = acceptMultiple && (!maxFiles || files.length < maxFiles);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const items: PdfFile[] = arr.map(f => ({ id: crypto.randomUUID(), file: f }));
    setFiles(prev => {
      const next = acceptMultiple ? [...prev, ...items] : [items[0]];
      return maxFiles ? next.slice(0, maxFiles) : next;
    });
    setResult(null);
    setError(null);
  }, [acceptMultiple, maxFiles]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setResult(null);
  };

  const handleProcess = async () => {
    if (!files.length || processing) return;
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const blob = await onProcess(files.map(f => f.file));
      if (blob) {
        if (result?.url) URL.revokeObjectURL(result.url);
        setResult({ blob, url: URL.createObjectURL(blob) });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed. Make sure your PDF is not corrupted.");
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = outputFilename;
    a.click();
  };

  const ext = outputFilename.split(".").pop()?.toUpperCase() ?? "PDF";
  const outputMimeLabel = outputMime === "application/zip" ? "ZIP" : ext;

  return (
    <div>
      {/* Landing — no card */}
      {files.length === 0 && (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-8rem)] transition-colors px-6 sm:px-10",
            dragOver && "bg-neutral-50/60 rounded-2xl",
          )}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false); }}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        >
          <div className="text-center space-y-3 max-w-lg">
            {title && <h2 className="text-5xl font-bold tracking-tight text-foreground">{title}</h2>}
            {description && <p className="text-[18px] text-muted-foreground">{description}</p>}
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full max-w-md h-16 rounded-2xl bg-foreground text-white text-[16px] font-semibold hover:bg-foreground/90 active:scale-[0.99] transition-all"
          >
            Select PDF File{acceptMultiple ? "s" : ""}
          </button>
          <p className="text-[13px] text-muted-foreground">or drag and drop your PDF here</p>
        </div>
      )}

      {/* Active — full-viewport, no card */}
      {files.length > 0 && (
        <div className="flex min-h-[calc(100vh-4rem)]">

          {/* Left: file area on page background */}
          <div className="flex-1 px-6 sm:px-10 pt-6 pb-10 space-y-3 min-w-0">
            {/* Nav */}
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-2">
              <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0">
                <CaretLeft size={11} weight="bold" />All tools
              </Link>
              <span>/</span>
              {title && <span className="text-foreground font-medium truncate">{title}</span>}
            </div>

            {/* Add more drop zone */}
            {canAddMore && (
              <div
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 cursor-pointer transition-colors",
                  dragOver ? "border-foreground/30 bg-neutral-50" : "hover:border-foreground/20 hover:bg-neutral-50/60",
                )}
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false); }}
                onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
              >
                <UploadSimple size={13} className="text-neutral-400" />
                <p className="text-[12px] text-muted-foreground">
                  Add more {maxFiles ? `(${files.length}/${maxFiles})` : `(${files.length} added)`}
                </p>
              </div>
            )}

            {/* File list */}
            <div className="space-y-1.5">
              {files.map(({ id, file }) => (
                <div key={id} className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white ring-1 ring-black/5">
                  <FilePdf size={18} className="shrink-0 text-red-400" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[12px] font-medium text-foreground">{file.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                  <button onClick={() => removeFile(id)} className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: sticky full-height sidebar */}
          <div className="w-80 shrink-0 border-l border-border bg-white sticky top-16 h-[calc(100vh-4rem)] flex flex-col p-6 gap-4 overflow-y-auto">
            {title && <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>}

            {/* Settings or instructions */}
            {settingsNode ? (
              <div className="space-y-3">{settingsNode}</div>
            ) : instructions ? (
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">How to use</p>
                {instructions.map(({ n, text }) => (
                  <div key={n} className="flex gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-bold text-neutral-500">{n}</span>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Error */}
            {error && (
              <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>
            )}

            {/* Result */}
            {result && (
              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
                <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="flex-1 text-[12px] text-emerald-700 font-medium">
                  {outputMimeLabel} ready · {formatBytes(result.blob.size)}
                </p>
                <SoftPillButton variant="primary" onClick={download} className="h-8 px-3 text-[12px]">
                  <DownloadSimple size={12} />Download
                </SoftPillButton>
              </div>
            )}

            {/* Action */}
            <div className="mt-auto">
              <SoftPillButton variant="primary" onClick={handleProcess} disabled={processing} className="w-full h-12 text-[14px]">
                {processing ? <><CircleNotch size={14} className="animate-spin" />Processing…</> : processLabel}
              </SoftPillButton>
              <p className="mt-2 text-center text-[11px] text-muted-foreground/60">Runs locally · no upload</p>
            </div>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} multiple={acceptMultiple} className="hidden"
        onChange={e => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
