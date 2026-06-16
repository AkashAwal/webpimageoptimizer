import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "text-tools")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "text-tools");

export default function TextToolsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Text Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free text tools for writers, developers, and gamers — generate fancy Unicode text, convert
            case, count words, create stylish names, encode data, and much more. All run in your browser.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these text tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            All three tools run entirely in your browser. The Lorem Ipsum generator produces classic Latin
            placeholder paragraphs or, in AI mode, realistic English filler text on any topic you specify. The
            Case Converter handles nine naming conventions — from prose formats like Title Case and Sentence case
            to code formats like camelCase, snake_case, and CONSTANT_CASE. The Word Counter gives you a full
            breakdown of your text&apos;s statistics including reading and speaking time estimates and a keyword
            frequency list.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            When should I use AI Topic mode in the Lorem Ipsum generator?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Use it when you need a mockup to feel realistic for a specific audience. For example, if you&apos;re
            designing a landing page for a fintech product, AI topic mode generates financial-sounding placeholder
            copy that lets stakeholders evaluate the layout without being distracted by Latin text.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Which case format should I use in my code?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Convention varies by language: JavaScript and TypeScript use camelCase for variables and PascalCase for
            classes and React components; Python uses snake_case for variables and CONSTANT_CASE for module-level
            constants; CSS and HTML attributes prefer kebab-case; and database column names traditionally use
            snake_case.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            How accurate is the reading time estimate?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The Word Counter uses 200 words per minute for reading and 130 wpm for speaking — both widely cited
            averages. Dense technical content and content aimed at younger audiences may be read more slowly;
            casual conversational text more quickly. The figure is a useful benchmark, not a guarantee.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "text-tools").map((c) => (
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
