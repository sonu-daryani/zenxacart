import Link from "next/link";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  children,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        centered ? "text-center sm:text-left" : ""
      }`}
    >
      <div className={centered ? "mx-auto sm:mx-0" : ""}>
        {eyebrow && (
          <span className="text-xs font-semibold tracking-widest text-zencarta-green uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-2 text-3xl font-bold text-zencarta-navy sm:text-4xl dark:text-slate-100">
          {title}
        </h2>
        {description && (
          <p
            className={`mt-3 max-w-xl text-zencarta-muted ${
              centered ? "mx-auto sm:mx-0" : ""
            }`}
          >
            {description}
          </p>
        )}
        {children}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group mx-auto flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zencarta-green sm:mx-0"
        >
          {action.label}
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}
