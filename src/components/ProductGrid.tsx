"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer } from "@/lib/motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryPills } from "@/components/ui/CategoryPills";
import { ProductSkeletonGrid } from "@/components/ui/ProductSkeleton";
import { useCatalog } from "@/hooks/use-catalog";

const PAGE_SIZE = 8;

type SortOption = "featured" | "price-low" | "price-high" | "rating";

export function ProductGrid() {
  const [sort, setSort] = useState<SortOption>("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products: catalog, categories, source: catalogSource, loading } =
    useCatalog();

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

  const visible = sorted.slice(0, PAGE_SIZE);
  const hasMore = sorted.length > PAGE_SIZE;

  return (
    <section id="products" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={catalogSource === "cj" ? "CJ Dropshipping" : "Best Sellers"}
          title="Trending Products"
          action={{ label: "View All", href: "/shop" }}
        >
          {catalogSource === "cj" && (
            <p className="mt-2 text-sm text-zencarta-muted">
              Fulfilled by CJ Dropshipping · prices include store markup
            </p>
          )}
        </SectionHeader>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors lg:hidden ${
              filterOpen
                ? "border-zencarta-green bg-zencarta-green/5 text-zencarta-green"
                : "border-slate-200 text-zencarta-navy hover:border-zencarta-green dark:border-[#1f3524] dark:text-slate-100"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-zencarta-navy outline-none transition-colors focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20 dark:border-[#1f3524] dark:bg-[#0e1c12] dark:text-slate-100"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {categories.length > 0 && (
          <CategoryPills
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
            className="mt-6"
          />
        )}

        <AnimatePresence>
          {filterOpen && categories.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden lg:hidden"
            >
              <CategoryPills
                categories={categories}
                selected={selectedCategory}
                onChange={setSelectedCategory}
                size="sm"
                className="rounded-xl border border-slate-100 bg-zencarta-surface/50 p-3 dark:border-[#1f3524]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <ProductSkeletonGrid count={8} className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" />
        ) : visible.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-zencarta-muted dark:border-[#1f3524] dark:bg-[#0e1c12]">
            No products in this category.
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="ml-2 font-semibold text-zencarta-green hover:underline"
            >
              Show all
            </button>
          </div>
        ) : (
          <>
            <Reveal
              variants={staggerContainer}
              className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
            >
              {visible.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Reveal>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/shop"
                    className="group flex items-center gap-2 rounded-xl bg-zencarta-green px-8 py-3.5 text-sm font-bold tracking-wide text-white uppercase shadow-lg shadow-zencarta-green/25 transition-colors hover:bg-zencarta-green-dark"
                  >
                    Show More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
