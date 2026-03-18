"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
    const { wishlistItems } = useWishlistStore();
    const { userInfo } = useAuthStore();
    const router = useRouter();

    // Protect the route
    useEffect(() => {
        if (!userInfo) {
            router.push("/login?redirect=/wishlist");
        }
    }, [userInfo, router]);

    if (!userInfo) return null;

    return (
        <main className="min-h-screen bg-white text-primary">
            <Header />

            <section className="pt-40 pb-20">
                <div className="container mx-auto px-6">
                    <div className="mb-16">
                        <h1 className="text-3xl md:text-5xl font-extralight uppercase tracking-[0.3em] mb-4">
                            My Wishlist
                        </h1>
                        <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest font-bold">
                            Your curated selection of timeless elegance
                        </p>
                    </div>

                    {wishlistItems.length === 0 ? (
                        <div className="py-24 text-center bg-gray-50 rounded-3xl border border-gray-100 px-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                                <Heart className="w-8 h-8 text-gray-200" />
                            </div>
                            <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Your wishlist is empty</h2>
                            <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                                Explore our collections and save your favorite pieces to find them easily later.
                            </p>
                            <Link href="/shop" className="btn-primary inline-flex items-center gap-3">
                                Start Shopping <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
                            {wishlistItems.map((product) => (
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
