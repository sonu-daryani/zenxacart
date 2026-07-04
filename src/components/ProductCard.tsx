"use client";

import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { resolveCjProductForCart } from "@/lib/products/resolve-cj-product";

const badgeStyles = {
  new: "bg-blue-500",
  sale: "bg-red-500",
  bestseller: "bg-zencarta-green",
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    try {
      const resolved = await resolveCjProductForCart(product);
      addToCart(resolved);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white transition-all hover:border-zencarta-green/30 hover:shadow-xl hover:shadow-slate-200/60">
      {product.badge && (
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase ${badgeStyles[product.badge]}`}
        >
          {product.badge}
        </span>
      )}
      {discount && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-zencarta-navy px-2 py-0.5 text-[10px] font-bold text-white">
          -{discount}%
        </span>
      )}

      <button
        type="button"
        onClick={() => setLiked((v) => !v)}
        className="absolute right-3 top-12 z-10 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-zencarta-muted"}`}
        />
      </button>

      <div className="relative aspect-square overflow-hidden bg-zencarta-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-zencarta-green capitalize">
            {product.category}
          </p>
          {product.source === "cj" && (
            <span className="rounded bg-zencarta-surface px-1.5 py-0.5 text-[9px] font-bold text-zencarta-muted uppercase">
              CJ
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-zencarta-navy">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-zencarta-navy">
            {product.rating}
          </span>
          <span className="text-xs text-zencarta-muted">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <span className="text-sm xs:text-base font-bold text-zencarta-navy sm:text-lg">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-zencarta-muted line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all active:scale-95 disabled:opacity-60 ${
              added
                ? "bg-zencarta-navy text-white"
                : "bg-zencarta-green text-white hover:bg-zencarta-green-dark"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {adding ? "…" : added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
