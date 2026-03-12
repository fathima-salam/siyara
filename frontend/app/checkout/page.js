"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, Truck, Check, Loader2, Banknote, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { orderService } from "@/api";

const PAYMENT_OPTIONS = [
    { id: "cod", label: "Cash on Delivery", description: "Pay when your order is delivered", icon: Banknote },
    { id: "razorpay", label: "Razorpay", description: "Pay securely with card, UPI, or wallet", icon: Smartphone },
];

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const { cartItems, shippingAddress, saveShippingAddress, paymentMethod, savePaymentMethod, clearCart } = useCartStore();
    const { userInfo } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!userInfo) router.replace("/login?redirect=/checkout");
        if (userInfo && cartItems.length === 0) router.replace("/cart");
    }, [userInfo, router, cartItems.length]);

    const [formData, setFormData] = useState({
        address: shippingAddress.address || "",
        city: shippingAddress.city || "",
        postalCode: shippingAddress.postalCode || "",
        country: shippingAddress.country || "",
    });

    const [loading, setLoading] = useState(false);

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) {
            saveShippingAddress(formData);
        }
        setStep(step + 1);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.qty || 1), 0);
    const shippingPrice = subtotal > 150 ? 0 : 15;
    const totalPrice = subtotal + shippingPrice;

    const handlePlaceOrder = async () => {
        if (!userInfo?.token) {
            router.push("/login?redirect=/checkout");
            return;
        }
        setLoading(true);
        try {
            const orderData = {
                orderItems: cartItems.map((item) => ({
                    name: item.name || item.productName,
                    qty: item.qty || 1,
                    image: item.image || item.thumbnails?.[0] || item.variants?.[0]?.images?.[0],
                    price: Number(item.price) || 0,
                    product: item._id,
                    size: item.size,
                    color: item.color || "",
                })),
                shippingAddress: formData,
                paymentMethod: paymentMethod || "cod",
                shippingPrice: totalPrice - subtotal,
                totalPrice,
            };

            const data = await orderService.create(orderData);
            clearCart();
            router.push(`/order/${data._id}`);
        } catch (error) {
            console.error("Error placing order:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#fcfcfc]">
            <Header />

            <section className="pt-40 pb-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    {/* Progress Bar */}
                    <div className="flex justify-center mb-16">
                        <div className="flex items-center w-full max-w-lg">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase transition-all ${step >= s ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                                        }`}>
                                        {step > s ? <Check className="w-5 h-5" /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`h-[2px] flex-1 mx-2 ${step > s ? "bg-primary" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Main Flow */}
                        <div className="lg:col-span-2">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 flex items-center space-x-3">
                                        <Truck className="w-6 h-6" />
                                        <span>Shipping Address</span>
                                    </h2>
                                    <form onSubmit={handleNext} className="space-y-6 bg-white p-8 shadow-sm">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold">Address</label>
                                            <input
                                                required
                                                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest font-bold">City</label>
                                                <input
                                                    required
                                                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest font-bold">Postal Code</label>
                                                <input
                                                    required
                                                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                                    value={formData.postalCode}
                                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold">Country</label>
                                            <input
                                                required
                                                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary w-full mt-6">Continue to Payment</button>
                                    </form>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 flex items-center space-x-3">
                                        <CreditCard className="w-6 h-6" />
                                        <span>Payment Method</span>
                                    </h2>
                                    <div className="bg-white p-8 shadow-sm space-y-6">
                                        {PAYMENT_OPTIONS.map((opt) => {
                                            const Icon = opt.icon;
                                            const isSelected = paymentMethod === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => savePaymentMethod(opt.id)}
                                                    className={`w-full p-6 border-2 rounded-lg flex items-center justify-between text-left transition-all ${isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-gray-300"}`}>
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <Icon className="w-5 h-5 text-gray-600" />
                                                        <div>
                                                            <span className="text-sm font-bold uppercase tracking-widest block">{opt.label}</span>
                                                            <span className="text-xs text-gray-500">{opt.description}</span>
                                                        </div>
                                                    </div>
                                                    {opt.id === "razorpay" && (
                                                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Option available</span>
                                                    )}
                                                </button>
                                            );
                                        })}

                                        <div className="flex space-x-4 pt-4">
                                            <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                                            <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">Review Order</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                    <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 flex items-center space-x-3">
                                        <ShieldCheck className="w-6 h-6" />
                                        <span>Review & Confirm</span>
                                    </h2>
                                    <div className="bg-white p-8 shadow-sm space-y-10">
                                        <div className="grid md:grid-cols-2 gap-10 border-b border-gray-100 pb-10">
                                            <div>
                                                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Shipping To</h3>
                                                <p className="text-sm font-bold">{userInfo?.name || "Guest"}</p>
                                                <p className="text-sm text-gray-600">{formData.address}, {formData.city}</p>
                                                <p className="text-sm text-gray-600">{formData.postalCode}, {formData.country}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Payment Method</h3>
                                                <p className="text-sm font-bold">
                                                    {paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-6">Order Items</h3>
                                            <div className="space-y-4">
                                                {cartItems.map((item, idx) => (
                                                    <div key={`${item._id}-${item.size ?? ""}-${item.color ?? ""}-${idx}`} className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600 truncate mr-10">{item.qty}x {item.name || item.productName}{item.color ? ` · ${item.color}` : ""}</span>
                                                        <span className="font-bold">₹{(item.price * item.qty).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="btn-primary w-full h-16 text-lg flex items-center justify-center space-x-2"
                                        >
                                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                            <span>{loading ? "Processing..." : paymentMethod === "cod" ? "Place Order" : "Place Order (Razorpay)"}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar Summary */}
                        <div className="h-fit sticky top-32">
                            <div className="bg-white p-8 shadow-sm">
                                <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">In Your Bag</h3>
                                <div className="space-y-4 mb-8">
                                    {cartItems.map((item, index) => (
                                        <div key={`${item._id}-${item.size ?? ""}-${item.color ?? ""}-${index}`} className="flex space-x-4">
                                            <div className="relative w-20 h-24 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                                <SafeImage src={item.image || item.thumbnails?.[0] || item.variants?.[0]?.images?.[0] || item.images?.[0]} alt={item.name || item.productName} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold uppercase truncate">{item.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{item.qty} qty{item.color ? ` · ${item.color}` : ""}</p>
                                                <p className="text-xs font-bold mt-1">₹{(item.price * item.qty).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-6 space-y-4">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold uppercase tracking-widest pt-2">
                                        <span>Total</span>
                                        <span>₹{totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
