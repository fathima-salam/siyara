"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Heart, SearchX, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
    // Note: This would typically come from a wishlist store or API
    // For now, implementing the UI structure
    const [wishlistItems, setWishlistItems] = useState([]); 

    return (
        <DashboardLayout title="My Wishlist">
            {wishlistItems.length === 0 ? (
                <div className="bg-white p-20 text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 text-rose-500">
                        <Heart className="w-10 h-10" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Your wishlist is empty</h2>
                    <p className="text-xs text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
                        Explore our collections and save your favorite hijabs and accessories to view them here later.
                    </p>
                    <Link href="/shop" className="btn-primary">Browse Collections</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {wishlistItems.map((item) => (
                            <motion.div 
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white border border-gray-100 shadow-sm group overflow-hidden"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                    <SafeImage src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-4 right-4 z-10">
                                        <button 
                                            className="p-3 bg-white/90 backdrop-blur-sm text-red-500 hover:bg-white transition-colors border border-gray-100"
                                            onClick={() => {/* remove */}}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-2 truncate">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm font-black text-accent uppercase mb-6">₹{item.price?.toFixed(2)}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link 
                                            href={`/product/${item._id}`}
                                            className="text-[9px] uppercase font-black tracking-widest border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            View
                                        </Link>
                                        <button className="btn-primary py-2 text-[9px] flex items-center justify-center space-x-2">
                                            <ShoppingBag className="w-3 h-3" />
                                            <span>Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </DashboardLayout>
    );
}
