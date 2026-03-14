"use client";

import { useState, useEffect, use } from "react";
import { orderService } from "@/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Clock, Truck, MapPin, CreditCard, ChevronLeft, Banknote, Smartphone } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function resolveImageUrl(url) {
    if (!url || typeof url !== "string") return url;
    const u = url.trim();
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    const base = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:5001/api";
    return base.replace(/\/api\/?$/, "") + (u.startsWith("/") ? u : `/${u}`);
}

export default function OrderPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const searchParams = useSearchParams();
    const paymentSuccess = searchParams.get("payment_success") === "true";

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const data = await orderService.getById(params.id);
            setOrder(data);
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    const paymentMethod = order?.transactionDetails?.paymentMethod || "cod";
    const isCod = paymentMethod === "cod";
    const isRazorpay = paymentMethod === "razorpay";

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen pt-40 text-center">
            <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Order Not Found</h1>
            <Link href="/shop" className="btn-primary">Back to Shop</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#fcfcfc]">
            <Header />

            <section className="pt-40 pb-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <Link href="/shop" className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-primary transition-colors mb-10">
                        <ChevronLeft className="w-4 h-4" />
                        <span>Continue Shopping</span>
                    </Link>

                    {paymentSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-50 border border-emerald-100 p-8 text-center mb-12 shadow-sm"
                        >
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-emerald-900 mb-2">Payment Successful!</h2>
                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Thank you for your purchase. Your order is now being processed.</p>
                        </motion.div>
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">Order Placed</h1>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order ID: #{order._id?.slice(-8)}</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-white px-6 py-3 border border-gray-100 shadow-sm">
                            {order.isPaid ? (
                                <div className="flex items-center space-x-2 text-emerald-600">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Payment Received</span>
                                </div>
                            ) : isCod ? (
                                <div className="flex items-center space-x-2 text-primary">
                                    <Banknote className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Cash on Delivery</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 text-amber-500">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Payment Pending</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Status Timeline */}
                            <div className="bg-white p-8 border border-gray-100 shadow-sm">
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-10 pb-4 border-b border-gray-100 flex items-center space-x-3">
                                    <Truck className="w-5 h-5" />
                                    <span>Delivery Status</span>
                                </h2>
                                <div className="relative flex justify-between items-center px-10">
                                    <div className="absolute left-10 right-10 top-5 h-[2px] bg-gray-100 z-0"></div>
                                    <div className={`absolute left-10 top-5 h-[2px] bg-primary z-0 transition-all duration-1000 ${order.isDelivered ? 'w-[calc(100%-80px)]' : 'w-0'}`}></div>

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mb-4">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Placed</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${order.isPaid ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-400'}`}>
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Paid</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${order.isDelivered ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-400'}`}>
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Delivered</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white p-8 border border-gray-100 shadow-sm">
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-8 pb-4 border-b border-gray-100">Ordered Items</h2>
                                <div className="space-y-8">
                                    {(order.orderItems || []).map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-6">
                                                <div className="relative w-24 h-28 bg-gray-50 overflow-hidden rounded flex-shrink-0">
                                                    <SafeImage src={resolveImageUrl(item.image)} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{item.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.qty} x ₹{Number(item.price).toFixed(2)}</p>
                                                    {(item.color || item.size) && (
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                            {[item.size, item.color].filter(Boolean).join(" · ")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold">₹{((item.qty || 0) * (Number(item.price) || 0)).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar info */}
                        <div className="space-y-8 h-fit lg:sticky lg:top-32">
                            <div className="bg-white p-8 border border-gray-100 shadow-sm">
                                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-6 flex items-center space-x-2">
                                    <MapPin className="w-3 h-3" />
                                    <span>Shipping Address</span>
                                </h3>
                                <div className="text-sm font-bold uppercase tracking-tight mb-2">{order.user.name}</div>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 border border-gray-100 shadow-sm">
                                <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 border-b border-gray-100 pb-4">Payment</h3>
                                <div className="mb-6 flex items-center gap-2">
                                    {isCod ? (
                                        <>
                                            <Banknote className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-bold uppercase tracking-widest">Cash on Delivery</span>
                                        </>
                                    ) : isRazorpay ? (
                                        <>
                                            <Smartphone className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm font-bold uppercase tracking-widest">Razorpay (option)</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-bold uppercase tracking-widest">{paymentMethod}</span>
                                    )}
                                </div>
                                {isCod && (
                                    <p className="text-xs text-gray-500 mb-6">Pay when your order is delivered.</p>
                                )}
                                {isRazorpay && !order.isPaid && (
                                    <p className="text-xs text-gray-500 mb-6">Razorpay payment integration can be added later.</p>
                                )}

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-gray-400 font-normal">Subtotal</span>
                                        <span>₹{(order.itemsPrice ?? order.total).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span className="text-gray-400 font-normal">Shipping</span>
                                        <span>{(order.shippingPrice ?? order.deliveryAmount ?? 0) === 0 ? "FREE" : `₹${(order.shippingPrice ?? order.deliveryAmount).toFixed(2)}`}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-base font-bold uppercase tracking-widest border-t border-gray-100 pt-6">
                                    <span>Total Amount</span>
                                    <span className="text-accent">₹{(order.totalPrice ?? order.finalPrice).toFixed(2)}</span>
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
