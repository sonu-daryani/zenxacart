import Link from "next/link";
import { Globe, MessageCircle, Share2 } from "lucide-react";
import { ZencartaLogo } from "@/components/ZencartaLogo";

const footerLinks = {
  Shop: ["All Products", "New Arrivals", "Best Sellers", "Deals"],
  Support: ["Help Center", "Track Order", "Returns", "Contact Us"],
  Company: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-zencarta-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ZencartaLogo variant="dark" href="/" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Shop Smart. Live Easy. Your destination for quality products,
              fast shipping, and exceptional service.
            </p>
            <div className="mt-6 flex gap-3">
              {[Share2, MessageCircle, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-zencarta-green"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm transition-colors hover:text-zencarta-green-light"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Zencarta. All rights reserved.
          </p>
          <p className="text-xs text-zencarta-green-light">
            SHOP SMART. LIVE EASY.
          </p>
        </div>
      </div>
    </footer>
  );
}
