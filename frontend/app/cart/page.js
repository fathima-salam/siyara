"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
    const { cartItems, addItem, removeItem } = useCartStore();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = subtotal > 150 ? 0 : 15;
    const total = subtotal + shipping;

    const updateQty = (item, newQty) => {
        if (newQty < 1) return;
        addItem({ ...item, qty: newQty });
    };

    return (
        <main className="min-h-screen">
            <Header />

            <section className="pt-40 pb-20">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-12">Shopping Cart</h1>

                    {cartItems.length === 0 ? (
                        <div className="py-20 text-center border-y border-gray-100">
                            <p className="text-gray-500 mb-8 uppercase tracking-widest font-bold">Your cart is currently empty.</p>
                            <Link href="/shop" className="btn-primary">Return to Shop</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="hidden md:grid grid-cols-6 gap-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 border-b border-gray-100 pb-4">
                                    <div className="col-span-3">Product</div>
                                    <div>Price</div>
                                    <div>Quantity</div>
                                    <div className="text-right">Total</div>
                                </div>

                                {cartItems.map((item) => (
                                    <div key={`${item._id}-${item.size}-${item.color}`} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center border-b border-gray-100 pb-8">
                                        <div className="col-span-3 flex items-center space-x-6">
                                            <div className="relative w-24 h-32 bg-gray-50 flex-shrink-0">
                                                <SafeImage src={item.images?.[0]} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <Link href={`/product/${item._id}`} className="text-sm font-bold uppercase tracking-wider hover:text-accent transition-colors">
                                                    {item.name}
                                                </Link>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                                                    Size: {item.size} | Color: {item.color}
                                                </p>
                                                <button
                                                    onClick={() => removeItem(item._id, item.size, item.color)}
                                                    className="flex items-center space-x-1 text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 font-bold mt-4"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-sm font-medium">
                                            <span className="md:hidden text-[10px] uppercase font-bold text-gray-400 mr-2">Price:</span>
                                            ${item.price.toFixed(2)}
                                        </div>

                                        <div className="flex items-center border border-gray-200 h-10 w-24">
                                            <button
                                                onClick={() => updateQty(item, item.qty - 1)}
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="flex-1 text-center text-xs font-bold">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item, item.qty + 1)}
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className="text-right text-sm font-bold hidden md:block">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="bg-[#f8f8f8] p-8 h-fit">
                                <h2 className="text-xl font-bold uppercase tracking-widest mb-8 pb-4 border-b border-gray-200">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm uppercase tracking-widest font-bold">
                                        <span className="text-gray-400 font-normal">Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm uppercase tracking-widest font-bold">
                                        <span className="text-gray-400 font-normal">Shipping</span>
                                        <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-lg font-bold uppercase tracking-widest border-t border-gray-200 pt-6 mb-10">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <Link href="/checkout" className="btn-primary w-full flex items-center justify-center space-x-3">
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <p className="text-[10px] uppercase tracking-widest text-center text-gray-400 font-bold mt-6">
                                    Complimentary carbon neutral shipping.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
