"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";

export default function UnlockPdfClient() {
  const [password, setPassword] = useState("");

  return (
    <PdfToolShell
      title="Unlock PDF"
      description="Remove the password from a PDF you already own."
      processLabel="Remove Password"
      outputFilename="unlocked.pdf"
      settingsNode={
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">PDF Password</p>
          <input
            type="password"
            placeholder="Enter the current password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
          />
          <p className="text-[10px] text-muted-foreground/60 mt-1 leading-tight">Pages are re-rendered as images — the output PDF has no selectable text.</p>
        </div>
      }
      onProcess={async (files) => {
        if (!password.trim()) throw new Error("Please enter the PDF password.");

        const { getPdfJs } = await import("@/lib/pdf-utils");
        const lib = await getPdfJs();

        let pdf: Awaited<ReturnType<typeof lib.getDocument>["promise"]>;
        try {
          pdf = await lib.getDocument({
            data: await files[0].arrayBuffer(),
            password,
          }).promise;
        } catch (e: unknown) {
          const err = e as { name?: string; code?: number };
          if (err?.name === "PasswordException" || err?.code === 1 || err?.code === 2) {
            throw new Error("Incorrect password. Please check and try again.");
          }
          throw new Error("Failed to open this PDF. It may be corrupted or use an unsupported encryption type.");
        }

        const { default: jsPDF } = await import("jspdf");
        const total = pdf.numPages;
        const SCALE = 2;

        // Initialise jsPDF from first page dimensions
        const firstPage = await pdf.getPage(1);
        const firstVp1 = firstPage.getViewport({ scale: 1 });
        const mmW = firstVp1.width * 0.3528;
        const mmH = firstVp1.height * 0.3528;
        const doc = new jsPDF({
          orientation: mmW >= mmH ? "landscape" : "portrait",
          unit: "mm",
          format: [mmW, mmH],
          compress: true,
        });

        for (let i = 1; i <= total; i++) {
          const page = await pdf.getPage(i);
          const vp1 = page.getViewport({ scale: 1 });
          const pageW = vp1.width * 0.3528;
          const pageH = vp1.height * 0.3528;

          if (i > 1) {
            doc.addPage([pageW, pageH], pageW >= pageH ? "landscape" : "portrait");
          }

          const vp = page.getViewport({ scale: SCALE });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
          doc.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, pageW, pageH);
          page.cleanup();
        }

        return new Blob([doc.output("arraybuffer")], { type: "application/pdf" });
      }}
    />
  );
}
