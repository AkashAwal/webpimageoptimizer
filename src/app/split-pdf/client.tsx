"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";
import { cn } from "@/lib/utils";

export default function SplitPdfClient() {
  const [mode, setMode] = useState<"individual" | "ranges">("individual");
  const [ranges, setRanges] = useState("");

  return (
    <PdfToolShell
      title="Split PDF"
      processLabel="Split PDF"
      outputFilename="split.zip"
      outputMime="application/zip"
      settingsNode={
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Split mode</p>
            <div className="flex gap-1.5">
              <button onClick={() => setMode("individual")}
                className={cn("flex-1 rounded-lg py-1.5 text-[12px] font-medium transition-colors",
                  mode === "individual" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                Every page
              </button>
              <button onClick={() => setMode("ranges")}
                className={cn("flex-1 rounded-lg py-1.5 text-[12px] font-medium transition-colors",
                  mode === "ranges" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                By ranges
              </button>
            </div>
          </div>
          {mode === "ranges" && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Page ranges</p>
              <input type="text" placeholder="e.g. 1-3, 4-6, 7"
                value={ranges} onChange={e => setRanges(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1 leading-tight">Each range becomes a separate PDF file in a ZIP.</p>
            </div>
          )}
        </div>
      }
      onProcess={async (files) => {
        const { PDFDocument } = await import("pdf-lib");
        const { default: JSZip } = await import("jszip");
        const { parsePageRanges } = await import("@/lib/pdf-utils");

        const srcBytes = await files[0].arrayBuffer();
        const src = await PDFDocument.load(srcBytes);
        const total = src.getPageCount();
        const zip = new JSZip();

        const groups: number[][] = mode === "individual"
          ? Array.from({ length: total }, (_, i) => [i])
          : ranges.split(",").map(r => parsePageRanges(r.trim(), total));

        for (let g = 0; g < groups.length; g++) {
          const indices = groups[g];
          if (!indices.length) continue;
          const out = await PDFDocument.create();
          const pages = await out.copyPages(src, indices);
          pages.forEach(p => out.addPage(p));
          const bytes = await out.save();
          zip.file(`part_${g + 1}.pdf`, bytes);
        }

        return zip.generateAsync({ type: "blob" });
      }}
    />
  );
}
