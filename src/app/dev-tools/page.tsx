import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "dev-tools")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "dev-tools");

export default function DevToolsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Developer Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free in-browser developer utilities — convert CSV to JSON, decode JWTs, explain cron
            expressions, convert Unix timestamps, and more. No server, no account, no rate limits.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these developer tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Every tool runs entirely in your browser using JavaScript. None of your data is transmitted to a
            server — paste a JWT, a CSV file, or a cron expression and the result is computed locally and
            instantly. This matters especially for JWTs and CSV files that may contain sensitive information.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            Is the JWT decoder safe to use with real tokens?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Yes — the decoder runs entirely in your browser and never sends data anywhere. It decodes the
            header and payload by Base64url-decoding the first two segments. Be cautious pasting production
            tokens with sensitive claims into any online tool, but this one is fully client-side.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            What cron format does the Crontab Explainer support?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            It supports standard 5-field Unix cron syntax: minute (0–59), hour (0–23), day of month (1–31),
            month (1–12), day of week (0–6, Sunday = 0). Each field accepts a number, <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">*</code>,
            step notation (<code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">*/n</code>), ranges (<code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">a-b</code>),
            and comma-separated lists.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            How does the CSV to JSON converter handle quoted fields?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            It implements the RFC 4180 CSV parsing standard. Fields wrapped in double quotes may contain
            commas, newlines, and escaped double quotes (<code className="rounded bg-neutral-100 px-1 py-0.5 text-[12px]">""</code>
            inside a quoted field). It also supports custom delimiters (semicolon, tab) for
            European-style spreadsheet exports.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "dev-tools").map((c) => (
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
