import Hero from "@/components/layout/Hero";
import FeaturedProducts from "@/components/feature/FeaturedProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FeaturedProducts />
    </main>
  );
}
