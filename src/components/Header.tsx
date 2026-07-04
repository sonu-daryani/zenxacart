"use client";

import Link from "next/link";
import { ZencartaLogo } from "@/components/ZencartaLogo";
import { useEffect, useState } from "react";
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
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-slate-100 bg-white py-2 shadow-lg">
          {items.map((item) => (
            <Link
              key={item}
              href={`#products`}
              className="block px-4 py-2 text-sm text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green"
              onClick={() => setOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
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
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <ZencartaLogo variant="light" className="max-w-[200px] sm:max-w-none" />

        <nav className="hidden items-center gap-1 lg:flex">
          <NavDropdown label="Shop" items={shopLinks} />
          <NavDropdown label="Categories" items={categoryNames} />
          <Link
            href="#deals"
            className="px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green"
          >
            Deals
          </Link>
          <Link
            href="#products"
            className="px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green"
          >
            New Arrivals
          </Link>
          <Link
            href="#trust"
            className="px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:text-zencarta-green"
          >
            Track Order
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="rounded-full p-2 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href={accountHref}
            className="hidden rounded-full p-2 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green sm:block"
            aria-label={user ? "My account" : "Sign in"}
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2 text-zencarta-navy transition-colors hover:bg-zencarta-surface hover:text-zencarta-green"
            aria-label={`Shopping cart, ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zencarta-green text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-zencarta-navy lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
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
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zencarta-navy hover:bg-zencarta-surface"
                  onClick={() => setMobileOpen(false)}
                >
                  {link}
                </Link>
              )
            )}
            <Link
              href={accountHref}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zencarta-navy hover:bg-zencarta-surface"
              onClick={() => setMobileOpen(false)}
            >
              {user ? "My Account" : "Sign In"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
