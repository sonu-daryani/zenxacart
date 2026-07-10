import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/TrustStrip";
import { Footer } from "@/components/Footer";
import { ProductSkeletonGrid } from "@/components/ui/ProductSkeleton";

const Categories = dynamic(
  () => import("@/components/Categories").then((m) => ({ default: m.Categories }))
);

const Reels = dynamic(
  () => import("@/components/Reels").then((m) => ({ default: m.Reels }))
);

const DealsBanner = dynamic(
  () => import("@/components/DealsBanner").then((m) => ({ default: m.DealsBanner }))
);

const ProductGrid = dynamic(
  () => import("@/components/ProductGrid").then((m) => ({ default: m.ProductGrid })),
  {
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ProductSkeletonGrid count={8} />
      </div>
    ),
  }
);

const Newsletter = dynamic(
  () => import("@/components/Newsletter").then((m) => ({ default: m.Newsletter }))
);

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <Reels />
        <DealsBanner />
        <ProductGrid />
        <Newsletter />
      </main>
      <TrustStrip />
      <Footer />
    </>
  );
}
