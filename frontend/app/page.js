import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import StylingGuide from "@/components/StylingGuide";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <CategorySection />

      {/* Promotional CTA - banner image unchanged */}
      <section className="py-52 relative overflow-hidden bg-primary text-white text-center">
        <div
          className="absolute inset-0 opacity-60 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/banner-2-sec3.jpg')" }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light tracking-wide italic">
            "Embrace elegance and modesty with our curated collection of hijabs, crafted from premium fabrics to empower your everyday style."
          </p>
        </div>
      </section>

      <FeaturedProducts />

      <StylingGuide />

      {/* Another Promotional CTA */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-secondary p-20 flex flex-col justify-center items-start text-left">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6 text-accent">New Arrivals</p>
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-8 tracking-tight">Premium hijabs & jewellery</h2>
          <p className="text-gray-600 mb-10 max-w-md leading-relaxed">
            Elevate your lifestyle with our curated hijabs and timeless diamond jewellery pieces—crafted with excellence for every occasion.
          </p>
          <button className="btn-outline">Shop Hijabs</button>
        </div>
        <div className="h-[400px] lg:h-auto min-h-[500px] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/banner3.jpg')" }}
          />
        </div>
      </section>

      <FAQ />

      <Footer />
    </main>
  );
}
