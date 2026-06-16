import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, UserCircle } from "@/components/ui/icons";
import Link from "next/link";
import { RandomNameGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Random Name Generator | Full Names, Usernames, Fantasy & Baby",
  description:
    "Generate random full names, usernames, fantasy names, and baby names instantly. Filter by gender, set count up to 20, and copy any name with one click. Free, no account.",
  keywords: [
    "random name generator",
    "fake name generator",
    "random username generator",
    "fantasy name generator",
    "baby name generator",
    "random full name generator",
  ],
};

export default function RandomNameGeneratorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <UserCircle size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
              Random Name Generator
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Full names, usernames, fantasy names, and baby names — generate up to 20 at once.
            </p>
          </div>
        </div>

        <RandomNameGeneratorClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Four name categories explained
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              <strong>Full Name</strong> combines a common first name with a popular last name, optionally filtered by gender. <strong>Username</strong> pairs a memorable word with a random number for unique online handles. <strong>Fantasy Name</strong> generates invented names with an epic, high-fantasy feel — suitable for RPG characters and fiction writing. <strong>Baby Name</strong> returns a single given name drawn from popular naming trends, useful for expecting parents looking for inspiration.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Can I use these names commercially?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Yes. All names are generated from common public-domain name lists. They are suitable for placeholder data, test datasets, fiction, game characters, and any other purpose.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  How random is the name selection?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  Names are drawn using <code>Math.random()</code> which provides uniform distribution over the built-in name banks. Each click produces a different combination. For cryptographically secure selection, use the dedicated Password Generator.
                </p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">
                  Are names from a specific country or culture?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  The full name and baby name banks are drawn primarily from English and Western European naming traditions. Fantasy names are invented and culturally neutral. Future updates may include name banks for other regions.
                </p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/random-name-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
