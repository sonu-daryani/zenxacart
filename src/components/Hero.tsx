"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  RotateCcw,
  Shield,
  ShieldCheck,
  Star,
  Box,
  Truck,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const slides = [
  {
    eyebrow: "Welcome to Zencarta",
    title: "Shop Smart.",
    highlight: "Live Easy.",
    description:
      "Discover trending products, unbeatable deals, and a seamless shopping experience – all in one place.",
    image: "/brand/hero.png",
    imageAlt:
      "Zencarta lifestyle — mobile app, shopping bag, sneakers, and accessories",
    ctaPrimary: { label: "Shop Now", href: "#products" },
    ctaSecondary: { label: "Explore Deals", href: "#deals" },
    tone: "from-zencarta-green/15",
  },
  {
    eyebrow: "New Season",
    title: "Style That",
    highlight: "Speaks for You.",
    description:
      "Fresh drops in fashion and accessories — curated looks, premium materials, prices that don't hurt.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&h=900&fit=crop",
    imageAlt: "Classic white sneakers on display",
    ctaPrimary: { label: "Shop Fashion", href: "#products" },
    ctaSecondary: { label: "View Lookbook", href: "#products" },
    tone: "from-amber-400/15",
  },
  {
    eyebrow: "Tech Deals",
    title: "Upgrade Your",
    highlight: "Everyday Tech.",
    description:
      "Smart gadgets and audio gear built for real life — fast shipping, secure checkout, easy returns.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=900&fit=crop",
    imageAlt: "Smart fitness watch",
    ctaPrimary: { label: "Shop Electronics", href: "#products" },
    ctaSecondary: { label: "See Flash Sale", href: "#deals" },
    tone: "from-sky-400/15",
  },
];

const features = [
  { icon: Box, title: "Top Quality", subtitle: "Premium Products" },
  { icon: Truck, title: "Fast Shipping", subtitle: "Across the USA" },
  { icon: Shield, title: "Secure Payments", subtitle: "100% Protected" },
  { icon: Headphones, title: "24/7 Support", subtitle: "We're Here to Help" },
];

const trustItems = [
  { icon: Star, label: "10,000+ Happy Customers" },
  { icon: ShieldCheck, label: "100% Secure Checkout" },
  { icon: RotateCcw, label: "30-Day Easy Returns" },
  { icon: "stars" as const, label: "Trusted by Thousands" },
];

function TrustBadge({ item }: { item: (typeof trustItems)[number] }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {item.icon === "stars" ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zencarta-green/15">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3 w-3 fill-zencarta-green text-zencarta-green"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zencarta-green/15 text-zencarta-green">
          <item.icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      )}
      <span className="text-left text-xs font-semibold leading-snug text-zencarta-navy sm:text-sm dark:text-slate-100">
        {item.label}
      </span>
    </div>
  );
}

const scaleInCard = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 5500, stopOnInteraction: false })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const active = slides[selected];

  return (
    <section
      className="relative overflow-hidden bg-white dark:bg-[#0e1c12]"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.play()}
    >
      <div
        className={`pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-gradient-to-br ${active.tone} to-transparent blur-3xl transition-colors duration-700`}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, i) => (
              <div key={slide.title + i} className="min-w-0 flex-[0_0_100%]">
                <div className="grid items-center lg:grid-cols-2 lg:gap-2 xl:gap-6">
                  <div className="order-2 py-8 sm:py-10 lg:order-1 lg:py-14 lg:pr-6 xl:pr-10">
                    <AnimatePresence mode="wait">
                      {selected === i && (
                        <motion.div
                          key={i}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={staggerContainer}
                        >
                          <motion.div
                            variants={fadeInUp}
                            className="mb-5 flex items-center gap-3 sm:mb-6"
                          >
                            <span
                              className="h-0.5 w-9 bg-zencarta-green"
                              aria-hidden
                            />
                            <span className="text-[11px] font-bold tracking-[0.22em] text-zencarta-green uppercase">
                              {slide.eyebrow}
                            </span>
                          </motion.div>

                          <motion.h1
                            variants={fadeInUp}
                            className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-zencarta-navy sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] dark:text-slate-100"
                          >
                            {slide.title}{" "}
                            <span className="text-zencarta-green">
                              {slide.highlight}
                            </span>
                          </motion.h1>

                          <motion.p
                            variants={fadeInUp}
                            className="mt-5 max-w-md text-[15px] leading-relaxed text-zencarta-muted sm:mt-6 sm:text-base"
                          >
                            {slide.description}
                          </motion.p>

                          <motion.div
                            variants={fadeInUp}
                            className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4"
                          >
                            <Link
                              href={slide.ctaPrimary.href}
                              className="group inline-flex items-center gap-2 rounded-lg bg-zencarta-green px-7 py-3.5 text-[13px] font-bold tracking-[0.1em] text-white uppercase shadow-sm shadow-zencarta-green/25 transition-colors hover:bg-zencarta-green-dark"
                            >
                              {slide.ctaPrimary.label}
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link
                              href={slide.ctaSecondary.href}
                              className="inline-flex items-center rounded-lg border-2 border-zencarta-green bg-white px-7 py-3.5 text-[13px] font-bold tracking-[0.1em] text-zencarta-green uppercase transition-colors hover:bg-zencarta-green/5 dark:bg-[#16281b]"
                            >
                              {slide.ctaSecondary.label}
                            </Link>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative order-1 lg:order-2">
                    <div className="relative mx-auto aspect-[5/4] w-full max-w-md sm:aspect-[4/3] lg:mx-0 lg:ml-auto lg:max-w-none lg:aspect-auto lg:h-[min(540px,48vw)] lg:min-h-[460px]">
                      <Image
                        src={slide.image}
                        alt={slide.imageAlt}
                        fill
                        priority={i === 0}
                        className="object-contain object-center lg:object-right-bottom"
                        sizes="(max-width: 1024px) 90vw, 50vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slideshow controls */}
        <div className="flex items-center justify-center gap-4 pb-6 lg:justify-start lg:pl-0">
          <button
            type="button"
            onClick={scrollPrev}
            className="rounded-full border border-slate-200 p-2 text-zencarta-navy transition-colors hover:border-zencarta-green hover:text-zencarta-green dark:border-[#2a4530] dark:text-slate-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.title + i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-2 w-6 overflow-hidden rounded-full bg-slate-200 dark:bg-[#2a4530]"
              >
                {selected === i && (
                  <motion.span
                    layoutId="hero-dot"
                    className="absolute inset-0 rounded-full bg-zencarta-green"
                  />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={scrollNext}
            className="rounded-full border border-slate-200 p-2 text-zencarta-navy transition-colors hover:border-zencarta-green hover:text-zencarta-green dark:border-[#2a4530] dark:text-slate-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Features + trust — identical column grid (Top Quality ↔ 10,000+, etc.) */}
        <div
          id="trust"
          className="border-t border-slate-100 pb-10 pt-10 sm:pb-12 sm:pt-12 dark:border-[#1f3524]"
        >
          <Reveal
            variants={staggerContainer}
            className="mb-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8 lg:gap-x-10"
          >
            {features.map(({ icon: Icon, title, subtitle }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="flex flex-col items-start text-left"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zencarta-green/15 text-zencarta-green">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="text-sm font-bold text-zencarta-navy dark:text-slate-100">
                  {title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-zencarta-muted">
                  {subtitle}
                </p>
              </motion.div>
            ))}
          </Reveal>

          <Reveal
            variants={scaleInCard}
            className="rounded-2xl bg-white py-6 shadow-[0_4px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:py-7 px-4 dark:bg-[#16281b] dark:ring-[#2a4530]"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-8 md:gap-y-0 lg:gap-x-10">
              {trustItems.map((item) => (
                <TrustBadge key={item.label} item={item} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
