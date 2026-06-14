import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "color-tools")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "color-tools");

export default function ColorToolsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <CaretLeft size={13} />
            All Categories
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Color Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free color tools for designers and developers — pick colors, build palettes, check WCAG
            accessibility contrast, generate CSS gradients and shadows, and simulate color blindness.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these color tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            All tools output values in the formats you actually use: HEX, RGB, HSL, and CMYK for color pickers; CSS
            ready-to-paste strings for gradient and shadow generators; and pass/fail badges against WCAG 2.1 AA and AAA
            thresholds for the contrast checker.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            What is WCAG contrast and why does it matter?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios between text and its background
            to ensure readability for users with low vision. AA requires a 4.5:1 ratio for normal text and 3:1 for large
            text. AAA requires 7:1 for normal text. Passing AA is the legal requirement in many jurisdictions.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            What color formats do the tools support?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            All tools accept HEX (#rrggbb) and HSL input. The color picker also shows RGB and CMYK breakdowns. CSS
            output from the gradient and shadow generators uses modern{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">oklch()</code> or standard{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">hsl()</code> notation depending on the
            tool.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            How does the color blindness simulator work?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The simulator applies established color transformation matrices to simulate deuteranopia (red-green, most
            common), protanopia (red-green, less common), tritanopia (blue-yellow), and achromatopsia (no color
            vision). It processes your uploaded image pixel-by-pixel using the Canvas API.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "color-tools").map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[13px] font-medium text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
