import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { ImageCollageClient } from "./client";

export const metadata: Metadata = {
  title: "Image Collage Maker | Combine Photos in a Grid, Free Online",
  description:
    "Combine 2 to 6 images into a grid collage. Choose from six layouts, set the gap width, pick a background color, and download as JPEG. Free, in-browser, no upload.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />Home
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Image Collage Maker
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Combine two to six photos into a grid collage in seconds. Pick a layout, set the gap between images, choose a background colour, and download a high-quality JPEG. Everything runs in your browser | no upload, no account.
          </p>
        </div>

        <ImageCollageClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to make a photo collage</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your photos", "Drop two to six images onto the upload area, or click to browse. Images appear as thumbnails. Hover over any thumbnail and click the X to remove it. Drop more images onto the grid to add them."],
                ["Choose a layout", "Six grid layouts are available: side by side (1×2), stacked (2×1), three across (1×3), three down (3×1), 2×2 grid, and 2×3 grid (six images). The layout must have at least as many images as cells."],
                ["Adjust gap and background", "Set the gap between images from 0 (no gap) to 40px. The background colour fills the gap. White or black are the most common; transparent gaps require PNG, which is not yet supported."],
                ["Download", "Click Create Collage to combine all images on a canvas with each cell at 480×480px. The output is a JPEG at 95% quality."],
              ].map(([step, detail], i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[12px] font-semibold text-neutral-600">{i + 1}</span>
                  <div>
                    <p className="font-medium text-foreground">{step}</p>
                    <p className="mt-0.5">{detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How images are fitted to cells</h2>
            <p>Every cell is a square (480×480px on the export canvas). Images of any aspect ratio are fitted using object-fit cover: the image is scaled up until it fills the square, then any overflow is clipped from the centre. This means no black bars or distortion | the most centred part of each image fills the cell. Portraits, landscapes, and square images all fit without manual cropping.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "What is the output resolution?", a: "Each cell is 480×480px. A 2×2 collage with an 8px gap is 976×976px; a 1×3 (three across) is 1456×480px. All cells are the same size regardless of the original image dimensions." },
                { q: "Can I control which part of the image fills the cell?", a: "Currently, the centre of the image is always used. If the key subject is off-centre (e.g., a person near the edge), crop the image to the right area before uploading using the Image Cropper tool." },
                { q: "Why is the output JPEG and not PNG?", a: "Collages are photographic | JPEG produces significantly smaller files at 95% quality with no perceptible difference. PNG output at this resolution would be much larger without a visual benefit." },
                { q: "Can I reorder the images?", a: "The images appear in the order they were added. Remove and re-add images to change the order. The first image goes to the top-left cell, and the rest fill left-to-right, top-to-bottom." },
                { q: "Is there a limit on how many images I can add?", a: "Up to 6 images. The largest layout (2×3) uses all six. If you need more images, create multiple collages and combine them using the collage tool again." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/image-collage" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
