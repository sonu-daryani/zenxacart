"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import type { CartItem } from "@/stores/cart-store";
import { useAddToCart } from "@/lib/products/use-add-to-cart";

function UpsellTile({ product }: { product: Product }) {
  const { add, adding, added } = useAddToCart(product);

  return (
    <div className="flex w-36 shrink-0 flex-col rounded-lg border border-slate-100 p-2 dark:border-[#1f3524]">
      <div className="relative aspect-square overflow-hidden rounded-md bg-zencarta-surface">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="144px" />
      </div>
      <p className="mt-2 line-clamp-2 text-xs font-medium text-zencarta-navy dark:text-slate-100">
        {product.name}
      </p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-xs font-bold text-zencarta-green">
          ${product.price.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={() => add()}
          disabled={adding}
          className={`rounded-full p-1.5 transition-colors disabled:opacity-60 ${
            added
              ? "bg-zencarta-navy text-white"
              : "bg-zencarta-green text-white hover:bg-zencarta-green-dark"
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function useUpsellSuggestions(items: CartItem[]) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const itemIds = items.map((i) => i.id).join(",");

  useEffect(() => {
    if (items.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }
    let cancelled = false;

    fetch("/api/cj/products?page=1&size=24")
      .then((res) => res.json())
      .then((data: { products: Product[] }) => {
        if (cancelled) return;
        const cartIds = new Set(items.map((i) => i.id));
        const cartCategories = new Set(items.map((i) => i.category));
        const candidates = data.products.filter((p) => !cartIds.has(p.id));
        const sameCategory = candidates.filter((p) => cartCategories.has(p.category));
        const rest = candidates.filter((p) => !cartCategories.has(p.category));
        setSuggestions([...sameCategory, ...rest].slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIds]);

  return suggestions;
}

export function CartUpsell({ items }: { items: CartItem[] }) {
  const suggestions = useUpsellSuggestions(items);

  if (suggestions.length === 0) return null;

  return (
    <div className="border-t border-slate-100 px-5 py-4 dark:border-[#1f3524]">
      <p className="text-xs font-semibold tracking-wide text-zencarta-muted uppercase">
        You may also like
      </p>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {suggestions.map((product) => (
          <UpsellTile key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
