"use client";

import { formatBytes } from "@/lib/utils";
import { TrendingDown, Images, Zap, AlertTriangle } from "lucide-react";

interface Props {
  total: number;
  done: number;
  totalOriginalBytes: number;
  totalOptimizedBytes: number;
  overBudgetCount?: number;
}

export default function StatsPanel({ total, done, totalOriginalBytes, totalOptimizedBytes, overBudgetCount = 0 }: Props) {
  const savedBytes = Math.max(0, totalOriginalBytes - totalOptimizedBytes);
  const savedPercent = totalOriginalBytes > 0 ? Math.round((savedBytes / totalOriginalBytes) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-lg flex-shrink-0">
          <Images className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-zinc-500">Processed</p>
          <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
            {done}<span className="text-gray-300 dark:text-zinc-600 text-sm font-normal">/{total}</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex-shrink-0">
          <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-zinc-500">Total saved</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-300">{formatBytes(savedBytes)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex-shrink-0">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-zinc-500">Reduction</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-300">{savedPercent}%</p>
        </div>
      </div>

      <div className={`bg-white dark:bg-zinc-900 border rounded-xl p-4 flex items-center gap-3
        ${overBudgetCount > 0 ? "border-red-200 dark:border-red-500/30" : "border-gray-100 dark:border-zinc-800"}`}>
        <div className={`p-2 rounded-lg flex-shrink-0 ${overBudgetCount > 0 ? "bg-red-50 dark:bg-red-500/10" : "bg-gray-50 dark:bg-zinc-800"}`}>
          <AlertTriangle className={`w-4 h-4 ${overBudgetCount > 0 ? "text-red-500 dark:text-red-400" : "text-gray-300 dark:text-zinc-600"}`} />
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-zinc-500">Over budget</p>
          <p className={`text-lg font-bold ${overBudgetCount > 0 ? "text-red-500 dark:text-red-400" : "text-gray-300 dark:text-zinc-600"}`}>
            {overBudgetCount}
          </p>
        </div>
      </div>
    </div>
  );
}
