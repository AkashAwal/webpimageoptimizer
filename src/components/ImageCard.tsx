"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Download, CheckCircle, XCircle, Loader2, Eye, EyeOff,
  ChevronDown, ChevronUp, Clipboard, ClipboardCheck, Code2, GripVertical, AlertTriangle,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

export type ImageStatus = "pending" | "processing" | "done" | "error";

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  status: ImageStatus;
  result?: {
    originalName: string;
    outputName: string;
    originalSize: number;
    optimizedSize: number;
    savedBytes: number;
    savedPercent: number;
    width: number;
    height: number;
    wasAlreadyWebp: boolean;
    outputPath: string;
    backupPath: string;
  };
  error?: string;
}

interface Props {
  item: ImageItem;
  onRemove: (id: string) => void;
  sizeBudgetKB?: number;
}

function CssExportPanel({ outputPath, outputName, onClose }: { outputPath: string; outputName: string; onClose: () => void }) {
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<"css" | "tailwind" | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(outputPath);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => setBase64(reader.result as string);
      reader.readAsDataURL(blob);
    } catch {
      setBase64("error");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string, type: "css" | "tailwind") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const cssSnippet = base64 ? `.element {\n  background-image: url("${base64}");\n  background-size: cover;\n}` : "";
  const tailwindSnippet = base64 ? `style={{ backgroundImage: 'url("${base64}")' }}` : "";
  const isLarge = base64 && base64.length > 150_000;

  return (
    <div className="border-t border-gray-100 dark:border-zinc-800 p-3 space-y-3 bg-gray-50/50 dark:bg-zinc-950/40">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">CSS / Tailwind Export</p>
        <button onClick={onClose} className="text-[10px] text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300">✕ close</button>
      </div>

      {!base64 && !loading && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-400 dark:text-zinc-500">Embeds the image as base64 — best for small images (&lt;50KB).</p>
          <button onClick={load} className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors">
            Generate snippets
          </button>
        </div>
      )}

      {loading && <p className="text-xs text-gray-400 dark:text-zinc-500 text-center py-2">Generating…</p>}

      {base64 === "error" && <p className="text-xs text-red-500">Failed to load image.</p>}

      {base64 && base64 !== "error" && (
        <div className="space-y-2">
          {isLarge && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Large image ({Math.round(base64.length / 1024)}KB encoded). Consider using a URL instead.
            </p>
          )}
          {[
            { label: "CSS", content: cssSnippet, type: "css" as const },
            { label: "Tailwind", content: tailwindSnippet, type: "tailwind" as const },
          ].map(({ label, content, type }) => (
            <div key={type} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase">{label}</span>
                <button
                  onClick={() => copy(content, type)}
                  className="text-[10px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium flex items-center gap-1"
                >
                  {copied === type ? <><ClipboardCheck className="w-3 h-3" />Copied!</> : <><Clipboard className="w-3 h-3" />Copy</>}
                </button>
              </div>
              <pre className="text-[10px] bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-gray-600 dark:text-zinc-400 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-20">
                {content.length > 200 ? content.slice(0, 200) + "…" : content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ImageCard({ item, onRemove, sizeBudgetKB }: Props) {
  const [showCompare, setShowCompare] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showCssExport, setShowCssExport] = useState(false);
  const [copied, setCopied] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const isOverBudget = sizeBudgetKB && item.result
    ? item.result.optimizedSize > sizeBudgetKB * 1024
    : false;

  const handleDownload = () => {
    if (!item.result) return;
    const a = document.createElement("a");
    a.href = item.result.outputPath;
    a.download = item.result.outputName;
    a.click();
  };

  const handleCopy = async () => {
    if (!item.result) return;
    try {
      const res = await fetch(item.result.outputPath);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy URL
      await navigator.clipboard.writeText(window.location.origin + item.result.outputPath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const savingsBadgeColor =
    isOverBudget ? "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30" :
    item.result && item.result.savedPercent >= 50 ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30" :
    item.result && item.result.savedPercent >= 20 ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-500/30" :
    "bg-gray-100 dark:bg-zinc-700/50 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-600/30";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden transition-all
        ${isDragging ? "opacity-50 shadow-2xl z-50" : ""}
        ${isOverBudget ? "border-red-200 dark:border-red-500/40" : item.status === "error" ? "border-red-200 dark:border-red-500/40" : "border-gray-100 dark:border-zinc-800"}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 p-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-300 dark:text-zinc-600 hover:text-gray-500 dark:hover:text-zinc-400 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
          tabIndex={-1}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Thumbnail */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
          <img
            src={showCompare && item.result && !showOriginal ? item.result.outputPath : item.preview}
            alt="preview"
            className="w-full h-full object-cover"
          />
          {item.status === "processing" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium truncate">{item.file.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {item.status === "pending" && <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-zinc-600" />}
            {item.status === "processing" && <Loader2 className="w-3 h-3 text-violet-500 animate-spin" />}
            {item.status === "done" && <CheckCircle className="w-3 h-3 text-emerald-500" />}
            {item.status === "error" && <XCircle className="w-3 h-3 text-red-500" />}

            <span className="text-xs text-gray-400 dark:text-zinc-500">
              {item.status === "pending" && "Waiting…"}
              {item.status === "processing" && <span className="text-violet-500">Optimizing…</span>}
              {item.status === "done" && item.result && `${formatBytes(item.result.originalSize)} → ${formatBytes(item.result.optimizedSize)}`}
              {item.status === "error" && <span className="text-red-500 truncate block max-w-[180px]">{item.error}</span>}
            </span>

            {isOverBudget && (
              <span className="flex items-center gap-0.5 text-[10px] text-red-500">
                <AlertTriangle className="w-2.5 h-2.5" /> over budget
              </span>
            )}
          </div>
        </div>

        {/* Savings badge */}
        {item.status === "done" && item.result && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${savingsBadgeColor}`}>
            {isOverBudget ? `>${sizeBudgetKB}KB` : `-${item.result.savedPercent}%`}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {item.status === "done" && item.result && (
            <>
              <button onClick={() => { setShowCompare(!showCompare); if (!expanded) setExpanded(true); }} title="Before/after preview"
                className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                {showCompare ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button onClick={handleCopy} title="Copy to clipboard"
                className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                {copied ? <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => { setShowCssExport(!showCssExport); if (!expanded) setExpanded(true); }} title="Export as CSS"
                className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <Code2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleDownload} title="Download"
                className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-gray-300 dark:text-zinc-600 hover:text-gray-500 dark:hover:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => onRemove(item.id)}
            className="p-1.5 rounded-lg text-gray-300 dark:text-zinc-700 hover:text-red-500 hover:bg-red-50 dark:hover:bg-zinc-800 transition-colors">
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded stats + compare */}
      {expanded && item.status === "done" && item.result && !showCssExport && (
        <div className="border-t border-gray-100 dark:border-zinc-800 p-3 space-y-3">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Original", value: formatBytes(item.result.originalSize), color: "text-zinc-700 dark:text-zinc-200" },
              { label: "Optimized", value: formatBytes(item.result.optimizedSize), color: "text-emerald-600 dark:text-emerald-300" },
              { label: "Saved", value: formatBytes(item.result.savedBytes), color: "text-blue-600 dark:text-blue-300" },
              { label: "Dimensions", value: `${item.result.width}×${item.result.height}`, color: "text-zinc-500 dark:text-zinc-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 dark:bg-zinc-800/60 rounded-lg p-2">
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase mb-0.5">{label}</p>
                <p className={`text-xs font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {showCompare && (
            <div className="space-y-2">
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                <button onClick={() => setShowOriginal(true)}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${showOriginal ? "bg-gray-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200" : "bg-white dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"}`}>
                  Original
                </button>
                <button onClick={() => setShowOriginal(false)}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${!showOriginal ? "bg-violet-600 text-white" : "bg-white dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"}`}>
                  Optimized
                </button>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-950">
                <img src={showOriginal ? item.preview : item.result.outputPath} alt={showOriginal ? "Original" : "Optimized"}
                  className="w-full max-h-52 object-contain" />
                <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full">
                  {showOriginal ? `Original · ${formatBytes(item.result.originalSize)}` : `Optimized · ${formatBytes(item.result.optimizedSize)}`}
                </span>
              </div>
            </div>
          )}

          {item.result.wasAlreadyWebp && (
            <p className="text-xs text-gray-400 dark:text-zinc-500 italic">Already WebP — compressed only.</p>
          )}
        </div>
      )}

      {/* CSS export panel */}
      {expanded && showCssExport && item.result && (
        <CssExportPanel
          outputPath={item.result.outputPath}
          outputName={item.result.outputName}
          onClose={() => setShowCssExport(false)}
        />
      )}
    </div>
  );
}
