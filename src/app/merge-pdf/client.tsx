"use client";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";

export default function MergePdfClient() {
  return (
    <PdfToolShell
      title="Merge PDF"
      acceptMultiple
      processLabel="Merge PDFs"
      outputFilename="merged.pdf"
      onProcess={async (files) => {
        const { PDFDocument } = await import("pdf-lib");
        const merged = await PDFDocument.create();
        for (const file of files) {
          const doc = await PDFDocument.load(await file.arrayBuffer());
          const pages = await merged.copyPages(doc, doc.getPageIndices());
          pages.forEach(p => merged.addPage(p));
        }
        return new Blob([(await merged.save()) as unknown as BlobPart], { type: "application/pdf" });
      }}
    />
  );
}
