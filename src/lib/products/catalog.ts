import type { Product } from "@/data/products";
import { products as staticProducts } from "@/data/products";
import { isCjConfigured } from "@/lib/cj/config";
import { fetchCjProductDetail, fetchCjProductList } from "@/lib/cj/products";

/** Full browsable catalog — live CJ listing when configured, static fallback otherwise. */
export async function getCatalog(): Promise<Product[]> {
  if (isCjConfigured()) {
    try {
      const { products } = await fetchCjProductList({ size: 24 });
      if (products.length) return products;
    } catch {
      // fall through to static catalog
    }
  }
  return staticProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  const fromStatic = staticProducts.find((p) => p.id === id);
  if (fromStatic) return fromStatic;

  if (isCjConfigured()) {
    try {
      return await fetchCjProductDetail(id);
    } catch {
      return null;
    }
  }

  return null;
}

/** Same-category products first, backfilled with the rest of the catalog. */
export function pickRelated(
  catalog: Product[],
  product: Product,
  limit = 4
): Product[] {
  const others = catalog.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
