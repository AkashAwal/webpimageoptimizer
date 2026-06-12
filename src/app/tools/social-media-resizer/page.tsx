import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Browsers } from "@/components/ui/icons";
import Link from "next/link";
import { SocialMediaResizerClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Social Media Image Resizer — Free, In-Browser, No Upload",
  description:
    "Resize any image to the exact dimensions for Instagram, Twitter/X, Facebook, LinkedIn, YouTube, and more. 10+ presets, custom sizes, three fit modes — all in your browser.",
};

export default function SocialMediaResizerPage() {
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
            <Browsers size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Social Media Image Resizer</h1>
            <p className="text-[13px] text-muted-foreground">Resize to any platform's exact dimensions — nothing uploaded.</p>
          </div>
        </div>

        <SocialMediaResizerClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What this tool does</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Every social platform enforces specific image dimensions. Upload an image once and resize it to any preset — Instagram post,
              Twitter header, Facebook cover, LinkedIn banner, YouTube thumbnail, and more. You can also enter custom pixel dimensions.
              Three fit modes let you control whether the image is letterboxed, cropped to fill, or stretched.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How to use it</h2>
            <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-decimal list-inside">
              <li>Drop or select your image.</li>
              <li>Pick a preset from the platform grid, or enter a custom width and height.</li>
              <li>Choose a fit mode — Contain, Cover, or Stretch.</li>
              <li>Click <strong className="text-foreground">Export</strong> and download the resized image.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Fit modes explained</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">Contain</strong> — the image fits entirely inside the frame with letterboxing (padding fills the gaps).</li>
              <li><strong className="text-foreground">Cover</strong> — the image fills the entire frame, cropping the edges if the aspect ratio differs.</li>
              <li><strong className="text-foreground">Stretch</strong> — the image is scaled to exactly match the target dimensions, ignoring aspect ratio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is my image uploaded to a server?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">No. All resizing happens in your browser using the Canvas API. Your image never leaves your device.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What output format does it use?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">JPEG for photos and WebP-source images, PNG for everything else. The format preserves the original where possible.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I resize to a custom size?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — select the Custom option and enter any width and height in pixels.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What fill color is used in Contain mode?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">White by default. You can pick any solid color using the background color picker.</p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/social-media-resizer" />
      </main>
      <SiteFooter />
    </div>
  );
}
