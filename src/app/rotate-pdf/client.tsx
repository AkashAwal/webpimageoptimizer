"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";
import { cn } from "@/lib/utils";

const ANGLES = [90, 180, 270] as const;

export default function RotatePdfClient() {
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [target, setTarget] = useState<"all" | "even" | "odd" | "custom">("all");
  const [customPages, setCustomPages] = useState("");

  return (
    <PdfToolShell
      title="Rotate PDF"
      description="Fix or change the page orientation of your PDF."
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
                  {a}°
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Apply to</p>
            <div className="grid grid-cols-4 gap-1.5">
              {(["all", "even", "odd", "custom"] as const).map(t => (
                <button key={t} onClick={() => setTarget(t)}
                  className={cn("rounded-lg py-1.5 text-[12px] font-medium capitalize transition-colors",
                    target === t ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                  {t}
                </button>
              ))}
            </div>
            {target === "custom" && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="e.g. 1, 3-5, 7"
                  value={customPages}
                  onChange={e => setCustomPages(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
                />
                <p className="text-[10px] text-muted-foreground/60 mt-1 leading-tight">Comma-separated page numbers or ranges.</p>
              </div>
            )}
          </div>
        </div>
      }
      onProcess={async (files) => {
        const { PDFDocument, degrees } = await import("pdf-lib");
        const { parsePageRanges } = await import("@/lib/pdf-utils");
        const doc = await PDFDocument.load(await files[0].arrayBuffer());
        const total = doc.getPageCount();

        let targetIndices: Set<number> | null = null;
        if (target === "custom") {
          const indices = customPages.split(",").flatMap(r => parsePageRanges(r.trim(), total));
          targetIndices = new Set(indices);
        }

        doc.getPages().forEach((page, i) => {
          const n = i + 1;
          const shouldRotate =
            target === "all" ||
            (target === "even" && n % 2 === 0) ||
            (target === "odd" && n % 2 !== 0) ||
            (target === "custom" && targetIndices!.has(i));
          if (shouldRotate) {
            const cur = page.getRotation().angle;
            page.setRotation(degrees((cur + angle) % 360));
          }
        });
        return new Blob([(await doc.save()) as unknown as BlobPart], { type: "application/pdf" });
      }}
    />
  );
}
