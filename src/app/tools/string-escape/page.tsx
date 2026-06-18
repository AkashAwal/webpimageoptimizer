import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Terminal } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { StringEscapeClient } from "./client";

export const metadata: Metadata = {
  title: "String Escape Tool | Escape JSON, JS, Python & Regex | Free",
  description:
    "Escape and unescape strings for JSON, JavaScript, Python, and regular expressions instantly in your browser. Handles special characters, newlines, and quotes. Free, no upload.",
};

export default function StringEscapePage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Terminal size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">String Escape Tool</h1>
            <p className="text-[13px] text-muted-foreground">Escape or unescape strings for JSON, JavaScript, Python, and regex.</p>
          </div>
        </div>
        <StringEscapeClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Why escape strings?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Special characters like quotes, backslashes, and newlines have syntactic meaning inside string literals
              and pattern syntax. If you embed them unescaped, the parser sees the end of the string prematurely
              and produces a syntax error or, in the worst case, a security vulnerability like SQL injection or XSS.
              Escaping replaces special characters with their safe representations — a backslash followed by a code.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What characters does JSON escaping handle?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">JSON string values must escape: double quotes (&quot;), backslashes (\), and control characters (newline \n, carriage return \r, tab \t, and characters 0x00–0x1f). All other Unicode characters can appear literally or as \uXXXX escape sequences.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">When would I use regex escaping?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">When constructing a regex pattern from user-supplied text, any character that has special regex meaning must be escaped. Otherwise a user searching for &quot;1+1&quot; would match &quot;111&quot;, &quot;11&quot;, etc. because + is a quantifier. The regex escape mode escapes all 12 metacharacters: . * + ? ^ $ { } ( ) | [ ] \</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the difference between JSON and JavaScript escaping?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">JSON requires double-quote delimiters and forbids single quotes inside string values without escaping. JavaScript template literals (backtick strings) need backtick and dollar-sign escaping instead of quote escaping. Use JSON mode when building JSON payloads; use JavaScript mode when building template literal strings in JS/TS code.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/string-escape" />
      </main>
      <SiteFooter />
    </div>
  );
}
