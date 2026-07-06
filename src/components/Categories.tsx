"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";

type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
};

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: { categories: Category[] }) => {
        if (cancelled) return;
        setCategories(data.categories);
        if (data.categories.length > 0) setActive(data.categories[0].id);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-zencarta-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-widest text-zencarta-green uppercase">
            Browse
          </span>
          <h2 className="mt-2 text-3xl font-bold text-zencarta-navy sm:text-4xl dark:text-slate-100">
            Shop by Category
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-zencarta-muted">
            Find exactly what you need across our curated collections
          </p>
        </div>

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
          </div>
        ) : (
          <Reveal
            variants={staggerContainer}
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                type="button"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActive(cat.id)}
                className="relative flex flex-col items-center overflow-hidden rounded-xl border-2 border-transparent bg-white p-5 transition-colors hover:border-zencarta-green/30 hover:shadow-md dark:bg-[#16281b]"
              >
                {active === cat.id && (
                  <motion.span
                    layoutId="category-active"
                    className="absolute inset-0 rounded-xl border-2 border-zencarta-green shadow-lg shadow-zencarta-green/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative text-3xl transition-transform group-hover:scale-110">
                  {cat.icon}
                </span>
                <span className="relative mt-3 text-sm font-semibold text-zencarta-navy dark:text-slate-100">
                  {cat.name}
                </span>
                <span className="relative mt-1 text-xs text-zencarta-muted">
                  {cat.count} items
                </span>
              </motion.button>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
