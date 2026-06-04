"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";
import { cn } from "@/lib/utils";

type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function WatermarkPdfClient() {
  const [text, setText] = useState("");
  const [position, setPosition] = useState<Position>("center");
  const [opacity, setOpacity] = useState(30);
  const [size, setSize] = useState(48);

  const POSITIONS: { id: Position; label: string }[] = [
    { id: "top-left", label: "â†–" }, { id: "top-right", label: "â†—" },
    { id: "center", label: "âŠ™" },
    { id: "bottom-left", label: "â†™" }, { id: "bottom-right", label: "â†˜" },
  ];

  return (
    <PdfToolShell
      title="Watermark PDF"
      processLabel="Add Watermark"
      outputFilename="watermarked.pdf"
      settingsNode={
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Watermark text</p>
            <input type="text" placeholder="e.g. CONFIDENTIAL"
              value={text} onChange={e => setText(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Position</p>
              <div className="grid grid-cols-3 gap-0.5 w-fit">
                {POSITIONS.map(p => (
                  <button key={p.id} onClick={() => setPosition(p.id)}
                    className={cn("size-7 rounded flex items-center justify-center text-[13px] transition-colors",
                      p.id === "center" && "col-start-2",
                      position === p.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200")}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Opacity</p>
                  <span className="text-[11px] text-muted-foreground">{opacity}%</span>
                </div>
                <input type="range" min={5} max={100} value={opacity} onChange={e => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 cursor-pointer accent-foreground" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Size (pt)</p>
                  <span className="text-[11px] text-muted-foreground">{size}</span>
                </div>
                <input type="range" min={12} max={120} value={size} onChange={e => setSize(Number(e.target.value))}
                  className="w-full h-1.5 cursor-pointer accent-foreground" />
              </div>
            </div>
          </div>
        </div>
      }
      onProcess={async (files) => {
        if (!text.trim()) throw new Error("Please enter watermark text.");
        const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib");
        const doc = await PDFDocument.load(await files[0].arrayBuffer());
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        const alpha = opacity / 100;
        const r = alpha, g = alpha, b = alpha; // grey watermark

        doc.getPages().forEach(page => {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(text, size);
          const textHeight = font.heightAtSize(size);
          const pad = 20;

          let x: number, y: number, rot = 0;
          if (position === "center") {
            x = width / 2 - textWidth / 2;
            y = height / 2 - textHeight / 2;
            rot = 45;
          } else {
            const left = position.includes("left");
            const top = position.includes("top");
            x = left ? pad : width - textWidth - pad;
            y = top ? height - textHeight - pad : pad;
          }

          page.drawText(text, {
            x, y, size,
            font,
            color: rgb(1 - alpha * 0.8, 1 - alpha * 0.8, 1 - alpha * 0.8),
            opacity: alpha,
            rotate: degrees(rot),
          });
        });

        return new Blob([(await doc.save()) as unknown as BlobPart], { type: "application/pdf" });
      }}
    />
  );
}
