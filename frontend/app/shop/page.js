"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Filter, ChevronDown, SlidersHorizontal, SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { productService } from "@/api";

const CATEGORIES = ["All", "Hijabs", "Scarves", "Shawls", "Abayas", "Accessories"];

export default function ShopPage() {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("search") || "";
    const categoryFromUrl = searchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(() =>
        categoryFromUrl && CATEGORIES.includes(categoryFromUrl) ? categoryFromUrl : "All"
    );
    const [sortBy, setSortBy] = useState("Newest");

    // Keep filter in sync when URL category changes (e.g. nav link to /shop?category=Hijabs)
    useEffect(() => {
        const urlCategory = searchParams.get("category") || "";
        if (urlCategory && CATEGORIES.includes(urlCategory)) setFilter(urlCategory);
    }, [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filter !== "All") params.category = filter;
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

            {/* Banner */}
            <section className="pt-40 pb-20 bg-[#f8f8f8] text-center">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">Shop Hijabs & Scarves</h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Home / Shop</p>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-6">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-gray-100 pb-8 space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-8">
                            <button className="flex items-center space-x-2 text-xs uppercase tracking-widest font-bold">
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                            <div className="hidden md:flex items-center space-x-6">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
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
                                {keyword ? `No products found for "${keyword}"` : "No products available in this category"}
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
