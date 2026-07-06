import Link from "next/link";
import Image from "next/image";

type ZencartaLogoProps = {
  /**
   * "auto" swaps between the light/dark logo based on the browser's
   * prefers-color-scheme. "light"/"dark" force a specific logo, for
   * surfaces whose background doesn't change with the theme (e.g. a
   * footer that's always dark navy).
   */
  variant?: "auto" | "light" | "dark";
  /** Tailwind height utility controlling the rendered logo size (width follows, aspect-locked). */
  size?: string;
  showTagline?: boolean;
  className?: string;
  href?: string | false;
};

/** Navbar/footer logo — matches reference mockup (icon + ZEN/CARTA wordmark). */
export function ZencartaLogo({
  variant = "auto",
  size = "h-9",
  className = "",
  href = "/",
}: ZencartaLogoProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {variant !== "dark" && (
        <Image
          src="/brand/logo_light.png"
          alt="Zencarta"
          width={366}
          height={100}
          className={`${size} w-auto ${variant === "auto" ? "dark:hidden" : ""}`}
          priority
        />
      )}
      {variant !== "light" && (
        <Image
          src="/brand/logo_dark.png"
          alt="Zencarta"
          width={427}
          height={100}
          className={`${size} w-auto ${variant === "auto" ? "hidden dark:block" : ""}`}
          priority
        />
      )}
    </div>
  );

  if (href !== false) {
    return (
      <Link href={href ?? "/"} className="shrink-0" aria-label="Zencarta home">
        {content}
      </Link>
    );
  }

  return <div className="shrink-0">{content}</div>;
}
