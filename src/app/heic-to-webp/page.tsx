import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import ConverterShell from "@/components/converter/converter-shell";

export const metadata: Metadata = {
  title: "HEIC to WebP Converter",
  description:
    "Convert iPhone HEIC and HEIF photos to WebP format in your browser. No upload, cross-browser via WebAssembly.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All tools
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            HEIC → WebP
          </h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Convert iPhone HEIC photos to WebP. Works in Chrome and Firefox via WebAssembly — the
            first conversion may take a moment to load the decoder.
          </p>
        </div>

        <ConverterShell type="heic-to-webp" />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>
      </main>
    </div>
  );
}
