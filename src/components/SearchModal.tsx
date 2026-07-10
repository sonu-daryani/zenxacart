"use client";

import Image from "next/image";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products } from "@/data/products";
import { useCart } from "@/hooks/use-cart";

export function SearchModal() {
  const { isSearchOpen, closeSearch, addToCart } = useCart();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isSearchOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearchOpen, closeSearch]);

  const results = useMemo(() => {
    if (!query.trim()) return products.slice(0, 4);
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeSearch}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-2xl rounded-2xl bg-white shadow-2xl sm:inset-x-auto dark:bg-[#0e1c12]"
          >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 dark:border-[#1f3524]">
          <Search className="h-5 w-5 shrink-0 text-zencarta-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="flex-1 bg-transparent text-zencarta-navy outline-none placeholder:text-zencarta-muted dark:text-slate-100"
            autoFocus
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="rounded-full p-2 hover:bg-zencarta-surface"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <p className="mb-3 text-xs font-semibold tracking-wide text-zencarta-muted uppercase">
            {query ? `${results.length} results` : "Popular products"}
          </p>
          <ul className="space-y-2">
            {results.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-4 rounded-lg p-2 text-left transition-colors hover:bg-zencarta-surface"
                  onClick={() => {
                    addToCart(product);
                    closeSearch();
                  }}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-zencarta-navy dark:text-slate-100">
                      {product.name}
                    </p>
                    <p className="text-sm text-zencarta-green">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <p className="py-8 text-center text-sm text-zencarta-muted">
                No products found for &ldquo;{query}&rdquo;
              </p>
            )}
          </ul>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
