"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { List, X as XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  fixed?: boolean;
};

const CATEGORY_LINKS = [
  { label: "WebP Tools", href: "/?category=webp", category: "webp" },
  { label: "Image to PDF", href: "/?category=pdf", category: "pdf" },
  { label: "PDF Tools", href: "/?category=pdf-tools", category: "pdf-tools" },
] as const;

const STATIC_LINKS = [
  { label: "About", href: "/about", external: false },
  { label: "Contact", href: "/contact", external: false },
] as const;

const baseUnderline =
  "relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-foreground after:origin-left after:transition-transform after:duration-200 after:ease-out";

function navLinkClass(active: boolean) {
  return cn(
    "text-[13px] font-semibold tracking-tight transition-colors py-1",
    baseUnderline,
    active
      ? "text-foreground after:scale-x-100"
      : "text-foreground/80 hover:text-foreground after:scale-x-0 hover:after:scale-x-100",
  );
}

function mobileLinkClass(active: boolean) {
  return cn(
    "text-[13px] font-semibold tracking-tight transition-colors py-1",
    baseUnderline,
    active
      ? "text-foreground after:scale-x-100"
      : "text-foreground/80 hover:text-foreground after:scale-x-0 hover:after:scale-x-100",
  );
}

function NavLinks({ menuOpen, onClose }: { menuOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <>
      {/* Desktop nav | centered */}
      <nav className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-4">
        {CATEGORY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={navLinkClass(pathname === "/" && activeCategory === link.category)}
          >
            {link.label}
          </Link>
        ))}
        <span className="mx-1.5 select-none text-[13px] text-neutral-200">|</span>
        {STATIC_LINKS.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={navLinkClass(false)}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass(pathname === link.href)}
            >
              {link.label}
            </Link>
          )
        )}
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-b border-border bg-background px-6 py-4 flex flex-col gap-2.5 w-full">
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={mobileLinkClass(pathname === "/" && activeCategory === link.category)}
              onClick={onClose}
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
                className={mobileLinkClass(false)}
                onClick={onClose}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={mobileLinkClass(pathname === link.href)}
                onClick={onClose}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </>
  );
}

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
      <div className="relative flex w-full items-center px-6 py-4 sm:px-10 border-b border-border">
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

        <Suspense>
          <NavLinks menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </Suspense>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden ml-auto text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon size={20} /> : <List size={20} />}
        </button>
      </div>
    </header>
  );
}
