"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { UploadSimple, FilePdf, DownloadSimple, CircleNotch, CaretLeft, X, CopySimple, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function OcrPdfClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const LANGS = [
    { id: "eng", label: "English" },
    { id: "fra", label: "French" },
    { id: "deu", label: "German" },
    { id: "spa", label: "Spanish" },
    { id: "por", label: "Portuguese" },
    { id: "chi_sim", label: "Chinese (Simplified)" },
  ];

  const process = async () => {
    if (!file || processing) return;
    setProcessing(true); setError(null); setText(null); setProgress("Loading PDF renderer…");
    try {
      const { getPdfJs } = await import("@/lib/pdf-utils");
      const { createWorker } = await import("tesseract.js");

      setProgress("Loading OCR engine…");
      const worker = await createWorker(lang);

      const lib = await getPdfJs();
      const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
      const total = pdf.numPages;
      const parts: string[] = [];

      for (let i = 1; i <= total; i++) {
        setProgress(`Scanning page ${i} of ${total}…`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
        const { data: { text: t } } = await worker.recognize(canvas);
        parts.push(`--- Page ${i} ---\n${t.trim()}`);
        page.cleanup();
      }

      await worker.terminate();
      setText(parts.join("\n\n"));
      setProgress("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR failed.");
      setProgress("");
    } finally {
      setProcessing(false);
    }
  };

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "extracted.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-6 py-3 sm:py-4">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] bg-white">
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-neutral-50/60">
          <Link href="/" className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <CaretLeft size={11} weight="bold" />All tools
          </Link>
          <span className="text-neutral-300 text-[12px]">/</span>
          <h1 className="text-[13px] font-semibold text-foreground">OCR PDF</h1>
        </div>

        <div className="p-4 space-y-3">
          {!file ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-10 cursor-pointer hover:border-foreground/20 transition-colors"
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setText(null); } }}>
              <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500"><UploadSimple size={20} /></div>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-foreground">Drop your PDF here</p>
                <p className="mt-1 text-[12px] text-muted-foreground">Scanned or image-based PDFs · extracts text</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white ring-1 ring-black/5">
              <FilePdf size={18} className="shrink-0 text-red-400" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-[12px] font-medium text-foreground">{file.name}</p>
                <p className="text-[11px] text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setText(null); }} className="rounded-lg p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={13} />
              </button>
            </div>
          )}

          {file && (
            <div className="rounded-xl bg-neutral-50 ring-1 ring-black/5 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Document language</p>
              <select value={lang} onChange={e => setLang(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors cursor-pointer">
                {LANGS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
              <p className="text-[10px] text-muted-foreground/60 mt-1 leading-tight">Language model downloaded on first use (~10 MB). May take 30–60 s per page on large files.</p>
            </div>
          )}

          {processing && progress && (
            <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <CircleNotch size={13} className="animate-spin shrink-0" />{progress}
            </p>
          )}

          {error && <p className="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2 ring-1 ring-red-100">{error}</p>}

          {text !== null && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-foreground">Extracted text</p>
                <div className="flex gap-1.5">
                  <button onClick={copy} className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">
                    {copied ? <Check size={11} className="text-emerald-500" /> : <CopySimple size={11} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={download} className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">
                    <DownloadSimple size={11} />Save .txt
                  </button>
                </div>
              </div>
              <textarea readOnly value={text}
                className="w-full h-48 rounded-xl border border-border bg-neutral-50 px-3 py-2 text-[11px] font-mono text-foreground resize-none outline-none"
              />
            </div>
          )}

          <SoftPillButton variant="primary" onClick={process} disabled={!file || processing} className="w-full h-9 text-[12px]">
            {processing ? <><CircleNotch size={12} className="animate-spin" />Scanning…</> : "Extract Text (OCR)"}
          </SoftPillButton>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setText(null); } e.target.value = ""; }} />
    </div>
  );
}
