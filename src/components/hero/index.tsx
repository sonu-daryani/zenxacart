"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HeroControls } from "./HeroControls";
import { HeroFeatures } from "./HeroFeatures";
import { HeroSlidePanel, HeroSlideVisual } from "./HeroSlide";
import { heroSlides } from "./hero-data";

const SLIDE_DURATION = 6000;

export function Hero() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: SLIDE_DURATION, stopOnInteraction: false })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setProgress(0);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(100, p + 100 / (SLIDE_DURATION / 100)));
    }, 100);
    return () => clearInterval(interval);
  }, [selected]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const activeSlide = heroSlides[selected];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => autoplay.stop()}
      onMouseLeave={() => autoplay.play()}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${activeSlide.gradient} transition-all duration-700`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid min-h-[min(88vh,720px)] items-stretch lg:grid-cols-2">
          <div className="relative order-2 flex flex-col justify-center lg:order-1">
            <AnimatePresence mode="wait">
              <HeroSlidePanel key={activeSlide.id} slide={activeSlide} />
            </AnimatePresence>
          </div>

          <div className="relative order-1 lg:order-2">
            <div ref={emblaRef} className="h-full overflow-hidden">
              <div className="flex h-full">
                {heroSlides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className="min-w-0 flex-[0_0_100%]"
                  >
                    <HeroSlideVisual
                      slide={slide}
                      isActive={selected === i}
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <HeroControls
          count={heroSlides.length}
          selected={selected}
          progress={progress}
          onPrev={scrollPrev}
          onNext={scrollNext}
          onSelect={scrollTo}
        />
      </div>

      <HeroFeatures />
    </section>
  );
}
