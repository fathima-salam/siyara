"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Filter, ChevronDown, SlidersHorizontal, SearchX } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import { productService } from "@/api";
import FilterSidebar from "@/components/FilterSidebar";
import CategoryFilterBar from "@/components/CategoryFilterBar";


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
};

// Map filter label -> poster key
const FILTER_TO_POSTER_KEY = {
    All: "all",
    Hijabs: "hijab",
    Accessories: "accessories",
    Earring: "earrings",
    Rings: "rings",
    Necklace: "necklaces",
};


export default function ShopPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const keyword = searchParams.get("search") || "";

    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState("Newest");

    // Derive active filters from URL searchParams
    const activeFilters = {};
    searchParams.forEach((value, key) => {
        if (["product", "color", "stone", "gender", "priceRange", "brand"].includes(key)) {
            activeFilters[key] = value;
        }
    });

    const handleFilterChange = (newFilters) => {
        const q = new URLSearchParams();
        if (keyword) q.set("search", keyword);
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) q.set(key, value);
        });
        const queryString = q.toString();
        router.replace(queryString ? `/shop?${queryString}` : "/shop", { scroll: false });
    };

    // Fetch Unique Brands and Colors on Mount
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [brandData, colorData] = await Promise.all([
                    productService.getBrands(),
                    productService.getColors()
                ]);
                setBrands(Array.isArray(brandData) ? brandData : []);
                setColors(Array.isArray(colorData) ? colorData : []);
            } catch (err) {
                console.error("Error fetching filters:", err);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = { pageSize: 40, ...activeFilters };
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
    }, [searchParams, sortBy]);

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Banner */}
            {(() => {
                const activeCategory = activeFilters.product || "All";
                const posterKey = FILTER_TO_POSTER_KEY[activeCategory] || "all";
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
                                    alt={activeCategory}
                                    fill
                                    priority
                                    className="object-cover object-center"
                                    sizes="100vw"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/10 z-0" />
                        </div>

                        <div className={`absolute inset-0 z-10 flex ${justify} items-center px-6 md:px-12 lg:px-24`}>
                            <div className={`max-w-2xl ${textAlign} drop-shadow-sm`}>
                                {activeCategory !== "All" && (
                                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-2xl">
                                        {activeCategory}
                                    </h1>
                                )}
                                <p className={`text-white font-bold drop-shadow-lg ${activeCategory === "All" ? "text-lg md:text-xl lg:text-2xl" : "text-sm md:text-base lg:text-lg"}`}>
                                    {poster.description}
                                </p>
                            </div>
                        </div>
                    </section>
                );
            })()}

            <section className="border-t border-gray-100 pt-10 md:pt-20 pb-12">
                <div className="w-full px-4 md:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 items-start min-h-[800px]">
                        {/* Sidebar */}
                        <FilterSidebar 
                            filters={activeFilters} 
                            brands={brands}
                            colors={colors}
                            onFilterChange={handleFilterChange} 
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                        />

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Category Navigator (Text-only version) */}
                            <CategoryFilterBar 
                                activeCategory={activeFilters.product}
                                onCategoryChange={(cat) => {
                                    const newFilters = { ...activeFilters };
                                    if (cat) newFilters.product = cat;
                                    else delete newFilters.product;
                                    handleFilterChange(newFilters);
                                }}
                            />


                            {/* Grid */}
                            <div className="px-0">
                                {loading ? (
                                    <div className="py-24 text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="py-20 text-center flex flex-col items-center">
                                        <SearchX className="w-12 h-12 text-gray-200 mb-6" />
                                        <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mb-8">
                                            {keyword ? `No products found for "${keyword}"` : "No products matching filters"}
                                        </p>
                                        <button onClick={() => handleFilterChange({})} className="btn-primary">Clear Filters</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 pb-20">
                                        {products.map((product) => (
                                            <ProductCard 
                                                key={product._id} 
                                                product={product} 
                                                activeColor={activeFilters.color}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
