"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/hooks/use-cart";
import { resolveCjProductForCart } from "@/lib/products/resolve-cj-product";

export function useAddToCart(product: Product) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const add = async (quantity = 1) => {
    setAdding(true);
    try {
      const resolved = await resolveCjProductForCart(product);
      addToCart(resolved, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  return { add, adding, added };
}
