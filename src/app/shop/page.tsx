"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, SlidersHorizontal, Star, X } from "lucide-react";
import type { Product } from "@/data/products";
import { products as fallbackProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer } from "@/lib/motion";

type SortOption = "featured" | "price-low" | "price-high" | "rating";

type Category = { id: string; name: string; icon?: string; count?: number };

type ProductsResponse = {
  products: Product[];
  source: "cj" | "static";
  configured: boolean;
  error?: string;
};

type Filters = {
  category: string | null;
  priceMin: string;
  priceMax: string;
  minRating: number;
  search: string;
};

const EMPTY_FILTERS: Filters = {
  category: null,
  priceMin: "",
  priceMax: "",
  minRating: 0,
  search: "",
};

const RATING_OPTIONS = [4.5, 4, 3];

function countActiveFilters(f: Filters): number {
  let n = 0;
  if (f.category) n++;
  if (f.priceMin) n++;
  if (f.priceMax) n++;
  if (f.minRating > 0) n++;
  if (f.search.trim()) n++;
  return n;
}

function SidebarContent({
  categories,
  filters,
  setFilters,
  sort,
  setSort,
  onClear,
}: {
  categories: Category[];
  filters: Filters;
  setFilters: (updater: (f: Filters) => Filters) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  onClear: () => void;
}) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ];

  const activeCount = countActiveFilters(filters);

  return (
    <div className="space-y-8">
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-semibold text-zencarta-green hover:underline"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters ({activeCount})
        </button>
      )}

      <div>
        <h3 className="text-sm font-bold tracking-wide text-zencarta-navy uppercase dark:text-slate-100">
          Categories
        </h3>
        <div className="mt-4 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setFilters((f) => ({ ...f, category: null }))}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              filters.category === null
                ? "bg-zencarta-green text-white"
                : "text-zencarta-navy hover:bg-zencarta-surface dark:text-slate-100"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, category: cat.id }))}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                filters.category === cat.id
                  ? "bg-zencarta-green text-white"
                  : "text-zencarta-navy hover:bg-zencarta-surface dark:text-slate-100"
              }`}
            >
              <span className="flex items-center gap-2">
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
              </span>
              {typeof cat.count === "number" && (
                <span
                  className={`text-xs ${
                    filters.category === cat.id ? "text-white/80" : "text-zencarta-muted"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-wide text-zencarta-navy uppercase dark:text-slate-100">
          Price Range
        </h3>
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zencarta-muted">
              $
            </span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-6 pr-2 text-sm text-zencarta-navy outline-none focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20 dark:border-[#1f3524] dark:bg-[#0e1c12] dark:text-slate-100"
            />
          </div>
          <span className="text-zencarta-muted">–</span>
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zencarta-muted">
              $
            </span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-6 pr-2 text-sm text-zencarta-navy outline-none focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20 dark:border-[#1f3524] dark:bg-[#0e1c12] dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-wide text-zencarta-navy uppercase dark:text-slate-100">
          Rating
        </h3>
        <div className="mt-4 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setFilters((f) => ({ ...f, minRating: 0 }))}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              filters.minRating === 0
                ? "bg-zencarta-green/10 text-zencarta-green"
                : "text-zencarta-navy hover:bg-zencarta-surface dark:text-slate-100"
            }`}
          >
            Any rating
          </button>
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, minRating: r }))}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                filters.minRating === r
                  ? "bg-zencarta-green/10 text-zencarta-green"
                  : "text-zencarta-navy hover:bg-zencarta-surface dark:text-slate-100"
              }`}
            >
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {r}+ &amp; up
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-wide text-zencarta-navy uppercase dark:text-slate-100">
          Sort By
        </h3>
        <div className="mt-4 flex flex-col gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                sort === opt.value
                  ? "bg-zencarta-green/10 text-zencarta-green"
                  : "text-zencarta-navy hover:bg-zencarta-surface dark:text-slate-100"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  sort === opt.value ? "bg-zencarta-green" : "bg-transparent"
                }`}
              />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [sort, setSort] = useState<SortOption>("featured");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [catalog, setCatalog] = useState<Product[]>(fallbackProducts);
  const [catalogSource, setCatalogSource] = useState<"cj" | "static">("static");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/cj/products?page=1&size=24"),
          fetch("/api/categories"),
        ]);
        const productsData = (await productsRes.json()) as ProductsResponse;
        const categoriesData = (await categoriesRes.json()) as { categories: Category[] };
        if (!cancelled) {
          setCatalog(productsData.products);
          setCatalogSource(productsData.source);
          setCategories(categoriesData.categories);
        }
      } catch {
        if (!cancelled) setCatalog(fallbackProducts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    let list = [...catalog];
    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.priceMin !== "") {
      const min = Number(filters.priceMin);
      if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
    }
    if (filters.priceMax !== "") {
      const max = Number(filters.priceMax);
      if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
    }
    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }
    const query = filters.search.trim().toLowerCase();
    if (query) {
      list = list.filter((p) => p.name.toLowerCase().includes(query));
    }
    switch (sort) {
      case "price-low":
        return list.sort((a, b) => a.price - b.price);
      case "price-high":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [catalog, sort, filters]);

  const activeCount = countActiveFilters(filters);
  const clearFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <PageShell>
      <div className="bg-zencarta-surface py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold tracking-widest text-zencarta-green uppercase">
                {catalogSource === "cj" ? "CJ Dropshipping" : "Full Catalog"}
              </span>
              <h1 className="mt-2 text-3xl font-bold text-zencarta-navy sm:text-4xl dark:text-slate-100">
                All Products
              </h1>
              <p className="mt-2 text-sm text-zencarta-muted">
                {loading ? "Loading products…" : `${sorted.length} products`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 self-start rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:border-zencarta-green lg:hidden dark:border-[#1f3524] dark:text-slate-100"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zencarta-green text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative mt-6 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zencarta-muted" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search products…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zencarta-navy outline-none focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20 dark:border-[#1f3524] dark:bg-[#0e1c12] dark:text-slate-100"
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]">
                <SidebarContent
                  categories={categories}
                  filters={filters}
                  setFilters={setFilters}
                  sort={sort}
                  setSort={setSort}
                  onClear={clearFilters}
                />
              </div>
            </aside>

            <div>
              {loading ? (
                <div className="flex justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
                </div>
              ) : sorted.length === 0 ? (
                <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-sm text-zencarta-muted shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]">
                  No products match your filters.
                  {activeCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-2 font-semibold text-zencarta-green hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <Reveal
                  variants={staggerContainer}
                  className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3"
                >
                  {sorted.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-white p-5 shadow-2xl lg:hidden dark:bg-[#0e1c12]"
              role="dialog"
              aria-label="Filters"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-zencarta-navy dark:text-slate-100">
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full p-2 hover:bg-zencarta-surface"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarContent
                  categories={categories}
                  filters={filters}
                  setFilters={setFilters}
                  sort={sort}
                  setSort={setSort}
                  onClear={clearFilters}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
