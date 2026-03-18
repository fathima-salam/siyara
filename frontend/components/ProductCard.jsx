"use client";

import SafeImage from "./SafeImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function ProductCard({ product, activeColor }) {
    const { addItem } = useCartStore();
    const userInfo = useAuthStore((s) => s.userInfo);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const router = useRouter();
    const pathname = usePathname();

    if (!product) return null;

    const sellingPrice = product.pricing?.sellingPrice ?? product.price ?? 0;
    const offerPrice = product.pricing?.offerPrice ?? sellingPrice;
    const hasDiscount = offerPrice < sellingPrice;
    const discountPercentage = hasDiscount 
        ? Math.round(((sellingPrice - offerPrice) / sellingPrice) * 100) 
        : 0;

    // Find the variant matching the active filter color
    let activeVariant = null;
    if (activeColor) {
        const selectedColors = activeColor.split(',').map(c => c.trim().toLowerCase());
        activeVariant = product.variants?.find(v => selectedColors.includes(v.color?.toLowerCase()));
    }

    const imageSrc = activeVariant?.images?.[0] || product.thumbnails?.[0] || product.variants?.[0]?.images?.[0] || product.images?.[0];
    const brandName = product.brand || "";
    const displayName = (product.productName ?? product.name) || "Unnamed Product";

    const isFavorite = isInWishlist(product._id);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userInfo?.token) {
            router.push(`/login?redirect=${encodeURIComponent(pathname || "/shop")}`);
            return;
        }
        if (isFavorite) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    const addToCartHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userInfo?.token) {
            const redirect = `/login?redirect=${encodeURIComponent(pathname || "/shop")}`;
            router.push(redirect);
            return;
        }
        
        // Use the active color variant if it exists, else use the first one
        const selectedVariant = activeVariant || product.variants?.[0];

        addItem({
            ...product,
            qty: 1,
            size: product.sizes?.[0] || "",
            color: selectedVariant?.color || "Black"
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="group relative"
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <Link href={`/product/${product._id}`} className="block w-full h-full">
                    <SafeImage
                        src={imageSrc}
                        alt={displayName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                <button
                    onClick={toggleWishlist}
                    className="absolute top-2 right-2 z-10 p-1 text-primary hover:scale-110 transition-all group/heart"
                >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-primary group-hover/heart:text-red-500"}`} />
                </button>

                {product.isNew && (
                    <span className="absolute top-2 left-2 bg-white text-primary px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-widest leading-none">
                        New
                    </span>
                )}

                <button
                    onClick={addToCartHandler}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-primary w-[calc(100%-1rem)] py-1.5 text-[7px] font-bold uppercase tracking-widest opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white flex items-center justify-center space-x-1"
                >
                    <ShoppingBag className="w-2.5 h-2.5" />
                    <span className="hidden xs:inline">Add</span>
                </button>
            </div>

            <div className="mt-2 text-center px-1">
                {brandName && (
                    <p className="text-[7px] uppercase tracking-[0.1em] text-gray-400 font-bold mb-0.5 truncate">
                        {brandName}
                    </p>
                )}
                <Link href={`/product/${product._id}`}>
                    <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider group-hover:text-accent transition-colors truncate">
                        {displayName}
                    </h3>
                </Link>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                    <span className="text-[9px] md:text-[10px] font-bold">
                        ₹{Number(offerPrice).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </span>
                    {hasDiscount && (
                        <span className="text-[8px] md:text-[9px] text-gray-400 line-through">
                            ₹{Number(sellingPrice).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
