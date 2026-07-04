import Link from "next/link";
import Image from "next/image";

type ZencartaLogoProps = {
  variant?: "light" | "dark";
  showTagline?: boolean;
  className?: string;
  href?: string | false;
};

/** Navbar/footer logo — matches reference mockup (icon + ZEN/CARTA wordmark). */
export function ZencartaLogo({
  variant = "light",
  className = "",
  href = "/",
}: ZencartaLogoProps) {
  const isDark = variant === "dark";

  const content = (
    <div className={`flex items-center gap-3`}>
      <Image src={`/brand/logo.png`} alt="Zencarta" width={150} height={100} className="w-full" />
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
