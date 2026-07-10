import { create } from "zustand";
import type { Product } from "@/data/products";
import { products as fallbackProducts } from "@/data/products";

export type CatalogCategory = {
  id: string;
  name: string;
  icon?: string;
  count?: number;
};

type CatalogState = {
  products: Product[];
  categories: CatalogCategory[];
  source: "cj" | "static";
  loading: boolean;
  categoriesLoading: boolean;
  fetched: boolean;
  fetchCatalog: (size?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
};

let catalogPromise: Promise<void> | null = null;
let categoriesPromise: Promise<void> | null = null;

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: fallbackProducts,
  categories: [],
  source: "static",
  loading: false,
  categoriesLoading: false,
  fetched: false,

  fetchCatalog: async (size = 24) => {
    if (catalogPromise) return catalogPromise;

    catalogPromise = (async () => {
      set({ loading: true });
      try {
        const res = await fetch(`/api/cj/products?page=1&size=${size}`);
        const data = (await res.json()) as {
          products: Product[];
          source: "cj" | "static";
        };
        set({
          products: data.products,
          source: data.source,
          fetched: true,
          loading: false,
        });
      } catch {
        set({
          products: fallbackProducts,
          source: "static",
          fetched: true,
          loading: false,
        });
      } finally {
        catalogPromise = null;
      }
    })();

    return catalogPromise;
  },

  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    if (categoriesPromise) return categoriesPromise;

    categoriesPromise = (async () => {
      set({ categoriesLoading: true });
      try {
        const res = await fetch("/api/categories");
        const data = (await res.json()) as { categories: CatalogCategory[] };
        set({ categories: data.categories, categoriesLoading: false });
      } catch {
        set({ categoriesLoading: false });
      } finally {
        categoriesPromise = null;
      }
    })();

    return categoriesPromise;
  },
}));
