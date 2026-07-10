"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Eye, Heart, Loader2, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useAddToCart } from "@/lib/products/use-add-to-cart";
import { fadeInUp } from "@/lib/motion";

const badgeStyles = {
  new: "bg-blue-500",
  sale: "bg-red-500",
  bestseller: "bg-zencarta-green",
};

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const { add, adding, added } = useAddToCart(product);

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:border-zencarta-green/30 hover:shadow-xl hover:shadow-slate-200/60 dark:border-[#1f3524] dark:bg-[#0e1c12] dark:hover:shadow-black/40"
    >
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
        className="absolute right-3 top-12 z-10 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white dark:bg-[#16281b]/90 dark:hover:bg-[#16281b]"
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
      >
        <motion.span
          animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          className="block"
        >
          <Heart
            className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-zencarta-muted"}`}
          />
        </motion.span>
      </button>

      <div className="relative aspect-square overflow-hidden bg-zencarta-surface">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
          <Link
            href={`/product/${product.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 py-2.5 text-xs font-semibold text-zencarta-navy shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-[#16281b]/95 dark:text-slate-100"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
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
        <Link href={`/product/${product.id}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-zencarta-navy transition-colors hover:text-zencarta-green dark:text-slate-100">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-zencarta-navy dark:text-slate-100">
            {product.rating}
          </span>
          <span className="text-xs text-zencarta-muted">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:pt-4">
          <div>
            <span className="text-base font-bold text-zencarta-navy sm:text-lg dark:text-slate-100">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="ml-1.5 text-xs text-zencarta-muted line-through sm:text-sm">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <motion.button
            type="button"
            onClick={() => add()}
            disabled={adding}
            whileTap={{ scale: 0.95 }}
            className={`flex min-h-[40px] min-w-[40px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 sm:min-h-0 sm:min-w-0 ${
              added
                ? "bg-zencarta-navy text-white"
                : "bg-zencarta-green text-white hover:bg-zencarta-green-dark"
            }`}
            aria-label={added ? "Added to cart" : "Add to cart"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={adding ? "adding" : added ? "added" : "idle"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : added ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="hidden sm:inline">Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Add</span>
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
