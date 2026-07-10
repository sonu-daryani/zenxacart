"use client";

import { Star, X } from "lucide-react";
import type { CatalogCategory } from "@/stores/catalog-store";

export type ShopFilters = {
  category: string | null;
  maxPrice: number;
  minRating: number;
  search: string;
};

const RATING_OPTIONS = [4.5, 4, 3, 2, 1];

export function countActiveFilters(f: ShopFilters, maxPrice: number): number {
  let n = 0;
  if (f.category) n++;
  if (f.maxPrice < maxPrice) n++;
  if (f.minRating > 0) n++;
  if (f.search.trim()) n++;
  return n;
}

type ShopFiltersSidebarProps = {
  categories: CatalogCategory[];
  filters: ShopFilters;
  maxPrice: number;
  setFilters: (updater: (f: ShopFilters) => ShopFilters) => void;
  onClear: () => void;
};

export function ShopFiltersSidebar({
  categories,
  filters,
  maxPrice,
  setFilters,
  onClear,
}: ShopFiltersSidebarProps) {
  const activeCount = countActiveFilters(filters, maxPrice);

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
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={5}
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
            }
            className="w-full"
            aria-label="Maximum price"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-zencarta-muted">
            <span>$0</span>
            <span className="font-semibold text-zencarta-navy dark:text-slate-100">
              Up to ${filters.maxPrice}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-wide text-zencarta-navy uppercase dark:text-slate-100">
          Customer Rating
        </h3>
        <div className="mt-4 flex flex-col gap-1">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))
              }
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-zencarta-navy transition-colors hover:bg-zencarta-surface dark:text-slate-100"
              aria-pressed={filters.minRating === r}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                  filters.minRating === r
                    ? "border-zencarta-green bg-zencarta-green"
                    : "border-slate-300 dark:border-[#2a4530]"
                }`}
              >
                {filters.minRating === r && (
                  <span className="h-1.5 w-1.5 rounded-sm bg-white" />
                )}
              </span>
              <span className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < r
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-slate-300 dark:text-[#2a4530]"
                    }`}
                  />
                ))}
              </span>
              <span>{r} &amp; up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
