"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
          <h2 className="mt-2 text-3xl font-bold text-zencarta-navy sm:text-4xl">
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
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={`group flex flex-col items-center rounded-xl border-2 p-5 transition-all ${
                  active === cat.id
                    ? "border-zencarta-green bg-white shadow-lg shadow-zencarta-green/10"
                    : "border-transparent bg-white hover:border-zencarta-green/30 hover:shadow-md"
                }`}
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {cat.icon}
                </span>
                <span className="mt-3 text-sm font-semibold text-zencarta-navy">
                  {cat.name}
                </span>
                <span className="mt-1 text-xs text-zencarta-muted">
                  {cat.count} items
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
