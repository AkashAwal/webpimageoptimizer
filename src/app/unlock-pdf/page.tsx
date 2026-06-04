import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import UnlockPdfClient from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Unlock PDF — Remove Password Free, In-Browser, No Upload",
  description: "Remove the password from a PDF file instantly in your browser. Enter the current password and download an unlocked copy. Free, no upload, completely private.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />
      <main className="w-full pb-24">
        <UnlockPdfClient />
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">All processing happens locally in your browser. No files leave your device.</p>
        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How to unlock a PDF</h2>
            <p>Drop your password-protected PDF into the tool. Enter the current password in the field provided, then click <strong className="text-foreground font-semibold">Remove Password</strong>. The downloaded file is a fully unlocked copy — you can open it, edit it, or print it without entering a password each time.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">What is a PDF password?</h2>
            <p>PDF files support two types of protection: a user password that prevents opening the file at all, and an owner password that restricts printing, copying, or editing. This tool handles user passwords — the kind you're asked for when you try to open the document. Supply the correct password and the lock is removed entirely from the saved copy.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can this tool crack a PDF password I don't know?", a: "No. You must supply the correct password yourself. This tool removes the restriction from the file — it doesn't brute-force or guess unknown passwords." },
                { q: "Is my PDF uploaded to a server?", a: "No. Everything runs locally using pdf-lib in your browser. Your document is never transmitted anywhere." },
                { q: "What happens if I enter the wrong password?", a: "The tool will show an error message. Double-check the password and try again — PDF passwords are case-sensitive." },
                { q: "Will the unlocked PDF look different?", a: "No. The content, formatting, images, and layout are completely unchanged. Only the password restriction is removed." },
              ].map(({ q, a }) => (<div key={q}><h3 className="font-semibold text-foreground">{q}</h3><p className="mt-1">{a}</p></div>))}
            </div>
          </section>
          <OtherTools currentHref="/unlock-pdf" />
        </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
