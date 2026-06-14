import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { OtherTools } from "@/components/converter/other-tools";
import { ColorPaletteClient } from "./client";

export const metadata: Metadata = {
  title: "Color Palette Extractor | Get Dominant Colors from Any Image",
  description:
    "Upload any image to extract its 8 dominant colors as hex, RGB, or HSL codes. Copy individual colors or all at once. Export the palette as a PNG swatch. Free, no upload.",
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
            Color Palette Extractor
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Upload any image to extract its eight most dominant colours. Copy each colour as a hex code, RGB value, or HSL string | or copy the entire palette at once. Export a PNG swatch sheet. Everything runs in your browser, no upload required.
          </p>
        </div>

        <ColorPaletteClient />

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          All processing happens locally in your browser. No files leave your device.
        </p>

        <div className="mt-16 space-y-10 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">How to extract colours from an image</h2>
            <ol className="space-y-3 list-none">
              {[
                ["Upload your image", "Drop a JPEG, PNG, or WebP file onto the upload area, or click to browse. The palette is extracted automatically | no button to press."],
                ["Browse the palette", "Eight dominant colours appear, sorted by how much of the image they represent. The colour strip at the top of the card shows their proportions at a glance."],
                ["Copy colours", "Click any row to copy that colour in the selected format (HEX, RGB, or HSL). Switch between formats using the tabs. Use Copy all to copy the entire palette as a newline-separated list."],
                ["Export a swatch PNG", "Click the PNG button to download an 80×100px swatch sheet with all colours labelled | useful for documentation or sharing colour specs with a team."],
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
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">How the palette is extracted</h2>
            <p>The image is scaled down to at most 180×180 pixels before analysis. This reduces the number of pixels to process while preserving the colour distribution. The tool then runs k-means clustering with k = 8 on the RGB pixel data: it groups all pixels into eight clusters so that pixels of similar colour belong to the same group. The centre of each cluster | the average colour | becomes a palette entry.</p>
            <p className="mt-3">K-means runs for 12 iterations, which is enough to converge for typical images. The clusters are sorted by their size (number of pixels), so the most prominent colour appears first. The percentage bar in each row shows that colour&rsquo;s share of the total pixels analysed.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Colour format reference</h2>
            <dl className="space-y-3">
              {[
                ["HEX", "A six-character hexadecimal code prefixed with #. The most widely used format in web development, CSS, and design tools like Figma. Example: #3B82F6."],
                ["RGB", "Red, green, and blue values on a 0–255 scale. Useful when working directly with CSS rgb() functions or programming environments. Example: rgb(59, 130, 246)."],
                ["HSL", "Hue (0–360°), saturation (0–100%), and lightness (0–100%). The most human-readable colour model | hue describes the colour family, saturation describes vividness, and lightness describes brightness. Example: hsl(217, 91%, 60%)."],
              ].map(([term, def]) => (
                <div key={term as string}>
                  <dt className="inline font-semibold text-foreground">{term}: </dt>
                  <dd className="inline">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                { q: "Why do I get 8 colours and not more?", a: "Eight is a practical ceiling for dominant palette extraction. More clusters begin splitting closely related shades into near-duplicate entries rather than adding meaningful new colours. If you need finer granularity, run the tool on a cropped region of your image." },
                { q: "Why does a photo with a blue sky show mostly blue?", a: "K-means finds the most dominant clusters by pixel count. If a large area of the image is a single colour (like a sky or background), that colour will dominate the palette. Crop the image to the area of interest before extracting if you want the palette to focus on the subject." },
                { q: "Are transparent pixels included?", a: "No. Pixels with an alpha value below 50% are excluded from analysis. This means images with transparent backgrounds will not have the transparency counted as a colour." },
                { q: "Can I extract colours from a screenshot or non-photo image?", a: "Yes. The tool works on any image | photos, illustrations, UI screenshots, gradients, or artwork. Flat-colour illustrations and UI screenshots tend to produce cleaner, more distinct palettes than photographs." },
                { q: "Does the palette change each time I run it on the same image?", a: "Slightly. K-means centroid seeding is deterministic in this implementation (seeds are evenly spaced through the pixel list), but the exact output can vary by a few RGB units between runs due to quantization. The colours will always be visually representative of the image." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <OtherTools currentHref="/tools/color-palette" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
