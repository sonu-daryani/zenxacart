"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, X } from "lucide-react";
import type { Reel } from "@/data/reels";

export function ReelsModal({
  reel,
  onClose,
}: {
  reel: Reel | null;
  onClose: () => void;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <AnimatePresence>
      {reel && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-label={`Reel by ${reel.username}`}
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-2xl bg-zencarta-navy shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={reel.thumbnailUrl}
                alt={reel.caption}
                fill
                className="object-cover"
                sizes="384px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />

              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                aria-label="Close reel"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/80">
                    <Image
                      src={reel.avatarUrl}
                      alt={reel.username}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {reel.username}
                  </span>
                </div>
                <p className="text-sm leading-snug text-white/90">
                  {reel.caption}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setLiked((v) => !v)}
                    className="flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                  >
                    <motion.span
                      animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <Heart
                        className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
                      />
                    </motion.span>
                    {(reel.likes + (liked ? 1 : 0)).toLocaleString()}
                  </button>
                  {reel.productId && (
                    <Link
                      href={`/product/${reel.productId}`}
                      onClick={onClose}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-zencarta-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zencarta-green-dark"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Shop this look
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
