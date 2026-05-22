import HeroSection from "@/components/home/HeroSection";
import StatsBanner from "@/components/home/StatsBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBanner />
      <FeaturedProducts />
      <TestimonialsCarousel />
      <NewsletterSection />
    </>
  );
}
