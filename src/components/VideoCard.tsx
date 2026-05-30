"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Download, CheckCircle, XCircle, Loader2,
  ChevronDown, ChevronUp, GripVertical, Video,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

export type VideoStatus = "pending" | "processing" | "done" | "error";

export interface VideoItem {
  id: string;
  file: File;
  preview: string;
  status: VideoStatus;
  result?: {
    originalName: string;
    outputName: string;
    originalSize: number;
    compressedSize: number;
    savedBytes: number;
    savedPercent: number;
    width: number;
    height: number;
    duration: number;
    outputPath: string;
  };
  error?: string;
}

interface Props {
  item: VideoItem;
  onRemove: (id: string) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoCard({ item, onRemove }: Props) {
  const [expanded, setExpanded] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const handleDownload = () => {
    if (!item.result) return;
    const a = document.createElement("a");
    a.href = item.result.outputPath;
    a.download = item.result.outputName;
    a.click();
  };

  const savingsBadgeColor =
    item.result && item.result.savedPercent >= 50
      ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
      : item.result && item.result.savedPercent >= 20
      ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-500/30"
      : item.result && item.result.savedPercent < 0
      ? "bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-500/30"
      : "bg-gray-100 dark:bg-zinc-700/50 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-600/30";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden transition-all
        ${isDragging ? "opacity-50 shadow-2xl z-50" : ""}
        ${item.status === "error" ? "border-red-200 dark:border-red-500/40" : "border-gray-100 dark:border-zinc-800"}`}
    >
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
        <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center">
          <Video className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
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
              {item.status === "processing" && <span className="text-violet-500">Compressing…</span>}
              {item.status === "done" && item.result && `${formatBytes(item.result.originalSize)} → ${formatBytes(item.result.compressedSize)}`}
              {item.status === "error" && <span className="text-red-500 truncate block max-w-[200px]">{item.error}</span>}
            </span>
          </div>
        </div>

        {/* Savings badge */}
        {item.status === "done" && item.result && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${savingsBadgeColor}`}>
            {item.result.savedPercent >= 0 ? `-${item.result.savedPercent}%` : `+${Math.abs(item.result.savedPercent)}%`}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {item.status === "done" && item.result && (
            <button onClick={handleDownload} title="Download"
              className="p-1.5 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
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

      {/* Expanded stats */}
      {expanded && item.status === "done" && item.result && (
        <div className="border-t border-gray-100 dark:border-zinc-800 p-3">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Original", value: formatBytes(item.result.originalSize), color: "text-zinc-700 dark:text-zinc-200" },
              { label: "Compressed", value: formatBytes(item.result.compressedSize), color: "text-emerald-600 dark:text-emerald-300" },
              { label: "Saved", value: formatBytes(item.result.savedBytes), color: "text-blue-600 dark:text-blue-300" },
              { label: "Duration", value: formatDuration(item.result.duration), color: "text-zinc-500 dark:text-zinc-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 dark:bg-zinc-800/60 rounded-lg p-2">
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 uppercase mb-0.5">{label}</p>
                <p className={`text-xs font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          {item.result.width > 0 && (
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-2 text-center">
              {item.result.width}×{item.result.height}px · WebM VP9
            </p>
          )}
        </div>
      )}
    </div>
  );
}
