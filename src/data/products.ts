export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
  badge?: "new" | "sale" | "bestseller";
  /** CJ Dropshipping product ID */
  cjPid?: string;
  /** CJ variant ID (required for fulfillment) */
  cjVid?: string;
  /** CJ SKU / SPU */
  cjSku?: string;
  source?: "static" | "cj";
};

export const categories = [
  { id: "electronics", name: "Electronics", icon: "📱", count: 124 },
  { id: "home", name: "Home & Living", icon: "🏠", count: 89 },
  { id: "fashion", name: "Fashion", icon: "👗", count: 210 },
  { id: "beauty", name: "Beauty", icon: "✨", count: 76 },
  { id: "sports", name: "Sports", icon: "⚽", count: 54 },
  { id: "accessories", name: "Accessories", icon: "⌚", count: 98 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Speaker",
    category: "electronics",
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.8,
    reviews: 342,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    description:
      "Rich, room-filling sound in a compact, splash-resistant body. Up to 12 hours of playback on a single charge, with easy Bluetooth pairing to any device.",
    badge: "sale",
    source: "static",
  },
  {
    id: "2",
    name: "Classic White Sneakers",
    category: "fashion",
    price: 89.99,
    rating: 4.9,
    reviews: 521,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    description:
      "A timeless low-top silhouette in premium leather, built on a cushioned sole for all-day comfort. Pairs with everything from denim to dresses.",
    badge: "bestseller",
    source: "static",
  },
  {
    id: "3",
    name: "Premium Tortoiseshell Sunglasses",
    category: "accessories",
    price: 129.99,
    rating: 4.7,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    description:
      "Polarized UV400 lenses in a classic tortoiseshell frame. Lightweight acetate construction with spring hinges for a comfortable, secure fit.",
    badge: "new",
    source: "static",
  },
  {
    id: "4",
    name: "Smart Fitness Watch",
    category: "electronics",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviews: 412,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    description:
      "Track heart rate, sleep, and workouts with a bright always-on display and up to 7 days of battery life. Water-resistant to 50 meters.",
    badge: "sale",
    source: "static",
  },
  {
    id: "5",
    name: "Organic Skincare Set",
    category: "beauty",
    price: 59.99,
    rating: 4.8,
    reviews: 267,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    description:
      "A 4-piece routine of cleanser, toner, serum, and moisturizer made with certified organic botanicals. Suitable for all skin types.",
    badge: "bestseller",
    source: "static",
  },
  {
    id: "6",
    name: "Minimalist Desk Lamp",
    category: "home",
    price: 44.99,
    rating: 4.5,
    reviews: 143,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    description:
      "Stepless touch dimming across 3 color temperatures, with a folding arm that tucks flat when not in use. USB-C powered.",
    badge: "new",
    source: "static",
  },
  {
    id: "7",
    name: "Yoga Mat Pro",
    category: "sports",
    price: 34.99,
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    description:
      "Extra-thick, non-slip 6mm cushioning with a moisture-resistant surface on both sides. Includes a carrying strap.",
    source: "static",
  },
  {
    id: "8",
    name: "Leather Crossbody Bag",
    category: "fashion",
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.9,
    reviews: 334,
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=400&fit=crop",
    description:
      "Full-grain leather crossbody with an adjustable strap and a structured interior with card slots. Compact enough for everyday essentials.",
    badge: "sale",
    source: "static",
  },
];

export const navLinks = {
  shop: ["All Products", "Best Sellers", "Gift Cards", "Clearance"],
  categories: categories.map((c) => c.name),
};
