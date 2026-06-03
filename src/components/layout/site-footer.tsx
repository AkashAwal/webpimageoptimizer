import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-foreground">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M2 8.5h3l2-3h6l2 3h3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              <span className="text-[14px] font-semibold tracking-tight text-foreground">Pix Garage</span>
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Free image conversion tools that run entirely in your browser. Nothing uploaded, nothing stored.
            </p>
          </div>

          {/* Tools */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
              Tools
            </p>
            <ul className="mt-3 space-y-2">
              {TOOLS.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
              Company
            </p>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} Pix Garage. All rights reserved.
          </p>
          <p className="text-[12px] text-muted-foreground">
            All image processing happens locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
