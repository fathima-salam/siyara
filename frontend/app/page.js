import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <CategorySection />

      {/* Promotional CTA - banner image unchanged */}
      <section className="py-32 relative overflow-hidden bg-primary text-white text-center">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center bg-fixed grayscale"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600')" }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6 text-accent">Limited Offer</p>
          <h2 className="text-4xl md:text-6xl font-bold uppercase mb-10 tracking-tight">Explore our <br /> Scarf & Hijab Collection</h2>
          <button className="btn-primary bg-accent border-accent hover:bg-white hover:text-primary">
            Shop Scarves
          </button>
        </div>
      </section>

      <FeaturedProducts />

      {/* Another Promotional CTA */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-secondary p-20 flex flex-col justify-center items-start text-left">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-6 text-accent">New Arrivals</p>
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-8 tracking-tight">Premium hijabs & modest wear</h2>
          <p className="text-gray-600 mb-10 max-w-md leading-relaxed">
            Elevate your modest wardrobe with our curated hijabs, scarves and abayas—quality fabrics and timeless styles for every occasion.
          </p>
          <button className="btn-outline">Shop Hijabs</button>
        </div>
        <div className="h-[400px] lg:h-auto min-h-[500px] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200')" }}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
