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
            All tools run entirely in your browser — nothing is uploaded or sent to a server. The collection covers
            everything from everyday writing utilities (word counter, case converter, lorem ipsum) to creative tools
            (fancy Unicode fonts, emoji text, ASCII art, Morse code) to technical utilities (regex tester, diff
            checker, Base64, URL encoder, UUID generator, Markdown preview). Every tool processes your text locally
            and instantly.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            Which tool should I use to fix my text for a URL?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Use <strong>Text to Slug</strong> when you need a clean URL path from a title or heading — it
            lowercases, strips accents and punctuation, and joins words with hyphens or underscores. Use
            <strong> URL Encoder</strong> when you need to percent-encode a full URL or query-string parameter
            for safe use in a link or API call. They solve different problems.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            How does the Regex Tester handle catastrophic backtracking?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The Regex Tester uses JavaScript&apos;s native <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">RegExp</code> engine
            which can hang on poorly-written patterns against long input. If you notice the page freeze, reload and
            simplify your pattern — for example, avoid nested quantifiers like <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">(a+)+</code>.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Which case format should I use in my code?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Convention varies by language: JavaScript and TypeScript use camelCase for variables and PascalCase for
            classes; Python uses snake_case for variables and CONSTANT_CASE for module-level constants; CSS and HTML
            attributes prefer kebab-case; database column names traditionally use snake_case. The Case Converter
            handles all of these with one click.
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
