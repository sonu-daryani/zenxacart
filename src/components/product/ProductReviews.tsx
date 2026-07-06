"use client";

import { Star } from "lucide-react";
import type { Product } from "@/data/products";
import { getProductReviews, getRatingBreakdown } from "@/lib/products/reviews";

function StarRow({ rating, size = "h-3.5 w-3.5" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300 dark:text-slate-700"
          }`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ product }: { product: Product }) {
  const reviews = getProductReviews(product);
  const breakdown = getRatingBreakdown(product);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="space-y-5">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-zencarta-navy dark:text-slate-100">
            {product.rating.toFixed(1)}
          </span>
          <div>
            <StarRow rating={product.rating} size="h-4 w-4" />
            <p className="mt-1 text-xs text-zencarta-muted">
              {product.reviews.toLocaleString()} reviews
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          {breakdown.map((row) => (
            <div key={row.star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-zencarta-muted">{row.star}</span>
              <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-[#16281b]">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className="w-8 text-right text-zencarta-muted">{row.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="border-b border-slate-100 pb-6 last:border-0 last:pb-0 dark:border-[#1f3524]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zencarta-green/10 text-xs font-bold text-zencarta-green">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-zencarta-navy dark:text-slate-100">
                    {review.author}
                    {review.verified && (
                      <span className="rounded bg-zencarta-green/10 px-1.5 py-0.5 text-[10px] font-medium text-zencarta-green">
                        Verified Purchase
                      </span>
                    )}
                  </p>
                  <div className="mt-0.5">
                    <StarRow rating={review.rating} />
                  </div>
                </div>
              </div>
              <span className="shrink-0 text-xs text-zencarta-muted">{review.date}</span>
            </div>
            {review.title && (
              <h4 className="mt-3 text-sm font-semibold text-zencarta-navy dark:text-slate-100">
                {review.title}
              </h4>
            )}
            <p className="mt-1 text-sm leading-relaxed text-zencarta-muted">
              {review.comment}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
