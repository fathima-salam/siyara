"use client";

import { useState, useEffect } from "react";
import { orderService, authService } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import { User, ShoppingBag, Settings, LogOut, ChevronRight, Package, CreditCard, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { userInfo, setUserInfo, logout } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders");
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const router = useRouter();

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        name: userInfo?.name || "",
        email: userInfo?.email || "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (!userInfo) {
            router.push("/login");
            return;
        }

        const fetchMyOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching my orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, [userInfo, router]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (profileForm.password !== profileForm.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        setUpdating(true);
        try {
            const data = await authService.updateProfile({
                name: profileForm.name,
                email: profileForm.email,
                password: profileForm.password
            });
            setUserInfo(data);
            setMessage({ type: "success", text: "Profile updated successfully" });
            setProfileForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Error updating profile"
            });
        } finally {
            setUpdating(false);
        }
    };

    if (!userInfo) return null;

    return (
        <main className="min-h-screen bg-[#fcfcfc]">
            <Header />

            <section className="pt-40 pb-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white p-8 border border-gray-100 shadow-sm text-center">
                                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <User className="w-10 h-10 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-widest mb-1">{userInfo.name}</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">{userInfo.email}</p>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700 transition-colors w-full pt-6 border-t border-gray-100"
                                >
                                    <LogOut className="w-3 h-3" />
                                    <span>Sign Out</span>
                                </button>
                            </div>

                            <nav className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`w-full flex items-center justify-between p-6 border-b border-gray-100 transition-all ${activeTab === "orders" ? "bg-gray-50/50" : "hover:bg-gray-50"}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <ShoppingBag className={`w-4 h-4 ${activeTab === "orders" ? "text-primary" : "text-gray-400"}`} />
                                        <span className={`text-[10px] uppercase tracking-widest font-bold ${activeTab === "orders" ? "text-primary" : "text-gray-400"}`}>My Orders</span>
                                    </div>
                                    <ChevronRight className={`w-3 h-3 ${activeTab === "orders" ? "text-primary" : "text-gray-400"}`} />
                                </button>
                                <button
                                    onClick={() => setActiveTab("settings")}
                                    className={`w-full flex items-center justify-between p-6 transition-all ${activeTab === "settings" ? "bg-gray-50/50" : "hover:bg-gray-50"}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-primary" : "text-gray-400"}`} />
                                        <span className={`text-[10px] uppercase tracking-widest font-bold ${activeTab === "settings" ? "text-primary" : "text-gray-400"}`}>Account Settings</span>
                                    </div>
                                    <ChevronRight className={`w-3 h-3 ${activeTab === "settings" ? "text-primary" : "text-gray-400"}`} />
                                </button>
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-3">
                            <h1 className="text-3xl font-bold uppercase tracking-tight mb-10">
                                {activeTab === "orders" ? "Purchase History" : "Account Settings"}
                            </h1>

                            {activeTab === "orders" ? (
                                loading ? (
                                    <div className="py-20 flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="bg-white p-20 text-center border border-gray-100">
                                        <Package className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                                        <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mb-8">You haven't placed any orders yet.</p>
                                        <Link href="/shop" className="btn-primary">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => {
                                            const orderItems = order.orderItems ?? (order.items ?? []).map((it) => ({
                                                name: it.productId?.productName ?? it.productId?.product ?? "Product",
                                                image: it.productId?.thumbnails?.[0] ?? it.productId?.variants?.[0]?.images?.[0],
                                            }));
                                            const orderTotal = order.totalPrice ?? order.finalPrice ?? 0;
                                            const orderDate = order.createdAt ?? order.orderDate;
                                            const isPaid = order.isPaid ?? order.transactionDetails?.paymentStatus === "paid";
                                            return (
                                            <motion.div
                                                key={order._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-accent transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-4">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">#{order._id?.slice(-8) ?? ""}</span>
                                                        <span className="text-[10px] uppercase font-bold text-gray-300">•</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{orderDate ? new Date(orderDate).toLocaleDateString() : ""}</span>
                                                    </div>
                                                    <div className="flex -space-x-3 mb-4 overflow-hidden">
                                                        {(orderItems ?? []).slice(0, 3).map((item, idx) => (
                                                            <div key={idx} className="relative w-12 h-16 border-2 border-white bg-gray-100 overflow-hidden">
                                                                <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                                                            </div>
                                                        ))}
                                                        {(orderItems ?? []).length > 3 && (
                                                            <div className="w-12 h-16 border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                                +{(orderItems ?? []).length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 truncate max-w-sm">
                                                        {(orderItems ?? []).map((item) => item.name).join(", ")}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                                                    <div className="text-lg font-bold uppercase tracking-tight">₹{Number(orderTotal).toFixed(2)}</div>
                                                    <div className="flex items-center space-x-4">
                                                        {isPaid ? (
                                                            <div className="flex items-center space-x-1 text-emerald-600">
                                                                <CheckCircle className="w-3 h-3" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">Paid</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center space-x-1 text-amber-500">
                                                                <Clock className="w-3 h-3" />
                                                                <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
                                                            </div>
                                                        )}
                                                        <Link
                                                            href={`/order/${order._id}`}
                                                            className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary hover:text-accent hover:border-accent transition-all pb-1"
                                                        >
                                                            View Order Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            );
                                        })}
                                    </div>
                                )
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white p-8 border border-gray-100 shadow-sm max-w-2xl"
                                >
                                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                                        {message.text && (
                                            <div className={`p-4 text-[10px] font-bold uppercase tracking-widest border ${message.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                                                {message.text}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-100 p-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="w-full border border-gray-100 p-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                                    value={profileForm.email}
                                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">New Password (Leave blank to keep current)</label>
                                                <input
                                                    type="password"
                                                    className="w-full border border-gray-100 p-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                                    value={profileForm.password}
                                                    onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full border border-gray-100 p-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                                    value={profileForm.confirmPassword}
                                                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={updating}
                                            className="btn-primary w-full py-4 text-[10px] uppercase font-bold tracking-[0.2em] flex items-center justify-center space-x-2"
                                        >
                                            {updating ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <span>Update Profile</span>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
