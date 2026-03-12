"use client";

import SafeImage from "./SafeImage";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";

export default function ProductCard({ product }) {
    const { addItem } = useCartStore();

    const price = product.pricing?.offerPrice ?? product.pricing?.sellingPrice ?? product.price ?? 0;
    const imageSrc = product.thumbnails?.[0] || product.variants?.[0]?.images?.[0] || product.images?.[0];
    const displayName = product.productName ?? product.name;

    const addToCartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            ...product,
            qty: 1,
            size: product.sizes?.[0] || "M",
            color: product.variants?.[0]?.color || product.colors?.[0] || "Black"
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Link href={`/product/${product._id}`} className="block w-full h-full">
                    <SafeImage
                        src={imageSrc}
                        alt={displayName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {product.isNew && (
                    <span className="absolute top-4 left-4 bg-white text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                        New Arrival
                    </span>
                )}

                <button
                    onClick={addToCartHandler}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-primary w-[calc(100%-2rem)] py-3 text-[10px] font-bold uppercase tracking-widest opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white flex items-center justify-center space-x-2"
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Quick Add</span>
                </button>
            </div>

            <div className="mt-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">
                    {product.category}
                </p>
                <Link href={`/product/${product._id}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider group-hover:text-accent transition-colors">
                        {displayName}
                    </h3>
                </Link>
                <p className="mt-2 text-sm font-medium">
                    ${Number(price).toFixed(2)}
                </p>
            </div>
        </motion.div>
    );
}
