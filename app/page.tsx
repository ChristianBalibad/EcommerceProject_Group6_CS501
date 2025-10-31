import Hero from "@/components/layout/Hero";
import FeaturedProducts from "@/components/feature/FeaturedProducts";
import NewArrivals from "@/components/arrivals/NewArrivals";
import FAQSection from "@/components/faq/FAQSection";
import CallToAction from "@/components/cta/CallToAction";
import CustomerReviews from "@/components/review/CustomerReviews";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FeaturedProducts />
      <NewArrivals />
      <CustomerReviews />
      <CallToAction />
      <FAQSection />
    </main>
  );
}
