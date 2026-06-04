"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";
import { cn } from "@/lib/utils";

export default function PdfPageNumbersClient() {
  const [position, setPosition] = useState<"bottom-center" | "bottom-right" | "top-center" | "top-right">("bottom-center");
  const [startAt, setStartAt] = useState(1);
  const [format, setFormat] = useState<"n" | "n/total" | "page n">("n");

  return (
    <PdfToolShell
      title="PDF Page Numbers"
      processLabel="Add Page Numbers"
      outputFilename="numbered.pdf"
      settingsNode={
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Position</p>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                { id: "bottom-center", label: "Bottom centre" },
                { id: "bottom-right",  label: "Bottom right"  },
                { id: "top-center",    label: "Top centre"    },
                { id: "top-right",     label: "Top right"     },
              ] as const).map(p => (
                <button key={p.id} onClick={() => setPosition(p.id)}
                  className={cn("rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                    position === p.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Format</p>
              <div className="space-y-1">
                {([
                  { id: "n", label: "1, 2, 3 …" },
                  { id: "n/total", label: "1/10, 2/10 …" },
                  { id: "page n", label: "Page 1, Page 2 …" },
                ] as const).map(f => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" checked={format === f.id} onChange={() => setFormat(f.id)} className="accent-foreground" />
                    <span className="text-[12px] text-foreground">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Start at</p>
              <input type="number" min={1} value={startAt} onChange={e => setStartAt(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
              />
            </div>
          </div>
        </div>
      }
      onProcess={async (files) => {
        const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
        const doc = await PDFDocument.load(await files[0].arrayBuffer());
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const pages = doc.getPages();
        const total = pages.length;
        const fontSize = 10;
        const pad = 18;

        pages.forEach((page, i) => {
          const { width, height } = page.getSize();
          const n = i + startAt;
          let label = "";
          if (format === "n") label = String(n);
          else if (format === "n/total") label = `${n}/${total + startAt - 1}`;
          else label = `Page ${n}`;

          const textWidth = font.widthOfTextAtSize(label, fontSize);
          const top = position.startsWith("top");
          const centre = position.includes("center");

          const x = centre ? (width - textWidth) / 2 : width - textWidth - pad;
          const y = top ? height - pad : pad - fontSize / 2;

          page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.4, 0.4, 0.4) });
        });

        return new Blob([await doc.save()], { type: "application/pdf" });
      }}
    />
  );
}
