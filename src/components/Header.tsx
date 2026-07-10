"use client";

import Link from "next/link";
import { ZencartaLogo } from "@/components/ZencartaLogo";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useCatalogStore } from "@/stores/catalog-store";

const shopLinks = ["All Products", "Best Sellers", "Gift Cards", "Clearance"];

const secondaryLinks = [
  { label: "Home", href: "/" },
  { label: "New Arrivals", href: "/shop" },
  { label: "Best Sellers", href: "/#products" },
  { label: "Deals", href: "/#deals" },
  { label: "Track Order", href: "#" },
  { label: "Contact Us", href: "#" },
];

type CategoryItem = { id: string; name: string; icon?: string };

function NavDropdown({
  label,
  items,
  href,
}: {
  label: string;
  items: string[];
  href?: (item: string) => string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green dark:text-slate-100"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-slate-100 bg-white py-2 shadow-lg dark:border-[#1f3524] dark:bg-[#0e1c12]"
          >
            {items.map((item) => (
              <Link
                key={item}
                href={href ? href(item) : "#products"}
                className="block px-4 py-2 text-sm text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green dark:text-slate-100"
                onClick={() => setOpen(false)}
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryMenu({ categories }: { categories: CategoryItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-2 rounded-md bg-zencarta-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zencarta-green-dark"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Menu className="h-4 w-4" />
        Shop by Category
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-lg border border-slate-100 bg-white py-2 shadow-lg dark:border-[#1f3524] dark:bg-[#0e1c12]"
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green dark:text-slate-100"
                onClick={() => setOpen(false)}
              >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const { user } = useAuth();
  const { itemCount, openCart, openSearch } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const categories = useCatalogStore((s) => s.categories);
  const accountHref = user ? "/account" : "/login";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    void useCatalogStore.getState().fetchCategories();
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-300 ${
        scrolled
          ? "shadow-md shadow-slate-900/5 dark:shadow-black/30"
          : "shadow-none"
      }`}
    >
      <div className="overflow-hidden bg-zencarta-navy py-2 text-[11px] font-medium tracking-wide text-white sm:text-center sm:text-xs">
        <div className="flex animate-marquee gap-12 whitespace-nowrap sm:animate-none sm:justify-center">
          <span>Free Shipping on Orders Above $75</span>
          <span>|</span>
          <span>7 Days Easy Returns</span>
          <span className="sm:hidden">|</span>
          <span className="sm:hidden">Secure Checkout</span>
          <span className="sm:hidden" aria-hidden>
            Free Shipping on Orders Above $75
          </span>
          <span className="sm:hidden" aria-hidden>
            |
          </span>
          <span className="sm:hidden" aria-hidden>
            7 Days Easy Returns
          </span>
        </div>
      </div>

      <div className="glass-card border-b border-slate-100 dark:border-[#1f3524]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <ZencartaLogo variant="auto" />

          <button
            type="button"
            onClick={openSearch}
            className="hidden flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white text-left text-sm text-zencarta-muted transition-colors hover:border-zencarta-green md:flex dark:border-[#1f3524] dark:bg-[#0e1c12]"
            aria-label="Search for products"
          >
            <span className="flex-1 truncate px-4 py-2.5">Search for products…</span>
            <span className="flex shrink-0 items-center gap-1 border-x border-slate-200 px-3 py-2.5 dark:border-[#1f3524]">
              All Categories
              <ChevronDown className="h-3.5 w-3.5" />
            </span>
            <span className="flex shrink-0 items-center justify-center rounded-r-lg bg-zencarta-green px-4 py-2.5 text-white">
              <Search className="h-4 w-4" />
            </span>
          </button>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={openSearch}
              className="rounded-full p-2 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green md:hidden dark:text-slate-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href={accountHref}
              className="hidden flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green sm:flex dark:text-slate-100"
              aria-label={user ? "My account" : "Sign in"}
            >
              <User className="h-5 w-5" />
              <span className="text-[11px] font-medium">Account</span>
            </Link>
            <Link
              href="/account"
              className="hidden flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green sm:flex dark:text-slate-100"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              <span className="text-[11px] font-medium">Wishlist</span>
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green dark:text-slate-100"
              aria-label={`Shopping cart, ${itemCount} items`}
            >
              <span className="relative">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zencarta-green text-[9px] font-bold text-white"
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="hidden text-[11px] font-medium sm:block">Cart</span>
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-zencarta-navy lg:hidden dark:text-slate-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-slate-100 bg-white lg:block dark:border-[#1f3524] dark:bg-[#0e1c12]">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-1.5 lg:px-8">
          <CategoryMenu categories={categories} />
          <nav className="flex items-center gap-1">
            {secondaryLinks.slice(0, 1).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green dark:text-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <NavDropdown label="Shop" items={shopLinks} href={() => "/shop"} />
            {secondaryLinks.slice(1).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green dark:text-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white shadow-2xl lg:hidden dark:bg-[#0e1c12]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-[#1f3524]">
                <span className="text-lg font-bold text-zencarta-navy dark:text-slate-100">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 hover:bg-zencarta-surface"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-4 py-4">
                <Link
                  href="/shop"
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-zencarta-navy transition-colors hover:bg-zencarta-surface dark:text-slate-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Shop All
                </Link>
                <p className="px-3 pt-2 text-[11px] font-bold tracking-wider text-zencarta-muted uppercase">
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-zencarta-navy transition-colors hover:bg-zencarta-surface dark:text-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.icon && <span className="mr-2">{cat.icon}</span>}
                    {cat.name}
                  </Link>
                ))}
                <p className="mt-2 px-3 pt-2 text-[11px] font-bold tracking-wider text-zencarta-muted uppercase">
                  More
                </p>
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-zencarta-navy transition-colors hover:bg-zencarta-surface dark:text-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={accountHref}
                  className="mt-2 rounded-xl bg-zencarta-green px-3 py-3 text-center text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {user ? "My Account" : "Sign In"}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
