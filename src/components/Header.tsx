"use client";

import Link from "next/link";
import { ZencartaLogo } from "@/components/ZencartaLogo";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const shopLinks = ["All Products", "Best Sellers", "Gift Cards", "Clearance"];

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: string[];
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
                href={`#products`}
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

export function Header() {
  const { user } = useAuth();
  const { itemCount, openCart, openSearch } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const accountHref = user ? "/account" : "/login";

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: { categories: { id: string; name: string }[] }) => {
        setCategoryNames(data.categories.map((c) => c.name));
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md dark:border-[#1f3524] dark:bg-[#0e1c12]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <ZencartaLogo variant="auto" />

        <nav className="hidden items-center gap-1 lg:flex">
          <NavDropdown label="Shop" items={shopLinks} />
          <NavDropdown label="Categories" items={categoryNames} />
          <Link
            href="#deals"
            className="px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green dark:text-slate-100"
          >
            Deals
          </Link>
          <Link
            href="#products"
            className="px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green dark:text-slate-100"
          >
            New Arrivals
          </Link>
          <Link
            href="#trust"
            className="px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green dark:text-slate-100"
          >
            Track Order
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="rounded-full p-2 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green dark:text-slate-100"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href={accountHref}
            className="hidden rounded-full p-2 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green sm:block dark:text-slate-100"
            aria-label={user ? "My account" : "Sign in"}
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green dark:text-slate-100"
            aria-label={`Shopping cart, ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zencarta-green text-[10px] font-bold text-white"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-slate-100 bg-white lg:hidden dark:border-[#1f3524] dark:bg-[#0e1c12]"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {["Shop", "Categories", "Deals", "New Arrivals", "Track Order"].map(
                (link) => (
                  <Link
                    key={link}
                    href={
                      link === "Deals"
                        ? "#deals"
                        : link === "New Arrivals"
                          ? "#products"
                          : "#"
                    }
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-zencarta-navy hover:bg-zencarta-surface dark:text-slate-100"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link}
                  </Link>
                )
              )}
              <Link
                href={accountHref}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-zencarta-navy hover:bg-zencarta-surface dark:text-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                {user ? "My Account" : "Sign In"}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
