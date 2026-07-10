import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-zencarta-green text-white shadow-lg shadow-zencarta-green/25 hover:bg-zencarta-green-dark",
  secondary:
    "border-2 border-zencarta-green bg-white text-zencarta-green hover:bg-zencarta-green/5 dark:bg-[#16281b]",
  outline:
    "border border-slate-200 text-zencarta-navy hover:border-zencarta-green hover:text-zencarta-green dark:border-[#1f3524] dark:text-slate-100",
  ghost:
    "text-zencarta-navy hover:bg-zencarta-surface dark:text-slate-100",
};

type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  href?: string;
} & Omit<ComponentProps<"button">, "className">;

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50";

export function Button({
  variant = "primary",
  children,
  className = "",
  href,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
