"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import SafeImage from "@/components/SafeImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Plus,
    Minus,
    Star,
    Heart,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Truck,
    RotateCcw,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { productService } from "@/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const addItem = useCartStore((state) => state.addItem);
    const userInfo = useAuthStore((s) => s.userInfo);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getById(params.id);
                setProduct(data);
                const colors = data.variants?.map((v) => v.color) || [];
                if (colors.length > 0) setSelectedColor(colors[0]);

                // Fetch similar products
                if (data.product) {
                    const similarData = await productService.getProducts({ product: data.product });
                    const list = Array.isArray(similarData?.products) 
                        ? similarData.products 
                        : Array.isArray(similarData) ? similarData : [];
                    // Filter out current product and limit to 4
                    setSimilarProducts(list.filter(p => p._id !== data._id).slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params?.id) fetchProduct();
    }, [params?.id]);

    const colors = product?.variants?.map((v) => v.color) || [];
    const selectedVariant = useMemo(
        () => product?.variants?.find((v) => v.color === selectedColor),
        [product, selectedColor]
    );

    const images = useMemo(() => {
        if (!product) return [];
        if (selectedVariant?.images?.length) return selectedVariant.images.filter(Boolean);
        if (product.thumbnails?.length) return product.thumbnails.filter(Boolean);
        const first = product.variants?.[0]?.images;
        if (Array.isArray(first) && first.length) return first.filter(Boolean);
        return [];
    }, [product, selectedVariant]);

    const currentImage = images[mainImageIndex] || images[0];

    useEffect(() => {
        setMainImageIndex(0);
    }, [selectedColor]);

    const hasOffer =
        product?.pricing?.offerPrice != null &&
        Number(product.pricing.offerPrice) < Number(product?.pricing?.sellingPrice ?? 0);
    const displayPrice = Number(
        product?.pricing?.offerPrice ?? product?.pricing?.sellingPrice ?? 0
    ).toFixed(2);
    const originalPrice =
        hasOffer && product?.pricing?.sellingPrice != null
            ? Number(product.pricing.sellingPrice).toFixed(2)
            : null;

    const sku = selectedVariant?.sku || product?.productId || "";

    const cartItems = useCartStore((s) => s.cartItems);
    const isInCart = cartItems.some(
        (x) => x._id === product?._id && (x.size || "") === "" && (x.color || "") === (selectedColor || "")
    );

    const handleAddToCart = () => {
        if (!userInfo?.token) {
            router.push(`/login?redirect=${encodeURIComponent(`/product/${params?.id || product?._id}`)}`);
            return;
        }
        addItem({
            ...product,
            size: "",
            color: selectedColor,
            qty: quantity,
            image: selectedVariant?.images?.[0] || product?.thumbnails?.[0],
        });
    };

    const handleBuyNow = () => {
        if (!userInfo?.token) {
            router.push(`/login?redirect=${encodeURIComponent(`/product/${params?.id || product?._id}`)}`);
            return;
        }
        handleAddToCart();
        router.push("/cart");
    };

    const isFavorite = isInWishlist(product?._id);
    const toggleWishlist = () => {
        if (!userInfo?.token) {
            router.push(`/login?redirect=${encodeURIComponent(`/product/${params?.id || product?._id}`)}`);
            return;
        }
        if (isFavorite) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    const inStock = (product?.totalStock ?? selectedVariant?.quantity ?? 0) > 0;

    if (loading)
        return (
            <div className="py-24 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            </div>
        );

    if (!product)
        return (
            <div className="py-24 text-center">
                <Header />
                <p className="text-gray-500">Product not found</p>
                <Footer />
            </div>
        );

    return (
        <main className="min-h-screen">
            <Header />

            <section className="pt-24 pb-12">
                <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        {/* Left: Gallery with main image + arrows + thumbnails */}
                        <div className="space-y-3 lg:max-w-md">
                            <div className="relative aspect-[3/4] max-h-[420px] lg:max-h-[520px] overflow-hidden bg-gray-100 rounded-lg">
                                {currentImage && (
                                    <SafeImage
                                        src={currentImage}
                                        alt={product.productName || product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                )}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMainImageIndex((i) =>
                                                    i === 0 ? images.length - 1 : i - 1
                                                )
                                            }
                                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-white/90 shadow flex items-center justify-center text-gray-800 hover:bg-white transition"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMainImageIndex((i) =>
                                                    i === images.length - 1 ? 0 : i + 1
                                                )
                                            }
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-white/90 shadow flex items-center justify-center text-gray-800 hover:bg-white transition"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-1.5 overflow-x-auto pb-1">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setMainImageIndex(i)}
                                            className={`relative w-14 h-14 shrink-0 rounded overflow-hidden border-2 transition ${
                                                mainImageIndex === i
                                                    ? "border-primary ring-1 ring-primary/30"
                                                    : "border-transparent hover:border-gray-300"
                                            }`}
                                        >
                                            <SafeImage
                                                src={img}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Details */}
                        <div className="flex flex-col">
                            <p className="text-xs text-gray-500 mb-0.5">{product.category}</p>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                {product.productName || product.name}
                            </h1>

                            {(product.rating != null || product.numReviews != null) && (
                                <div className="flex items-center gap-1.5 mb-3">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${
                                                    i <= (product.rating ?? 0)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        {product.rating ?? "0"} [
                                        {product.numReviews ?? 0} Review
                                        {(product.numReviews ?? 0) !== 1 ? "s" : ""}]
                                    </span>
                                </div>
                            )}

                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-xl font-bold text-gray-900">
                                    ₹{displayPrice}
                                </span>
                                {originalPrice && (
                                    <span className="text-base text-gray-400 line-through">
                                        ₹{originalPrice}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                {product.description || "No description available."}
                            </p>

                            {/* Color */}
                            {colors.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Color: {selectedColor}
                                    </p>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
                                                    selectedColor === color
                                                        ? "border-primary ring-2 ring-primary/20"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                title={color}
                                            >
                                                <span
                                                    className="w-4 h-4 rounded-full bg-gray-200"
                                                    style={{
                                                        backgroundColor:
                                                            color.toLowerCase().replace(/\s/g, ""),
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* In Stock */}
                            <div className="mb-4">
                                <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                        inStock
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {inStock ? "In Stock" : "Out of Stock"}
                                </span>
                            </div>

                            {/* Quantity + Actions */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-xs font-semibold">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                {isInCart ? (
                                    <Link
                                        href="/cart"
                                        className="h-9 px-4 rounded text-sm bg-primary text-white font-semibold hover:opacity-90 flex items-center justify-center transition"
                                    >
                                        Go to Cart
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        disabled={!inStock}
                                        className="h-9 px-4 rounded text-sm bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Add To Cart
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    disabled={!inStock}
                                    className="h-9 px-4 rounded text-sm bg-amber-400 text-gray-900 font-semibold hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleWishlist}
                                    className="w-9 h-9 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                                    aria-label="Add to wishlist"
                                >
                                    <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                                </button>
                            </div>

                            {/* SKU */}
                            {sku && (
                                <p className="text-xs text-gray-600 mb-1">
                                    <span className="font-semibold">SKU:</span> {sku}
                                </p>
                            )}

                            {/* Tags */}
                            <p className="text-xs text-gray-600 mb-4">
                                <span className="font-semibold">Tags:</span>{" "}
                                {[product.category, product.brand].filter(Boolean).join(", ") ||
                                    "N/A"}
                            </p>

                            {/* Share */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-700">Share:</span>
                                <a
                                    href="#"
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition"
                                    aria-label="Pinterest"
                                >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.436-2.875-2.436-4.627 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.233 7.464-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-700 hover:text-white transition"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>

                            {/* Shipping & returns */}
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Truck className="w-4 h-4 text-primary shrink-0" />
                                    <span>Free shipping on orders over ₹150</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <RotateCcw className="w-4 h-4 text-primary shrink-0" />
                                    <span>30-Day Easy Returns</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                                    <span>Secure Checkout Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <section className="py-20 bg-gray-50/50">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-primary">
                                    Similar Products
                                </h2>
                                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold mt-2">
                                    More items you might love
                                </p>
                            </div>
                            <Link 
                                href="/shop" 
                                className="text-[10px] uppercase tracking-widest font-black border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
                            {similarProducts.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
