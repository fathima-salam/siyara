import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-40 pb-20 min-h-[50vh]">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">About</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-12">Home / About</p>
          {/* Content from DB can be rendered here */}
        </div>
      </section>

      <Footer />
    </main>
  );
}
