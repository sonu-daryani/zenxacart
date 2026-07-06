import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Reels } from "@/components/Reels";
import { ProductGrid } from "@/components/ProductGrid";
import { DealsBanner } from "@/components/DealsBanner";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

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
      <Footer />
    </>
  );
}
