import type { Product } from "@/data/products";

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  verified: boolean;
};

const REVIEWER_NAMES = [
  "Alex P.", "Jordan K.", "Sam R.", "Taylor M.", "Morgan L.", "Casey B.",
  "Riley T.", "Jamie H.", "Drew S.", "Avery N.", "Quinn D.", "Reese W.",
];

const RELATIVE_DATES = [
  "3 days ago", "1 week ago", "2 weeks ago", "3 weeks ago",
  "1 month ago", "2 months ago", "3 months ago", "5 months ago",
];

const POSITIVE_TITLES = [
  "Exceeded expectations", "Exactly as described", "Great value",
  "Would buy again", "Really happy with this",
];
const POSITIVE_COMMENTS = [
  "Shipping was quick and the quality feels much better than the price suggests. Would recommend to anyone on the fence.",
  "Works exactly as advertised. Setup took two minutes and it's been solid ever since.",
  "Better than I expected for the price. Packaging was neat and everything arrived in perfect condition.",
  "This has quickly become one of my most-used items. Solid build quality and looks great too.",
  "Bought this after reading a few reviews and it did not disappoint. Will be ordering more.",
];
const NEUTRAL_TITLES = ["Does the job", "Good, not perfect", "Solid pick"];
const NEUTRAL_COMMENTS = [
  "It's decent for the price. A couple of small details could be improved but overall I'm satisfied.",
  "Does what it says. Nothing exceptional but no complaints either.",
  "Good value overall, though delivery took a little longer than expected.",
];

/** FNV-1a style string hash so review content is stable across server/client renders. */
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getProductReviews(product: Product, count = 5): ProductReview[] {
  const rand = mulberry32(hashString(product.id));
  const reviews: ProductReview[] = [];

  for (let i = 0; i < count; i++) {
    const roll = rand();
    const rating = roll < 0.65 ? 5 : roll < 0.88 ? 4 : roll < 0.97 ? 3 : 2;
    const isPositive = rating >= 4;
    const titles = isPositive ? POSITIVE_TITLES : NEUTRAL_TITLES;
    const comments = isPositive ? POSITIVE_COMMENTS : NEUTRAL_COMMENTS;

    reviews.push({
      id: `${product.id}-review-${i}`,
      author: REVIEWER_NAMES[Math.floor(rand() * REVIEWER_NAMES.length)],
      rating,
      date: RELATIVE_DATES[Math.floor(rand() * RELATIVE_DATES.length)],
      title: titles[Math.floor(rand() * titles.length)],
      comment: comments[Math.floor(rand() * comments.length)],
      verified: rand() > 0.25,
    });
  }

  return reviews;
}

export type RatingBreakdownRow = { star: number; percent: number; count: number };

/** Synthesizes a plausible star-distribution for the summary bars from the aggregate rating/count. */
export function getRatingBreakdown(product: Product): RatingBreakdownRow[] {
  const total = Math.max(product.reviews, 1);
  const skew = Math.min(Math.max((product.rating - 3) / 2, 0), 1);

  const weights = [
    0.02 + (1 - skew) * 0.05,
    0.03 + (1 - skew) * 0.07,
    0.05 + (1 - skew) * 0.1,
    0.15 + skew * 0.1,
    0.5 + skew * 0.3,
  ];
  const sum = weights.reduce((a, b) => a + b, 0);

  return weights
    .map((w, idx) => {
      const percent = w / sum;
      return {
        star: idx + 1,
        percent: Math.round(percent * 100),
        count: Math.round(percent * total),
      };
    })
    .reverse();
}
