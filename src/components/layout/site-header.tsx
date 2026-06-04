"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GithubLogo, XLogo, List, X as XIcon } from "@phosphor-icons/react";

type SiteHeaderProps = {
  fixed?: boolean;
};

const CATEGORY_LINKS = [
  { label: "WebP Tools", href: "/?category=webp" },
  { label: "Image to PDF", href: "/?category=pdf" },
  { label: "PDF Tools", href: "/?category=pdf-tools" },
] as const;

const STATIC_LINKS = [
  { label: "About", href: "/about", external: false },
  { label: "Security", href: "/security", external: false },
  { label: "Gray Cup", href: "https://graycup.com", external: true },
  { label: "Contact", href: "/contact", external: false },
] as const;

const linkClass =
  "text-[13px] text-foreground/80 hover:text-foreground transition-colors px-2.5 py-1";

export function SiteHeader({ fixed = false }: SiteHeaderProps = {}) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!fixed) return;
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      if (currentScrollY < 20) setHidden(false);
      else if (delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fixed]);

  return (
    <header
      className={
        fixed
          ? "sticky top-0 z-50 flex w-full flex-col bg-background/80 backdrop-blur transition-transform duration-300 ease-out will-change-transform"
          : "relative z-10 flex w-full flex-col"
      }
      style={fixed ? { transform: hidden ? "translateY(-100%)" : "translateY(0)" } : undefined}
    >
      {/* Main nav */}
      <div className="relative flex w-full items-center px-6 py-4 sm:px-10">
        <Link href="/" aria-label="Pix Garage" className="flex items-center gap-2">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground"
          >
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M2 8.5h3l2-3h6l2 3h3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Pix Garage</span>
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
          {CATEGORY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          <span className="mx-1.5 text-neutral-200 select-none text-[13px]">|</span>
          {STATIC_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Right side: built-by + social icons */}
        <div className="hidden sm:flex items-center gap-4 ml-auto">
          <span className="text-[11px] text-muted-foreground">Built by</span>
          <div className="flex items-center gap-3">
            {/* Akash Awal */}
            <div className="flex flex-col items-center gap-1">
              <a href="https://akashawal.com" target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-foreground hover:text-foreground/70 transition-colors">
                Akash Awal
              </a>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <a href="https://github.com/akashawal" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Akash Awal on GitHub">
                  <GithubLogo size={13} />
                </a>
                <a href="https://x.com/akashawal17" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Akash Awal on X">
                  <XLogo size={13} />
                </a>
              </div>
            </div>
            <span className="text-muted-foreground/40 text-[11px]">×</span>
            {/* Gray Cup */}
            <div className="flex flex-col items-center gap-1">
              <a href="https://graycup.com" target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-foreground hover:text-foreground/70 transition-colors">
                Gray Cup
              </a>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <a href="https://github.com/nermalcat69" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Gray Cup on GitHub">
                  <GithubLogo size={13} />
                </a>
                <a href="https://x.com/arjunaditya_" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="Gray Cup on X">
                  <XLogo size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden ml-auto text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon size={20} /> : <List size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-2.5">
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-foreground/80 hover:text-foreground transition-colors py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="my-1 border-t border-border/60" />
          {STATIC_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-foreground/80 hover:text-foreground transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-foreground/80 hover:text-foreground transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
