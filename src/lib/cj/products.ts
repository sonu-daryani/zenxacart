import { cjConfig } from "./config";
import { cjGet } from "./client";
import type { CjListProduct, CjListV2Data, CjProductDetail } from "./types";
import type { Product } from "@/data/products";

function applyMarkup(usdPrice: number): number {
  const markup = 1 + cjConfig.priceMarkupPercent / 100;
  return Math.round(usdPrice * markup * 100) / 100;
}

function slugCategory(name?: string): string {
  if (!name) return "general";
  const n = name.toLowerCase();
  if (n.includes("electronic") || n.includes("phone")) return "electronics";
  if (n.includes("home") || n.includes("furniture")) return "home";
  if (n.includes("fashion") || n.includes("cloth") || n.includes("women"))
    return "fashion";
  if (n.includes("beauty") || n.includes("skin")) return "beauty";
  if (n.includes("sport")) return "sports";
  return "accessories";
}

function mapListItem(item: CjListProduct, defaultVid?: string): Product {
  const cost = parseFloat(item.nowPrice || item.discountPrice || item.sellPrice);
  const retail = applyMarkup(cost);
  const original =
    item.sellPrice && parseFloat(item.sellPrice) > cost
      ? applyMarkup(parseFloat(item.sellPrice))
      : undefined;

  return {
    id: item.id,
    name: item.nameEn,
    category: slugCategory(item.threeCategoryName || item.twoCategoryName),
    price: retail,
    originalPrice: original && original > retail ? original : undefined,
    rating: 4.5 + (item.listedNum ? Math.min(item.listedNum / 5000, 0.4) : 0),
    reviews: item.listedNum ?? 0,
    image: item.bigImage,
    badge:
      item.discountPrice && parseFloat(item.discountPrice) < parseFloat(item.sellPrice)
        ? "sale"
        : undefined,
    cjPid: item.id,
    cjSku: item.sku || item.spu,
    cjVid: defaultVid,
    source: "cj",
  };
}

export async function fetchCjProductList(options: {
  page?: number;
  size?: number;
  keyword?: string;
  countryCode?: string;
}): Promise<{ products: Product[]; total: number; page: number }> {
  const page = options.page ?? 1;
  const size = Math.min(options.size ?? 20, 50);

  const data = await cjGet<CjListV2Data>("/product/listV2", {
    page,
    size,
    keyWord: options.keyword,
    countryCode: options.countryCode ?? cjConfig.defaultCountryCode,
    orderBy: 1,
    sort: "desc",
  });

  const flat: CjListProduct[] = [];
  for (const block of data.content ?? []) {
    flat.push(...(block.productList ?? []));
  }

  const products = flat.map((p) => mapListItem(p));

  return {
    products,
    total: data.totalRecords ?? products.length,
    page: data.pageNumber ?? page,
  };
}

export async function fetchCjProductDetail(pid: string): Promise<Product> {
  const data = await cjGet<CjProductDetail>("/product/query", {
    pid,
    countryCode: cjConfig.defaultCountryCode,
  });

  const firstVariant = data.variants?.[0];
  const cost = firstVariant?.variantSellPrice ?? data.sellPrice ?? 0;
  const retail = applyMarkup(Number(cost));

  return {
    id: data.pid,
    name: data.productNameEn,
    category: "general",
    price: retail,
    rating: 4.6,
    reviews: 0,
    image: data.bigImage,
    cjPid: data.pid,
    cjSku: data.productSku,
    cjVid: firstVariant?.vid,
    source: "cj",
  };
}

/** Resolve variant IDs for cart items before placing CJ order */
export async function resolveVariantIds(
  items: Array<{ cjPid?: string; cjVid?: string; cjSku?: string }>
): Promise<Array<{ vid: string; sku?: string }>> {
  const resolved: Array<{ vid: string; sku?: string }> = [];

  for (const item of items) {
    if (item.cjVid) {
      resolved.push({ vid: item.cjVid, sku: item.cjSku });
      continue;
    }
    if (!item.cjPid) {
      throw new Error("Product is missing CJ product ID");
    }
    const detail = await cjGet<CjProductDetail>("/product/query", {
      pid: item.cjPid,
      countryCode: cjConfig.defaultCountryCode,
    });
    const variant = detail.variants?.[0];
    if (!variant?.vid) {
      throw new Error(`No variant found for product ${item.cjPid}`);
    }
    resolved.push({ vid: variant.vid, sku: variant.variantSku });
  }

  return resolved;
}
