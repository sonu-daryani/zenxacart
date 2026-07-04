"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/data/products";
import { products as fallbackProducts } from "@/data/products";
import { ProductCard } from "./ProductCard";

type SortOption = "featured" | "price-low" | "price-high" | "rating";

type Category = { id: string; name: string };

type ProductsResponse = {
  products: Product[];
  source: "cj" | "static";
  configured: boolean;
  error?: string;
};

export function ProductGrid() {
  const [sort, setSort] = useState<SortOption>("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Product[]>(fallbackProducts);
  const [catalogSource, setCatalogSource] = useState<"cj" | "static">("static");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
    <section id="products" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold tracking-widest text-zencarta-green uppercase">
              {catalogSource === "cj" ? "CJ Dropshipping" : "Best Sellers"}
            </span>
            <h2 className="mt-2 text-3xl font-bold text-zencarta-navy sm:text-4xl">
              Trending Products
            </h2>
            {catalogSource === "cj" && (
              <p className="mt-2 text-sm text-zencarta-muted">
                Fulfilled by CJ Dropshipping · prices include store markup
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:border-zencarta-green lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-zencarta-navy outline-none focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {filterOpen && categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
            <button
              key="all"
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === null
                  ? "border-zencarta-green bg-zencarta-green text-white"
                  : "border-slate-200 text-zencarta-navy hover:border-zencarta-green hover:text-zencarta-green"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "border-zencarta-green bg-zencarta-green text-white"
                    : "border-slate-200 text-zencarta-navy hover:border-zencarta-green hover:text-zencarta-green"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
