"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCatalogStore } from "@/stores/catalog-store";

type UseCatalogOptions = {
  fetchProducts?: boolean;
  fetchCategories?: boolean;
  productSize?: number;
};

export function useCatalog(options: UseCatalogOptions = {}) {
  const {
    fetchProducts = true,
    fetchCategories = true,
    productSize = 24,
  } = options;

  const state = useCatalogStore(
    useShallow((s) => ({
      products: s.products,
      categories: s.categories,
      source: s.source,
      loading: s.loading,
      categoriesLoading: s.categoriesLoading,
      fetchCatalog: s.fetchCatalog,
      fetchCategories: s.fetchCategories,
    }))
  );

  useEffect(() => {
    const { fetchCatalog, fetchCategories } = useCatalogStore.getState();
    if (fetchProducts) void fetchCatalog(productSize);
    if (fetchCategories) void fetchCategories();
  }, [fetchProducts, fetchCategories, productSize]);

  return state;
}
