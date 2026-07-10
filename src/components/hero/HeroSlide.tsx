"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import type { HeroSlide } from "./hero-data";
import { heroStats } from "./hero-data";

type HeroSlidePanelProps = {
  slide: HeroSlide;
};

export function HeroSlidePanel({ slide }: HeroSlidePanelProps) {
  return (
    <motion.div
      key={slide.id}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={staggerContainer}
      className="flex h-full flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
    >
      <motion.div variants={fadeInUp} className="mb-4 flex items-center gap-3">
        <span className="h-px w-10 bg-zencarta-green-light/80" aria-hidden />
        <span className="text-[11px] font-bold tracking-[0.2em] text-zencarta-green-light uppercase">
          {slide.eyebrow}
        </span>
      </motion.div>

      <motion.h1
        variants={fadeInUp}
        className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]"
      >
        {slide.title}{" "}
        <span className="bg-gradient-to-r from-zencarta-green-light to-emerald-300 bg-clip-text text-transparent">
          {slide.highlight}
        </span>
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-300 sm:text-base"
      >
        {slide.description}
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <Button
          href={slide.ctaPrimary.href}
          className="group uppercase tracking-wide"
        >
          {slide.ctaPrimary.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <Button
          href={slide.ctaSecondary.href}
          variant="secondary"
          className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
        >
          {slide.ctaSecondary.label}
        </Button>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8"
      >
        {heroStats.map((stat) => (
          <div key={stat.label}>
            <p className="text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

type HeroSlideVisualProps = {
  slide: HeroSlide;
  isActive: boolean;
  priority?: boolean;
};

export function HeroSlideVisual({ slide, isActive, priority }: HeroSlideVisualProps) {
  return (
    <div className="relative flex h-full min-h-[280px] items-center justify-center p-6 sm:min-h-[360px] sm:p-10 lg:min-h-0 lg:p-12">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${slide.accent} to-transparent opacity-60 blur-2xl transition-opacity duration-700 ${
          isActive ? "opacity-60" : "opacity-0"
        }`}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={
          isActive
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.95, y: 10 }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-square w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px]"
      >
        <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-white/20 to-white/5 blur-sm" />
        <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-white/15 to-white/5 ring-1 ring-white/20" />
        <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-white/5 shadow-2xl shadow-black/30 ring-1 ring-white/30 backdrop-blur-sm">
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={priority}
            className="object-cover object-center"
            sizes="(max-width: 1024px) 80vw, 460px"
          />
        </div>

        <div className="absolute -bottom-3 -left-3 rounded-2xl bg-white px-4 py-3 shadow-xl dark:bg-[#16281b]">
          <p className="text-[10px] font-semibold tracking-wider text-zencarta-muted uppercase">
            Trending Now
          </p>
          <p className="text-sm font-bold text-zencarta-navy dark:text-slate-100">
            Free shipping over $75
          </p>
        </div>
      </motion.div>
    </div>
  );
}
