"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type SiteHeaderProps = {
  fixed?: boolean;
};

export function SiteHeader({ fixed = false }: SiteHeaderProps = {}) {
  const [hidden, setHidden] = useState(false);
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
          ? "sticky top-0 z-50 flex w-full items-center justify-between bg-background/80 px-6 py-5 backdrop-blur sm:px-10 transition-transform duration-300 ease-out will-change-transform"
          : "relative z-10 flex w-full items-center justify-between px-6 py-5 sm:px-10"
      }
      style={fixed ? { transform: hidden ? "translateY(-100%)" : "translateY(0)" } : undefined}
    >
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

      <Link
        href="/"
        className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      >
        All tools
      </Link>
    </header>
  );
}
