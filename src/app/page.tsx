"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import FileDropzone from "@/components/FileDropzone";
import ImageCard, { ImageItem, ImageStatus } from "@/components/ImageCard";
import QualityControls, { OptimizeOptions } from "@/components/QualityControls";
import StatsPanel from "@/components/StatsPanel";
import { useTheme } from "@/context/ThemeContext";
import { Zap, Download, Trash2, FolderOpen, Sun, Moon, AlertCircle, X } from "lucide-react";

const DEFAULT_OPTIONS: OptimizeOptions = {
  quality: 75,
  nearLossless: false,
  stripMetadata: true,
  format: "webp",
  maxWidth: "2400",
  maxHeight: "",
  renameTemplate: "",
  sizeBudget: "",
};

let idCounter = 0;

export default function Home() {
  const { theme, toggle: toggleTheme } = useTheme();

  const [items, setItems] = useState<ImageItem[]>([]);
  const [options, setOptions] = useState<OptimizeOptions>(DEFAULT_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [dupeWarning, setDupeWarning] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const updateItem = useCallback((id: string, patch: Partial<ImageItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    setItems((prev) => {
      const existingKeys = new Set(prev.map((it) => `${it.file.name}_${it.file.size}`));
      const dupes: string[] = [];
      const fresh: ImageItem[] = [];
      for (const file of files) {
        const key = `${file.name}_${file.size}`;
        if (existingKeys.has(key)) { dupes.push(file.name); }
        else {
          existingKeys.add(key);
          fresh.push({ id: `img_${++idCounter}`, file, preview: URL.createObjectURL(file), status: "pending" as ImageStatus });
        }
      }
      if (dupes.length > 0) {
        setDupeWarning(dupes.length === 1
          ? `"${dupes[0]}" is already in the queue — skipped.`
          : `${dupes.length} duplicate files already in the queue were skipped.`
        );
      }
      return [...prev, ...fresh];
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const handleClearAll = () => {
    items.forEach((it) => URL.revokeObjectURL(it.preview));
    setItems([]);
    setDupeWarning(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleOptimize = useCallback(async () => {
    const pending = items.filter((it) => it.status === "pending");
    if (pending.length === 0) return;
    setIsProcessing(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const BATCH = 1;
    for (let i = 0; i < pending.length; i += BATCH) {
      if (controller.signal.aborted) break;
      const batch = pending.slice(i, i + BATCH);
      batch.forEach((it) => updateItem(it.id, { status: "processing" }));
      const formData = new FormData();
      batch.forEach((it) => formData.append("files", it.file));
      formData.append("quality", options.quality.toString());
      formData.append("nearLossless", options.nearLossless.toString());
      formData.append("stripMetadata", options.stripMetadata.toString());
      formData.append("format", options.format);
      formData.append("startIndex", (i + 1).toString());
      if (options.maxWidth) formData.append("maxWidth", options.maxWidth);
      if (options.maxHeight) formData.append("maxHeight", options.maxHeight);
      if (options.renameTemplate) formData.append("renameTemplate", options.renameTemplate);
      try {
        const res = await fetch("/api/optimize", { method: "POST", body: formData, signal: controller.signal });
        if (!res.ok) {
          const err = await res.json();
          batch.forEach((it) => updateItem(it.id, { status: "error", error: err.error || "Server error" }));
          continue;
        }
        const { results } = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        results.forEach((result: any, idx: number) => {
          const item = batch[idx];
          if (!item) return;
          if (result.error) updateItem(item.id, { status: "error", error: result.error });
          else updateItem(item.id, { status: "done", result });
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") break;
        batch.forEach((it) => updateItem(it.id, { status: "error", error: (err as Error).message }));
      }
    }
    setIsProcessing(false);
    abortRef.current = null;
  }, [items, options, updateItem]);

  const handleStop = () => {
    abortRef.current?.abort();
    setIsProcessing(false);
    setItems((prev) => prev.map((it) => it.status === "processing" ? { ...it, status: "pending" } : it));
  };

  const handleDownloadAll = async () => {
    const done = items.filter((it) => it.status === "done" && it.result);
    if (done.length === 0) return;
    setIsZipping(true);
    try {
      const res = await fetch("/api/download-zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filenames: done.map((it) => it.result!.outputName) }),
      });
      if (!res.ok) throw new Error("Failed to create ZIP");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "optimized_images.zip"; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`ZIP error: ${(err as Error).message}`);
    } finally {
      setIsZipping(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isProcessing) { e.preventDefault(); handleStop(); }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isProcessing) { e.preventDefault(); handleOptimize(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isProcessing, handleOptimize]);

  const pendingCount = items.filter((it) => it.status === "pending").length;
  const doneItems = items.filter((it) => it.status === "done" && it.result);
  const totalOriginalBytes = doneItems.reduce((s, it) => s + (it.result?.originalSize ?? 0), 0);
  const totalOptimizedBytes = doneItems.reduce((s, it) => s + (it.result?.optimizedSize ?? 0), 0);
  const sizeBudgetKB = options.sizeBudget ? parseInt(options.sizeBudget) : undefined;
  const overBudgetCount = sizeBudgetKB
    ? doneItems.filter((it) => it.result && it.result.optimizedSize > sizeBudgetKB * 1024).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-gray-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-600 rounded-xl">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-zinc-800 dark:text-zinc-100">PixGarage</h1>
              <p className="text-xs text-gray-400 dark:text-zinc-500">Bulk image compression</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-400 transition-colors"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {doneItems.length > 0 && (
              <button onClick={handleDownloadAll} disabled={isZipping}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl text-sm font-medium text-white transition-colors">
                <Download className="w-4 h-4" />
                {isZipping ? "Packing…" : `ZIP (${doneItems.length})`}
              </button>
            )}
            {items.length > 0 && (
              <button onClick={handleClearAll} disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50 rounded-xl text-sm text-gray-500 dark:text-zinc-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 space-y-5">
        <StatsPanel
          total={items.length} done={doneItems.length}
          totalOriginalBytes={totalOriginalBytes} totalOptimizedBytes={totalOptimizedBytes}
          overBudgetCount={overBudgetCount}
        />

        {dupeWarning && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300 flex-1">{dupeWarning}</p>
            <button onClick={() => setDupeWarning(null)} className="text-amber-400 hover:text-amber-600 dark:hover:text-amber-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
          <div className="space-y-4">
            <FileDropzone onFiles={handleFiles} disabled={isProcessing} />
            {items.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs text-gray-400 dark:text-zinc-500">{items.length} image{items.length !== 1 ? "s" : ""} queued</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500">Drag to reorder</p>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                  <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <ImageCard key={item.id} item={item} onRemove={handleRemove} sizeBudgetKB={sizeBudgetKB} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-300 dark:text-zinc-600 text-sm">
                <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Drop images above to get started
              </div>
            )}
          </div>

          <div className="space-y-3 lg:sticky lg:top-20">
            <QualityControls options={options} onChange={setOptions} disabled={isProcessing} />
            {isProcessing ? (
              <button onClick={handleStop}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-red-600 hover:bg-red-500 text-white transition-colors">
                Stop Processing
              </button>
            ) : (
              <button onClick={handleOptimize} disabled={pendingCount === 0}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                {pendingCount > 0 ? `Optimize ${pendingCount} image${pendingCount !== 1 ? "s" : ""}` : "No images to process"}
              </button>
            )}
            <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50 rounded-xl p-3.5 space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Keyboard shortcuts</p>
              <div className="space-y-1.5 text-xs text-gray-400 dark:text-zinc-500">
                <div className="flex justify-between">
                  <span>Start optimizing</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[10px] font-mono text-gray-500 dark:text-zinc-400">⌘ Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Stop processing</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[10px] font-mono text-gray-500 dark:text-zinc-400">Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
