"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";

export default function RemovePdfPagesClient() {
  const [pages, setPages] = useState("");

  return (
    <PdfToolShell
      title="Remove PDF Pages"
      processLabel="Remove Pages"
      outputFilename="removed.pdf"
      settingsNode={
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Pages to remove</p>
          <input type="text" placeholder="e.g. 2, 4-6, 9"
            value={pages} onChange={e => setPages(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
          />
          <p className="text-[10px] text-muted-foreground/60 mt-1 leading-tight">Separate pages with commas. Use a hyphen for ranges (e.g. 3-7).</p>
        </div>
      }
      onProcess={async (files) => {
        if (!pages.trim()) throw new Error("Enter at least one page number to remove.");
        const { PDFDocument } = await import("pdf-lib");
        const { parsePageRanges } = await import("@/lib/pdf-utils");

        const doc = await PDFDocument.load(await files[0].arrayBuffer());
        const total = doc.getPageCount();
        const toRemove = new Set(parsePageRanges(pages, total));
        const toKeep = Array.from({ length: total }, (_, i) => i).filter(i => !toRemove.has(i));

        if (!toKeep.length) throw new Error("You cannot remove all pages from a PDF.");

        const out = await PDFDocument.create();
        const kept = await out.copyPages(doc, toKeep);
        kept.forEach(p => out.addPage(p));

        return new Blob([await out.save()], { type: "application/pdf" });
      }}
    />
  );
}
