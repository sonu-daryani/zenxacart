export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
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
      "https://images.unsplash.com/photo-1548036328-c9fa89d6fa51?w=400&h=400&fit=crop",
    badge: "sale",
    source: "static",
  },
];

export const navLinks = {
  shop: ["All Products", "Best Sellers", "Gift Cards", "Clearance"],
  categories: categories.map((c) => c.name),
};
