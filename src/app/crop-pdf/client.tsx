"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";

export default function CropPdfClient() {
  const [top, setTop]       = useState(0);
  const [right, setRight]   = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft]     = useState(0);

  const inputCls = "w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors";

  return (
    <PdfToolShell
      title="Crop PDF"
      processLabel="Crop PDF"
      outputFilename="cropped.pdf"
      settingsNode={
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Margins to remove (pt)</p>
          <div className="grid grid-cols-2 gap-2">
            {([["Top", top, setTop], ["Right", right, setRight], ["Bottom", bottom, setBottom], ["Left", left, setLeft]] as const).map(
              ([label, val, setter]) => (
                <div key={label}>
                  <p className="text-[10px] text-muted-foreground/70 mb-0.5">{label}</p>
                  <input type="number" min={0} value={val}
                    onChange={e => (setter as (v: number) => void)(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
              )
            )}
          </div>
          <p className="text-[10px] text-muted-foreground/50 mt-1.5 leading-tight">Adjusts the CropBox of every page. 1 pt â‰ˆ 0.35 mm.</p>
        </div>
      }
      onProcess={async (files) => {
        const { PDFDocument } = await import("pdf-lib");
        const doc = await PDFDocument.load(await files[0].arrayBuffer());
        doc.getPages().forEach(page => {
          const { width, height } = page.getSize();
          page.setCropBox(left, bottom, width - left - right, height - top - bottom);
        });
        return new Blob([(await doc.save()) as unknown as BlobPart], { type: "application/pdf" });
      }}
    />
  );
}
