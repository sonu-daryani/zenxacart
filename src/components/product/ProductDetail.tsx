"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Heart, Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { useAddToCart } from "@/lib/products/use-add-to-cart";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { add, adding, added } = useAddToCart(product);

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

  return (
    <div className="bg-zencarta-surface py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-zencarta-muted">
          <Link href="/" className="hover:text-zencarta-green">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="capitalize">{product.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-zencarta-navy dark:text-slate-100">
            {product.name}
          </span>
        </nav>

        <div className="mt-6 grid gap-8 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-12 dark:bg-[#0e1c12]">
          <Reveal
            variants={fadeInUp}
            className="relative aspect-square overflow-hidden rounded-xl bg-zencarta-surface"
          >
            {product.badge && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-zencarta-green px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="absolute right-3 top-3 z-10 rounded-full bg-zencarta-navy px-2 py-0.5 text-[10px] font-bold text-white">
                -{discount}%
              </span>
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </Reveal>

          <Reveal variants={staggerContainer} className="flex flex-col">
            <motion.p
              variants={fadeInUp}
              className="text-xs font-semibold tracking-wide text-zencarta-green uppercase"
            >
              {product.category}
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="mt-2 text-2xl font-bold text-zencarta-navy sm:text-3xl dark:text-slate-100"
            >
              {product.name}
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="mt-3 flex items-center gap-2"
            >
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-zencarta-navy dark:text-slate-100">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-zencarta-muted">
                ({product.reviews} reviews)
              </span>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-5 flex items-baseline gap-3"
            >
              <span className="text-3xl font-bold text-zencarta-navy dark:text-slate-100">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-zencarta-muted line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </motion.div>

            {product.description && (
              <motion.p
                variants={fadeInUp}
                className="mt-5 max-w-prose text-sm leading-relaxed text-zencarta-muted"
              >
                {product.description}
              </motion.p>
            )}

            <motion.div variants={fadeInUp} className="mt-8 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#2a4530]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-zencarta-navy hover:text-zencarta-green dark:text-slate-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={quantity}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="block w-8 text-center text-sm font-semibold text-zencarta-navy dark:text-slate-100"
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-zencarta-navy hover:text-zencarta-green dark:text-slate-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <motion.button
                type="button"
                onClick={() => add(quantity)}
                disabled={adding}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold uppercase transition-colors disabled:opacity-60 ${
                  added
                    ? "bg-zencarta-navy text-white"
                    : "bg-zencarta-green text-white hover:bg-zencarta-green-dark"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={adding ? "adding" : added ? "added" : "idle"}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                  >
                    {adding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : added ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                    {adding ? "Adding…" : added ? "Added to cart" : "Add to Cart"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <button
                type="button"
                onClick={() => setLiked((v) => !v)}
                className="rounded-lg border border-slate-200 p-3 transition-colors hover:border-red-200 dark:border-[#2a4530] dark:hover:border-red-900/50"
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
            </motion.div>
          </Reveal>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-zencarta-navy sm:text-2xl dark:text-slate-100">
              You may also like
            </h2>
            <Reveal
              variants={staggerContainer}
              className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
            >
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
