"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type HeroControlsProps = {
  count: number;
  selected: number;
  progress: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export function HeroControls({
  count,
  selected,
  progress,
  onPrev,
  onNext,
  onSelect,
}: HeroControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 pb-8 sm:px-10 lg:px-14">
      <div className="flex flex-1 gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative h-1 flex-1 overflow-hidden rounded-full bg-white/20"
          >
            <span
              className={`absolute inset-0 rounded-full bg-zencarta-green-light transition-opacity ${
                selected === i ? "opacity-100" : "opacity-0 group-hover:opacity-40"
              }`}
            />
            {selected === i && (
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          className="rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
