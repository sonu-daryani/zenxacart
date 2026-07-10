export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  accent: string;
  gradient: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "welcome",
    eyebrow: "Welcome to Zencarta",
    title: "Shop Smart.",
    highlight: "Live Easy.",
    description:
      "Discover trending products, unbeatable deals, and a seamless shopping experience — all in one place.",
    image: "/brand/hero.png",
    imageAlt: "Zencarta lifestyle — mobile app, shopping bag, sneakers, and accessories",
    ctaPrimary: { label: "Shop Now", href: "/shop" },
    ctaSecondary: { label: "Explore Deals", href: "#deals" },
    accent: "from-emerald-400/30",
    gradient: "from-[#0f3417] via-[#145a28] to-[#0f7a00]/80",
  },
  {
    id: "fashion",
    eyebrow: "New Season",
    title: "Style That",
    highlight: "Speaks for You.",
    description:
      "Fresh drops in fashion and accessories — curated looks, premium materials, prices that don't hurt.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&h=900&fit=crop",
    imageAlt: "Classic white sneakers on display",
    ctaPrimary: { label: "Shop Fashion", href: "/shop?category=fashion" },
    ctaSecondary: { label: "View Lookbook", href: "#products" },
    accent: "from-amber-400/30",
    gradient: "from-[#1a2e0f] via-[#3d4a1a] to-[#7a6b00]/70",
  },
  {
    id: "tech",
    eyebrow: "Tech Deals",
    title: "Upgrade Your",
    highlight: "Everyday Tech.",
    description:
      "Smart gadgets and audio gear built for real life — fast shipping, secure checkout, easy returns.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=900&fit=crop",
    imageAlt: "Smart fitness watch",
    ctaPrimary: { label: "Shop Electronics", href: "/shop?category=electronics" },
    ctaSecondary: { label: "See Flash Sale", href: "#deals" },
    accent: "from-sky-400/30",
    gradient: "from-[#0f1a2e] via-[#1a3a5c] to-[#0066aa]/70",
  },
];

export const heroStats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "Free", label: "Shipping $75+" },
  { value: "30-Day", label: "Easy Returns" },
];

export const heroFeatures = [
  { icon: "box" as const, title: "Top Quality", subtitle: "Premium Products" },
  { icon: "truck" as const, title: "Fast Shipping", subtitle: "Across the USA" },
  { icon: "shield" as const, title: "Secure Payments", subtitle: "100% Protected" },
  { icon: "headphones" as const, title: "24/7 Support", subtitle: "We're Here to Help" },
];
