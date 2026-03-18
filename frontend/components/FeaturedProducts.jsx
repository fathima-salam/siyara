"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { productService } from "@/api";

export default function FeaturedProducts() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await productService.getFeatured();
                setFeaturedProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading) return (
        <div className="py-24 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
    );

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="text-center mb-16 px-4">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4"
                    >
                        Best Sellers
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold uppercase tracking-tight"
                    >
                        Featured Hijabs & Scarves
                    </motion.h2>
                </div>

                {featuredProducts.length === 0 ? (
                    <p className="text-gray-500 text-sm uppercase tracking-widest text-center">No featured products yet. Add active products in the database.</p>
                ) : (
                    <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

                <div className="mt-20 text-center">
                    <Link href="/shop" className="btn-outline inline-block">
                        View All Hijabs
                    </Link>
                </div>
            </div>
        </section>
    );
}
