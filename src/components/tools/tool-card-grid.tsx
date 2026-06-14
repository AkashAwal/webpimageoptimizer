"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { TOOL_ICONS } from "@/lib/tool-icons";
import type { Tool } from "@/lib/tools";

interface ToolCardGridProps {
  tools: readonly Tool[];
}

export function ToolCardGrid({ tools }: ToolCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <div
          key={tool.href}
          className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
              {TOOL_ICONS[tool.href]}
            </div>
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 ring-1 ring-black/5">
              {tool.badge}
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
              <Link
                href={tool.href}
                className="underline underline-offset-2 decoration-neutral-300 hover:decoration-foreground transition-colors"
              >
                {tool.name}
              </Link>
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{tool.description}</p>
          </div>

          <Link
            href={tool.href}
            aria-label={`Use ${tool.name}`}
            className="giti-shimmer-pill inline-flex w-full h-9 items-center justify-center gap-2 rounded-full px-3 text-[13px] font-medium leading-none tracking-tight backdrop-blur transition-all active:scale-[0.99] text-white ring-1 ring-white/10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.12)]"
          >
            Use tool
            <ArrowRight size={12} />
          </Link>
        </div>
      ))}
    </div>
  );
}
