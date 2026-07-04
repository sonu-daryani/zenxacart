"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Headphones,
  RotateCcw,
  Shield,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

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

function TrustBadge({
  item,
}: {
  item: (typeof trustItems)[number];
}) {
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
      <span className="text-left text-xs font-semibold leading-snug text-zencarta-navy sm:text-sm">
        {item.label}
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main hero: left copy · right lifestyle visual */}
        <div className="grid items-center lg:grid-cols-2 lg:gap-2 xl:gap-6">
          {/* Left — marketing copy */}
          <div className="order-2 py-8 sm:py-10 lg:order-1 lg:py-14 lg:pr-6 xl:pr-10">
            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <span className="h-0.5 w-9 bg-zencarta-green" aria-hidden />
              <span className="text-[11px] font-bold tracking-[0.22em] text-zencarta-green uppercase">
                Welcome to Zencarta
              </span>
            </div>

            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-zencarta-navy sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
              Shop Smart.{" "}
              <span className="text-zencarta-green">Live Easy.</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zencarta-muted sm:mt-6 sm:text-base">
              Discover trending products, unbeatable deals, and a seamless
              shopping experience – all in one place.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <Link
                href="#products"
                className="group inline-flex items-center gap-2 rounded-lg bg-zencarta-green px-7 py-3.5 text-[13px] font-bold tracking-[0.1em] text-white uppercase shadow-sm shadow-zencarta-green/25 transition-colors hover:bg-zencarta-green-dark"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#deals"
                className="inline-flex items-center rounded-lg border-2 border-zencarta-green bg-white px-7 py-3.5 text-[13px] font-bold tracking-[0.1em] text-zencarta-green uppercase transition-colors hover:bg-zencarta-green/5"
              >
                Explore Deals
              </Link>
            </div>
          </div>

          {/* Right — product lifestyle image (reference placement) */}
          <div className="relative order-1 lg:order-2">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-md sm:aspect-[4/3] lg:mx-0 lg:ml-auto lg:max-w-none lg:aspect-auto lg:h-[min(540px,48vw)] lg:min-h-[460px]">
              <Image
                src={`/brand/hero.png`}
                alt="Zencarta lifestyle — mobile app, shopping bag, sneakers, and accessories"
                fill
                priority
                className="object-contain object-center lg:object-right-bottom"
                sizes="(max-width: 1024px) 90vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Features + trust — identical column grid (Top Quality ↔ 10,000+, etc.) */}
        <div
          id="trust"
          className="border-t border-slate-100 pb-10 pt-10 sm:pb-12 sm:pt-12"
        >
          <div className="mb-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8 lg:gap-x-10">
            {features.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex flex-col items-start text-left">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zencarta-green/15 text-zencarta-green">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="text-sm font-bold text-zencarta-navy">{title}</p>
                <p className="mt-0.5 text-xs leading-snug text-zencarta-muted">
                  {subtitle}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white py-6 shadow-[0_4px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:py-7 px-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-8 md:gap-y-0 lg:gap-x-10">
              {trustItems.map((item) => (
                <TrustBadge key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
