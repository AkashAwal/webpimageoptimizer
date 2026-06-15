import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, BoundingBox } from "@/components/ui/icons";
import Link from "next/link";
import { ImagePaddingClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Add Image Padding | Free Canvas Expand Tool, No Upload",
  description:
    "Expand any image by adding padding on each side — choose a solid color or transparent background. Free image padding tool, runs entirely in your browser. No upload.",
  keywords: [
    "add padding to image",
    "expand image canvas",
    "image canvas size tool",
    "add white border image",
    "image padding tool",
    "canvas extend image",
  ],
};

export default function ImagePaddingPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />
          All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <BoundingBox size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Add Image Padding</h1>
            <p className="text-[13px] text-muted-foreground">Expand the canvas with custom padding | solid color or transparent.</p>
          </div>
        </div>

        <ImagePaddingClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is canvas padding?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Padding (also called canvas expansion) adds empty space around your image without scaling or cropping the original content.
              This is useful for adding whitespace before sharing, centering a logo on a square background, or creating a consistent
              border around product photos.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How to use it</h2>
            <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-decimal list-inside">
              <li>Drop or select your image.</li>
              <li>Enter padding values for top, right, bottom, and left (in pixels). Use the lock icon to set all sides equally.</li>
              <li>Pick a background color, or enable transparent background (exports as PNG).</li>
              <li>Click <strong className="text-foreground">Apply Padding</strong> and download.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does this resize my image?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">No. The original image pixels are untouched. Only the canvas size increases to accommodate the padding you add.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I use a transparent background?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes. Enable the transparency toggle and the tool will export a PNG with a transparent padding area.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What formats are supported?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">You can drop any browser-readable image. The output is PNG when transparency is enabled, and matches the original format otherwise.</p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/image-padding" />
      </main>
      <SiteFooter />
    </div>
  );
}
