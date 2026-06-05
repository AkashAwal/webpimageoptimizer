import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft, EnvelopeSimple } from "@/components/ui/icons";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Contact — Pix Garage",
  description:
    "Get in touch with Pix Garage. Report a bug, request a new image tool, or ask a question.",
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader fixed />

      <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />
          Home
        </Link>

        <div className="mt-6 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contact
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Have a question, found a bug, or want to suggest a new tool? We'd love to hear from you.
          </p>
        </div>

        {/* Contact card */}
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] space-y-5 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              <EnvelopeSimple size={18} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground">Email</p>
              <a
                href="mailto:hello@pixgarage.com"
                className="mt-0.5 text-[14px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 hover:no-underline"
              >
                hello@pixgarage.com
              </a>
              <p className="mt-1 text-[12px] text-muted-foreground">
                We typically reply within 1–2 business days.
              </p>
            </div>
          </div>

          <hr className="border-border" />

          <a href="mailto:hello@pixgarage.com?subject=Pix Garage Feedback">
            <span className="inline-flex h-9 w-full items-center justify-center rounded-full bg-neutral-900/90 px-4 text-[13px] font-medium leading-none text-white ring-1 ring-white/10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.28)] hover:bg-neutral-900 transition-colors dark:bg-neutral-700 dark:ring-white/10 dark:hover:bg-neutral-600">
              Send us an email
            </span>
          </a>
        </div>

        <div className="mt-10 space-y-8 text-[14px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-3">Common reasons to get in touch</h2>
            <div className="space-y-3">
              {[
                ["Bug report", "If a conversion fails, a file format isn't accepted, or something looks broken, let us know which tool, browser, and file type you were using."],
                ["Tool request", "We plan to add more image tools over time. If there's a conversion or optimisation you'd find useful, suggest it — PNG to AVIF, GIF to WebP, SVG optimisation, image compression, and more are on our radar."],
                ["Question about privacy", "If you have a specific question about how your data is handled, we're happy to explain in more detail. The short answer: nothing leaves your browser."],
                ["Partnership or press", "For business inquiries or press questions, email us with details about your organisation."],
              ].map(([title, detail]) => (
                <div key={title as string}>
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="mt-0.5">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-foreground mb-3">Our tools</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col gap-1 rounded-xl bg-white p-4 ring-1 ring-black/6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.14)] dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none dark:hover:shadow-none"
                >
                  <span className="text-[14px] font-semibold tracking-tight text-foreground group-hover:underline underline-offset-2">
                    {tool.name}
                  </span>
                  <span className="text-[12px] text-muted-foreground">{tool.description}</span>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
