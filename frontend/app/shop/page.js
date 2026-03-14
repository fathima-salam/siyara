"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Filter, ChevronDown, SlidersHorizontal, SearchX } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import { productService } from "@/api";

// Product types from schema field "product" (classification), not productName
const PRODUCT_FILTERS = ["All", "Hijabs", "Accessories", "Earrings", "Rings", "Necklaces", "Scarves", "Abayas"];

// Banner poster per category: image from public/images/, description, text position (used in shop banner)
const posterimages = {
    all: {
        image: "/images/all.png",
        description: "Discover pieces that elevate every look.",
        textpositions: "center",
    },
    hijab: {
        image: "/images/hijab.png",
        description: "Soft, stylish layers that elevate you.",
        textpositions: "left",
    },
    accessories: {
        image: "/images/accessories.png",
        description: "Perfect touches to express your style.",
        textpositions: "right",
    },
    earrings: {
        image: "/images/earrings.png",
        description: "Subtle shine, bold statement.",
        textpositions: "right",
    },
    necklaces: {
        image: "/images/necklace.png",
        description: "Graceful accents for every outfit.",
        textpositions: "left",
    },
    rings: {
        image: "/images/rings.png",
        description: "Elegant circles of style and charm.",
        textpositions: "center",
    },
    scarves: {
        image: "/images/scarves.png",
        description: "Lightweight elegance for every season.",
        textpositions: "center",
    },
    abayas: {
        image: "/images/abayas.png",
        description: "Modest grace in every fold.",
        textpositions: "left",
    },
};

// Map filter label -> poster key
const FILTER_TO_POSTER_KEY = {
    All: "all",
    Hijabs: "hijab",
    Accessories: "accessories",
    Earrings: "earrings",
    Rings: "rings",
    Necklaces: "necklaces",
    Scarves: "scarves",
    Abayas: "abayas",
};

export default function ShopPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const keyword = searchParams.get("search") || "";
    const productFromUrl = searchParams.get("product") || searchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(() =>
        productFromUrl && PRODUCT_FILTERS.includes(productFromUrl) ? productFromUrl : "All"
    );
    const [sortBy, setSortBy] = useState("Newest");

    // Keep filter in sync when URL changes
    useEffect(() => {
        const urlProduct = searchParams.get("product") || searchParams.get("category") || "";
        if (urlProduct && PRODUCT_FILTERS.includes(urlProduct)) setFilter(urlProduct);
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filter !== "All") params.product = filter;
                if (keyword) params.keyword = keyword;
                if (sortBy === "Price: Low to High") params.sort = "price_asc";
                if (sortBy === "Price: High to Low") params.sort = "price_desc";
                if (sortBy === "Newest") params.sort = "newest";

                const data = await productService.getProducts(params);
                setProducts(Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filter, keyword, sortBy]);

    if (loading) return (
        <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Banner: image, description and text position from posterimages by category */}
            {(() => {
                const posterKey = FILTER_TO_POSTER_KEY[filter] || "all";
                const poster = posterimages[posterKey] || posterimages.all;
                const pos = (poster.textpositions || "center").toLowerCase();
                const textAlign = pos === "left" ? "text-left" : pos === "right" ? "text-right" : "text-center";
                const justify = pos === "left" ? "justify-start" : pos === "right" ? "justify-end" : "justify-center";
                return (
                    <section className="relative w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                        <div className="relative w-full aspect-[21/9] sm:aspect-[25/9] md:aspect-[25/8] lg:aspect-[255/80] max-h-[600px]">
                            {poster.image && (
                                <Image
                                    src={poster.image}
                                    alt={filter}
                                    fill
                                    priority
                                    className="object-cover object-center"
                                    sizes="100vw"
                                />
                            )}
                            {/* Subtle dark overlay for text legibility */}
                            <div className="absolute inset-0 bg-black/10 z-0" />
                        </div>

                        <div className={`absolute inset-0 z-10 flex ${justify} items-center px-6 md:px-12 lg:px-24`}>
                            <div className={`max-w-2xl ${textAlign} drop-shadow-sm`}>
                                {filter !== "All" && (
                                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-2xl">
                                        {filter}
                                    </h1>
                                )}
                                <p className={`text-white font-bold drop-shadow-lg ${filter === "All" ? "text-lg md:text-xl lg:text-2xl" : "text-sm md:text-base lg:text-lg"}`}>
                                    {poster.description}
                                </p>
                            </div>
                        </div>
                    </section>
                );
            })()}

            <section className="py-20">
                <div className="container mx-auto px-6">
                    {/* Controls: filter by schema "product" (All, Hijabs, Accessories, Earring, Rings, Necklace) */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-gray-100 pb-8 space-y-4 md:space-y-0">
                        <div className="flex items-center gap-6 md:gap-8 flex-wrap">
                        <div className="flex items-center gap-4 text-primary shrink-0">
                                <Filter className="w-4 h-4" />
                                <span className="text-[10px] tracking-[0.3em] font-black">FILTER</span>
                            </div>
                            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                                {PRODUCT_FILTERS.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setFilter(cat);
                                            const q = new URLSearchParams(searchParams.toString());
                                            if (cat === "All") q.delete("product"); else q.set("product", cat);
                                            q.delete("category");
                                            router.replace(q.toString() ? `/shop?${q.toString()}` : "/shop", { scroll: false });
                                        }}
                                        className={`text-[10px] uppercase tracking-[0.2em] font-bold py-1 border-b-2 transition-all ${filter === cat ? "border-accent text-primary" : "border-transparent text-gray-400 hover:text-primary"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 relative group">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Sort By:</p>
                            <button className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center space-x-1 hover:text-accent transition-colors">
                                <span>{sortBy}</span>
                                <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 min-w-[200px]">
                                {["Newest", "Price: Low to High", "Price: High to Low"].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setSortBy(option)}
                                        className="w-full text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {products.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center">
                            <SearchX className="w-12 h-12 text-gray-200 mb-6" />
                            <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mb-8">
                                {keyword ? `No products found for "${keyword}"` : filter !== "All" ? `No products in ${filter}` : "No products available"}
                            </p>
                            <button onClick={() => setFilter("All")} className="btn-primary">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                </div>
            </section>

            <Footer />
        </main>
    );
}
