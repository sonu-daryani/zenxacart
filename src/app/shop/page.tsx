"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer } from "@/lib/motion";
import { ProductSkeletonGrid } from "@/components/ui/ProductSkeleton";
import { useCatalog } from "@/hooks/use-catalog";
import {
  ShopFiltersSidebar,
  countActiveFilters,
  type ShopFilters,
} from "@/components/shop/ShopFilters";

const PAGE_SIZE = 12;
const MAX_PRICE = 500;

type SortOption = "featured" | "price-low" | "price-high" | "rating";

const EMPTY_FILTERS: ShopFilters = {
  category: null,
  maxPrice: MAX_PRICE,
  minRating: 0,
  search: "",
};

function filtersFromSearchParams(
  category: string | null,
  overrides?: Partial<ShopFilters>
): ShopFilters {
  return {
    ...EMPTY_FILTERS,
    ...overrides,
    category: category ?? overrides?.category ?? null,
  };
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [sort, setSort] = useState<SortOption>("featured");
  const [filters, setFilters] = useState<ShopFilters>(() =>
    filtersFromSearchParams(categoryFromUrl)
  );
  const { products: catalog, categories, source: catalogSource, loading } =
    useCatalog({ productSize: 24 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters((prev) =>
      filtersFromSearchParams(categoryFromUrl, {
        maxPrice: prev.maxPrice,
        minRating: prev.minRating,
        search: prev.search,
      })
    );
  }, [categoryFromUrl]);

  const sorted = useMemo(() => {
    let list = [...catalog];
    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.maxPrice < MAX_PRICE) {
      list = list.filter((p) => p.price <= filters.maxPrice);
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

  const [page, setPage] = useState(1);
  const filtersKey = JSON.stringify(filters) + sort;
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey);
  if (filtersKey !== prevFiltersKey) {
    setPrevFiltersKey(filtersKey);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = sorted.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, sorted.length);

  const activeCount = countActiveFilters(filters, MAX_PRICE);
  const clearFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <PageShell>
      <div className="bg-zencarta-surface py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-zencarta-muted">
            <Link href="/" className="hover:text-zencarta-green">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-zencarta-navy dark:text-slate-100">Shop</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold tracking-widest text-zencarta-green uppercase">
                {catalogSource === "cj" ? "CJ Dropshipping" : "Full Catalog"}
              </span>
              <h1 className="mt-2 text-3xl font-bold text-zencarta-navy sm:text-4xl dark:text-slate-100">
                All Products
              </h1>
              <p className="mt-2 text-sm text-zencarta-muted">
                {loading
                  ? "Loading products…"
                  : sorted.length === 0
                    ? "0 results"
                    : `Showing ${rangeStart}-${rangeEnd} of ${sorted.length} results`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:border-zencarta-green lg:hidden dark:border-[#1f3524] dark:text-slate-100"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zencarta-green text-[10px] font-bold text-white">
                    {activeCount}
                  </span>
                )}
              </button>
              <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-zencarta-navy dark:border-[#1f3524] dark:bg-[#0e1c12] dark:text-slate-100">
                Sort by
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="bg-transparent outline-none"
                  aria-label="Sort products"
                >
                  <option value="featured">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </label>
            </div>
          </div>

          <div className="relative mt-6 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zencarta-muted" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search products…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-zencarta-navy shadow-sm outline-none transition-all focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20 dark:border-[#1f3524] dark:bg-[#0e1c12] dark:text-slate-100"
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-[#1f3524] dark:bg-[#0e1c12]">
                <ShopFiltersSidebar
                  categories={categories}
                  filters={filters}
                  maxPrice={MAX_PRICE}
                  setFilters={setFilters}
                  onClear={clearFilters}
                />
              </div>
            </aside>

            <div>
              {loading ? (
                <ProductSkeletonGrid
                  count={12}
                  className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
                />
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
                <>
                  <Reveal
                    variants={staggerContainer}
                    className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {visible.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </Reveal>

                  {pageCount > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:border-zencarta-green disabled:opacity-40 dark:border-[#1f3524] dark:text-slate-100"
                        aria-label="Previous page"
                      >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      </button>
                      {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPage(i + 1)}
                          className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                            page === i + 1
                              ? "bg-zencarta-green text-white"
                              : "text-zencarta-navy hover:bg-white dark:text-slate-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        disabled={page === pageCount}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:border-zencarta-green disabled:opacity-40 dark:border-[#1f3524] dark:text-slate-100"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
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
                <ShopFiltersSidebar
                  categories={categories}
                  filters={filters}
                  maxPrice={MAX_PRICE}
                  setFilters={setFilters}
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

function ShopPageFallback() {
  return (
    <PageShell>
      <div className="bg-zencarta-surface py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductSkeletonGrid
            count={12}
            className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
          />
        </div>
      </div>
    </PageShell>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopPageContent />
    </Suspense>
  );
}
