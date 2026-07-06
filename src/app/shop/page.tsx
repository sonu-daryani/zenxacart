"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
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

function SidebarContent({
  categories,
  selectedCategory,
  setSelectedCategory,
  sort,
  setSort,
}: {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
}) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold tracking-wide text-zencarta-navy uppercase dark:text-slate-100">
          Categories
        </h3>
        <div className="mt-4 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              selectedCategory === null
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
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                selectedCategory === cat.id
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
                    selectedCategory === cat.id ? "text-white/80" : "text-zencarta-muted"
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
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
  }, [catalog, sort, selectedCategory]);

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
            </button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]">
                <SidebarContent
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  sort={sort}
                  setSort={setSort}
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
                  No products found in this category.
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
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(id) => {
                    setSelectedCategory(id);
                    setMobileFiltersOpen(false);
                  }}
                  sort={sort}
                  setSort={(s) => {
                    setSort(s);
                    setMobileFiltersOpen(false);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
