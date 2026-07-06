import type { Product } from "@/data/products";

function stripQuery(url: string): string {
  const i = url.indexOf("?");
  return i === -1 ? url : url.slice(0, i);
}

/**
 * Unsplash serves crop/flip/focal-point transforms of the same photo ID, so we can
 * derive a believable multi-angle gallery from a single source image without
 * risking broken links to guessed photo IDs.
 */
function buildUnsplashGallery(image: string): string[] {
  const base = stripQuery(image);
  return [
    `${base}?w=900&h=900&fit=crop`,
    `${base}?w=900&h=900&fit=crop&flip=h`,
    `${base}?w=900&h=900&fit=crop&crop=focalpoint&fp-x=0.7&fp-y=0.3`,
    `${base}?w=900&h=900&fit=crop&sat=-15&exp=4`,
  ];
}

export function getProductImages(product: Product): string[] {
  if (product.images?.length) return product.images;
  if (product.image.includes("images.unsplash.com")) {
    return buildUnsplashGallery(product.image);
  }
  return [product.image];
}
