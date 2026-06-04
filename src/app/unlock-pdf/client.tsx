"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";

export default function UnlockPdfClient() {
  const [password, setPassword] = useState("");

  return (
    <PdfToolShell
      title="Unlock PDF"
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
        </div>
      }
      onProcess={async (files) => {
        const { PDFDocument } = await import("pdf-lib");
        try {
          const doc = await PDFDocument.load(await files[0].arrayBuffer(), {
            password: password || undefined,
          });
          return new Blob([await doc.save()], { type: "application/pdf" });
        } catch {
          throw new Error("Incorrect password or this PDF is not password-protected.");
        }
      }}
    />
  );
}
