import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Camera } from "@/components/ui/icons";
import Link from "next/link";
import { ImageColorPickerClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Image Color Picker | Sample Any Pixel Color from a Photo",
  description:
    "Upload any image and hover or click any pixel to extract its exact color as HEX, RGB, and HSL. Lock a color with a click. Free, in-browser, no upload to a server.",
  keywords: [
    "image color picker",
    "pick color from image",
    "pixel color picker",
    "color sampler",
    "eyedropper tool online",
    "extract color from image",
    "hex from image",
  ],
};

export default function ImageColorPickerPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Camera size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Image Color Picker</h1>
            <p className="text-[13px] text-muted-foreground">Hover to sample · Click to lock a color from any image.</p>
          </div>
        </div>

        <ImageColorPickerClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How to use this tool</h2>
            <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-decimal list-inside">
              <li>Drop an image or click the upload zone to load any photo, screenshot, or design export.</li>
              <li>Move your cursor over the image — the color beneath the pointer updates in real time.</li>
              <li>Click anywhere on the image to lock that color. The result card shows the HEX, RGB, and HSL values with copy buttons.</li>
              <li>Click "Pick another image" to start over with a new file.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Privacy and processing</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Your image never leaves your device. The tool draws it to an HTML5 canvas element and reads individual pixel values using <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">getImageData()</code>. No data is sent to any server. The image is only held in memory while the browser tab is open.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What image formats are supported?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Any format your browser can display: JPEG, PNG, WebP, GIF, AVIF, BMP, and SVG. HEIC files are supported in Safari on Apple devices. On Chrome and Firefox, convert HEIC to JPEG first using the HEIC to JPG tool.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">The color I sampled looks slightly off — why?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The canvas reads the exact sRGB pixel value at that coordinate. If the source image uses a wide-gamut color profile (Display P3 or Adobe RGB), the colors may appear different after conversion to sRGB. Additionally, JPEG compression can introduce color artifacts at hard edges.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/image-color-picker" />
      </main>
      <SiteFooter />
    </div>
  );
}
