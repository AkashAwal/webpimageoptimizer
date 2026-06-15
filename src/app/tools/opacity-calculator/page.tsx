import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Eye } from "@/components/ui/icons";
import Link from "next/link";
import { OpacityCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Opacity Calculator | Preview RGBA Colors Over Any Background",
  description:
    "Preview any color at different opacities over white and dark backgrounds. See the effective blended hex and copy the rgba() or hsla() CSS value instantly. Free, in-browser.",
  keywords: [
    "opacity calculator",
    "rgba color tool",
    "color opacity preview",
    "rgba generator",
    "css opacity tool",
    "transparent color preview",
    "alpha color calculator",
  ],
};

export default function OpacityCalculatorPage() {
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
            <Eye size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Opacity Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Preview any color at different opacities and copy the rgba() value.</p>
          </div>
        </div>

        <OpacityCalculatorClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Understanding color opacity in CSS</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              When you set <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">background-color: rgba(59, 130, 246, 0.5)</code> in CSS, the browser blends the color with whatever is behind it. This tool shows you the result of that blending over two common backgrounds — white and dark — so you can verify the effective color before writing a line of code. The blended hex is computed as <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">bg × (1 − α) + fg × α</code> per channel.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">rgba() vs opacity property</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              There are two ways to make an element semi-transparent in CSS. The <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">opacity</code> property affects the entire element including its children and text. The <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">rgba()</code> color function only makes the background (or border, or shadow) transparent — child text stays fully opaque. For overlays, backgrounds, and shadows, prefer <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">rgba()</code>.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between rgba() and hsla()?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Both add an alpha channel — the last value controls opacity from 0 (fully transparent) to 1 (fully opaque). <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">rgba()</code> uses red, green, blue channels (0–255). <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">hsla()</code> uses hue, saturation, and lightness, which many designers find easier to reason about. Both are fully supported in all modern browsers.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does the effective color over dark look different from over white?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Opacity blending always depends on the background. The same rgba color blended with white pulls towards a tint, while blending with a dark background pulls towards a shade. This is why it is critical to preview overlays against the actual background color they will appear on in production.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/opacity-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
