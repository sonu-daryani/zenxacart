import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getCatalog, getProductById, pickRelated } from "@/lib/products/catalog";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const catalog = await getCatalog();
  const related = pickRelated(catalog, product);

  return (
    <PageShell>
      <ProductDetail product={product} related={related} />
    </PageShell>
  );
}
