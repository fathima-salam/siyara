"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import SafeImage from "@/components/SafeImage";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

function resolveImageUrl(url) {
    if (!url || typeof url !== "string") return url;
    const u = url.trim();
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    const base = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : "http://127.0.0.1:5000/api";
    return base.replace(/\/api\/?$/, "") + (u.startsWith("/") ? u : `/${u}`);
}

export default function CartDrawer({ isOpen, onClose }) {
    const pathname = usePathname();
    const router = useRouter();
    const { cartItems, addItem, removeItem } = useCartStore();

    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.qty || 1), 0);
    const shipping = subtotal > 150 ? 0 : 15;
    const total = subtotal + shipping;

    const updateQty = (item, newQty) => {
        if (newQty < 1) return;
        addItem({ ...item, qty: newQty });
    };

    const handleClose = () => {
        onClose();
        if (pathname === "/cart") router.push("/shop");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 z-[80]"
                        onClick={handleClose}
                        aria-hidden
                    />
                    {/* Drawer panel */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[81] flex flex-col"
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold uppercase tracking-widest">Your Cart</h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {cartItems.length === 0 ? (
                                <div className="py-16 text-center">
                                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-6">Your cart is empty</p>
                                    <Link
                                        href="/shop"
                                        className="btn-primary inline-flex items-center"
                                        onClick={handleClose}
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <ul className="space-y-6">
                                    {cartItems.map((item) => (
                                        <li
                                            key={`${item._id}-${item.size}-${item.color}`}
                                            className="flex gap-4 pb-6 border-b border-gray-100 last:border-0"
                                        >
                                            <div className="relative w-24 h-28 bg-gray-50 flex-shrink-0 rounded overflow-hidden">
                                                <SafeImage
                                                    src={resolveImageUrl(item.image || item.thumbnails?.[0] || item.variants?.[0]?.images?.[0] || item.images?.[0])}
                                                    alt={item.name || item.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/product/${item._id}`}
                                                    className="text-sm font-bold uppercase tracking-wider hover:text-accent block truncate"
                                                    onClick={handleClose}
                                                >
                                                    {item.name || item.productName}
                                                </Link>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
                                                    {item.size} · {item.color}
                                                </p>
                                                <p className="text-sm font-medium mt-1">₹{(Number(item.price) || 0).toFixed(2)}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center border border-gray-200 rounded h-8 w-20">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQty(item, (item.qty || 1) - 1)}
                                                            className="w-6 h-full flex items-center justify-center hover:bg-gray-50"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="flex-1 text-center text-xs font-bold">{item.qty || 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQty(item, (item.qty || 1) + 1)}
                                                            className="w-6 h-full flex items-center justify-center hover:bg-gray-50"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item._id, item.size, item.color)}
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        aria-label="Remove"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-right">
                                                ₹{((Number(item.price) || 0) * (item.qty || 1)).toFixed(2)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
                                <div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-4">
                                    <span className="text-gray-500">Shipping</span>
                                    <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold uppercase tracking-widest border-t border-gray-200 pt-4 mb-5">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                                    onClick={handleClose}
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
