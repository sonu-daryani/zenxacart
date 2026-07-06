"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { fadeInUp } from "@/lib/motion";

export function ImageGallery({
  images,
  alt,
  badge,
  discount,
}: {
  images: string[];
  alt: string;
  badge?: string;
  discount?: number;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <Reveal variants={fadeInUp} className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-zencarta-surface">
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-zencarta-green px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
            {badge}
          </span>
        )}
        {!!discount && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-zencarta-navy px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(idx)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-20 sm:w-20 ${
                idx === active
                  ? "border-zencarta-green"
                  : "border-transparent hover:border-slate-200 dark:hover:border-[#2a4530]"
              }`}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={idx === active}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </Reveal>
  );
}
