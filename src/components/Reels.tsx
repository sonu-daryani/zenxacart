"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { reels, type Reel } from "@/data/reels";
import { Reveal } from "@/components/motion/Reveal";
import { ReelsModal } from "@/components/ReelsModal";
import { staggerContainer, fadeInUp } from "@/lib/motion";

function ReelCard({ reel, onOpen }: { reel: Reel; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      variants={fadeInUp}
      whileHover={{ y: -6 }}
      onClick={onOpen}
      className="group relative aspect-[9/16] w-40 shrink-0 scroll-snap-item overflow-hidden rounded-2xl bg-zencarta-navy text-left shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-zencarta-green/30 sm:w-48 dark:ring-[#1f3524]"
      aria-label={`View reel by ${reel.username}`}
    >
      <Image
        src={reel.thumbnailUrl}
        alt={reel.caption}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 40vw, 192px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />

      <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-opacity group-hover:opacity-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
          <Play className="h-4 w-4 fill-white text-white" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/70">
            <Image
              src={reel.avatarUrl}
              alt={reel.username}
              fill
              className="object-cover"
              sizes="24px"
            />
          </div>
          <span className="truncate text-xs font-semibold text-white">
            {reel.username}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-white/85">
          <Heart className="h-3 w-3 fill-white/85 text-white/85" />
          {reel.likes.toLocaleString()}
        </div>
      </div>
    </motion.button>
  );
}

export function Reels() {
  const [active, setActive] = useState<Reel | null>(null);

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 dark:bg-[#0e1c12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-widest text-zencarta-green uppercase">
            #ZencartaStyle
          </span>
          <h2 className="mt-2 text-3xl font-bold text-zencarta-navy sm:text-4xl dark:text-slate-100">
            From Our Community
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-zencarta-muted">
            Real customers, real style. Tap a reel to shop the look.
          </p>
        </div>

        <div className="relative mt-10">
          <Reveal
            variants={staggerContainer}
            className="scroll-snap-x scroll-fade-edges no-scrollbar flex gap-4 overflow-x-auto pb-4 sm:gap-5"
          >
            {reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} onOpen={() => setActive(reel)} />
            ))}
          </Reveal>
          <p className="mt-2 text-center text-xs text-zencarta-muted sm:hidden">
            Swipe to explore more →
          </p>
        </div>
      </div>

      <ReelsModal reel={active} onClose={() => setActive(null)} />
    </section>
  );
}
