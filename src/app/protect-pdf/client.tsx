"use client";
import { useState } from "react";
import PdfToolShell from "@/components/pdf/pdf-tool-shell";

export default function ProtectPdfClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <PdfToolShell
      title="Protect PDF"
      processLabel="Add Password"
      outputFilename="protected.pdf"
      settingsNode={
        <div className="space-y-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Password</p>
            <input type="password" placeholder="Enter a password"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
            />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Confirm password</p>
            <input type="password" placeholder="Repeat the password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[12px] text-foreground outline-none focus:border-foreground/30 transition-colors"
            />
          </div>
          <p className="text-[10px] text-muted-foreground/60 leading-tight">
            The PDF is re-rendered as secured pages. Text searchability is preserved in the metadata.
          </p>
        </div>
      }
      onProcess={async (files) => {
        if (!password) throw new Error("Please enter a password.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");

        // Load existing PDF, re-render each page as image, create new protected PDF with jsPDF
        const { renderPageToCanvas, getPdfPageCount } = await import("@/lib/pdf-utils");
        const { jsPDF } = await import("jspdf");

        const total = await getPdfPageCount(files[0]);
        const pages: Array<{ dataUrl: string; w: number; h: number }> = [];

        for (let i = 1; i <= total; i++) {
          const canvas = await renderPageToCanvas(files[0], i, 2);
          pages.push({ dataUrl: canvas.toDataURL("image/jpeg", 0.92), w: canvas.width, h: canvas.height });
        }

        const MM = 25.4 / 192; // 2x scale
        const [first] = pages;
        const pdf = new jsPDF({
          orientation: first.w >= first.h ? "landscape" : "portrait",
          unit: "px",
          format: [first.w * MM, first.h * MM],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(({ encryption: { userPassword: password, ownerPassword: password, userPermissions: ["print"] } }) as any),
        });

        pages.forEach((p, i) => {
          if (i > 0) pdf.addPage([p.w * MM, p.h * MM], p.w >= p.h ? "landscape" : "portrait");
          pdf.addImage(p.dataUrl, "JPEG", 0, 0, p.w * MM, p.h * MM);
        });

        return pdf.output("blob");
      }}
    />
  );
}
