"use client";

import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { fadeInUp, scaleIn } from "@/lib/motion";

function useCountdown(targetMinutes: number) {
  const [seconds, setSeconds] = useState(targetMinutes * 60);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h, m, s };
}

function Pad({ value }: { value: number }) {
  return (
    <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white/20 text-xl font-bold tabular-nums text-white backdrop-blur-sm sm:h-14 sm:w-14 sm:text-2xl">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function DealsBanner() {
  const { h, m, s } = useCountdown(4 * 60 + 32); // ~4h 32m demo

  return (
    <section
      id="deals"
      className="relative overflow-hidden bg-zencarta-navy py-16 sm:py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zencarta-green/20 via-transparent to-transparent" />
      <div
        className="animate-blob pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-zencarta-green/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
          <Reveal variants={fadeInUp} className="text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zencarta-green/20 px-4 py-1.5 text-sm font-medium text-zencarta-green-light">
              <Tag className="h-4 w-4" />
              Limited Time Offer
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Flash Sale — Up to{" "}
              <span className="text-zencarta-green-light">50% Off</span>
            </h2>
            <p className="mt-3 max-w-md text-slate-300">
              Grab exclusive deals on electronics, fashion, and more before
              time runs out.
            </p>
            <Link
              href="#products"
              className="mt-6 inline-flex rounded-lg bg-zencarta-green px-6 py-3 text-sm font-semibold text-white uppercase transition-colors hover:bg-zencarta-green-dark"
            >
              Shop the Sale
            </Link>
          </Reveal>

          <Reveal variants={scaleIn} className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="h-4 w-4" />
              Ends in
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center gap-1">
                <Pad value={h} />
                <span className="text-xs text-slate-400">Hours</span>
              </div>
              <span className="text-2xl font-bold text-white">:</span>
              <div className="flex flex-col items-center gap-1">
                <Pad value={m} />
                <span className="text-xs text-slate-400">Mins</span>
              </div>
              <span className="text-2xl font-bold text-white">:</span>
              <div className="flex flex-col items-center gap-1">
                <Pad value={s} />
                <span className="text-xs text-slate-400">Secs</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
