"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";
import { cn } from "@/lib/utils";

const ANGLES = [90, 180, 270] as const;

export default function RotatePdfClient() {
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [target, setTarget] = useState<"all" | "even" | "odd">("all");

  return (
    <PdfToolShell
      title="Rotate PDF"
      processLabel="Rotate PDF"
      outputFilename="rotated.pdf"
      settingsNode={
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Rotation</p>
            <div className="flex gap-1.5">
              {ANGLES.map(a => (
                <button key={a} onClick={() => setAngle(a)}
                  className={cn("flex-1 rounded-lg py-1.5 text-[12px] font-medium transition-colors",
                    angle === a ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                  {a}Â°
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Apply to</p>
            <div className="flex gap-1.5">
              {(["all", "even", "odd"] as const).map(t => (
                <button key={t} onClick={() => setTarget(t)}
                  className={cn("flex-1 rounded-lg py-1.5 text-[12px] font-medium capitalize transition-colors",
                    target === t ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      onProcess={async (files) => {
        const { PDFDocument, degrees } = await import("pdf-lib");
        const doc = await PDFDocument.load(await files[0].arrayBuffer());
        doc.getPages().forEach((page, i) => {
          const n = i + 1;
          if (target === "all" || (target === "even" && n % 2 === 0) || (target === "odd" && n % 2 !== 0)) {
            const cur = page.getRotation().angle;
            page.setRotation(degrees((cur + angle) % 360));
          }
        });
        return new Blob([(await doc.save()) as unknown as BlobPart], { type: "application/pdf" });
      }}
    />
  );
}
