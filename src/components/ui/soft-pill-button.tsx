"use client";
import React from "react";
import { cn } from "@/lib/utils";

export type SoftPillVariant = "secondary" | "primary";

interface SoftPillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: SoftPillVariant;
}

const SoftPillButton = React.forwardRef<HTMLButtonElement, SoftPillButtonProps>(
  ({ className, children, variant = "secondary", ...props }, ref) => {
    const isPrimary = variant === "primary";
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium leading-none tracking-tight backdrop-blur transition active:scale-[0.99]",
          isPrimary
            ? "bg-neutral-900/90 text-white ring-1 ring-white/10 hover:bg-neutral-900 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.12)] dark:bg-white/90 dark:text-neutral-900 dark:ring-black/10 dark:hover:bg-white"
            : "bg-white/80 text-neutral-900 ring-1 ring-black/6 hover:bg-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.06)] dark:bg-neutral-800 dark:text-neutral-100 dark:ring-white/8 dark:hover:bg-neutral-700",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

SoftPillButton.displayName = "SoftPillButton";

export default SoftPillButton;
