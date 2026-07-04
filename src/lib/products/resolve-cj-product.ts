import type { Product } from "@/data/products";

/** Ensure CJ variant ID is present before cart/checkout */
export async function resolveCjProductForCart(
  product: Product
): Promise<Product> {
  if (product.cjVid || product.source === "static") {
    return product;
  }

  const pid = product.cjPid ?? product.id;
  const res = await fetch(`/api/cj/products/${encodeURIComponent(pid)}`);
  if (!res.ok) return product;

  const data = (await res.json()) as { product: Product };
  return { ...product, ...data.product, id: product.id };
}
