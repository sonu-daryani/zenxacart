"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCatalog } from "@/hooks/use-catalog";

export function Categories() {
  const { categories, categoriesLoading } = useCatalog({
    fetchProducts: false,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  return (
    <section className="gradient-mesh bg-zencarta-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Browse"
          title="Shop by Category"
          description="Find exactly what you need across our curated collections"
          action={{ label: "View All", href: "/shop" }}
        />

        {categoriesLoading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
          </div>
        ) : (
          <div className="relative mt-10">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-md transition-colors hover:border-zencarta-green hover:text-zencarta-green sm:flex dark:border-[#2a4530] dark:bg-[#16281b] dark:text-slate-100"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-md transition-colors hover:border-zencarta-green hover:text-zencarta-green sm:flex dark:border-[#2a4530] dark:bg-[#16281b] dark:text-slate-100"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            <Reveal variants={staggerContainer}>
              <div
                ref={scrollRef}
                className="scroll-snap-x no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6"
              >
                {categories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    variants={fadeInUp}
                    className="scroll-snap-item w-[140px] shrink-0 sm:w-auto"
                  >
                    <Link
                      href={`/shop?category=${cat.id}`}
                      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zencarta-green/40 hover:shadow-lg hover:shadow-zencarta-green/10 dark:border-[#1f3524] dark:bg-[#16281b]"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zencarta-green/10 text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-zencarta-green/15">
                        {cat.icon}
                      </span>
                      <span className="mt-3 text-center text-sm font-semibold text-zencarta-navy dark:text-slate-100">
                        {cat.name}
                      </span>
                      {typeof cat.count === "number" && (
                        <span className="mt-1 rounded-full bg-zencarta-surface px-2 py-0.5 text-[11px] font-medium text-zencarta-muted transition-colors group-hover:bg-zencarta-green/10 group-hover:text-zencarta-green">
                          {cat.count} items
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
