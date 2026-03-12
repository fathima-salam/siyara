"use client";

import { useState, useEffect } from "react";
import { adminOrderService } from "@/api";
import {
    TrendingUp,
    ShoppingBag,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    ChevronRight,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminDashboardPage() {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminOrderService.getStats();
                setStatsData(data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const dashboardStats = [
        {
            label: "Total Revenue",
            value: statsData ? `$${statsData.totalRevenue}` : "$0.00",
            icon: DollarSign,
            trend: statsData?.trends?.revenue || "+0%",
            positive: true
        },
        {
            label: "Total Orders",
            value: statsData ? statsData.totalOrders.toString() : "0",
            icon: ShoppingBag,
            trend: statsData?.trends?.orders || "+0%",
            positive: true
        },
        {
            label: "Total Customers",
            value: statsData ? statsData.totalCustomers.toString() : "0",
            icon: Users,
            trend: statsData?.trends?.customers || "+0%",
            positive: true
        },
        {
            label: "Avg. Order Value",
            value: statsData ? `$${statsData.avgOrderValue}` : "$0.00",
            icon: TrendingUp,
            trend: statsData?.trends?.avgValue || "+0%",
            positive: true
        },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
    );

    return (
        <main className="min-h-screen">
            <section className="pb-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-6">
                        <nav className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Admin</nav>
                        <h1 className="text-xl font-bold uppercase tracking-tight text-primary">Overview</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Metrics</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                        {dashboardStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-[0.04]">
                                    <stat.icon size={40} />
                                </div>
                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <div className="p-2 bg-secondary border border-gray-100">
                                        <stat.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className={`flex items-center text-[9px] font-bold uppercase tracking-wider ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {stat.trend}
                                        {stat.positive ? <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 ml-0.5" />}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold mb-0.5 relative z-10">{stat.value}</h3>
                                <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 relative z-10">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-5 border border-gray-100 shadow-sm">
                                <h3 className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-4 pb-2 border-b border-gray-100">Modules</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Link href="/admin/products" className="group p-4 border border-gray-100 hover:border-accent transition-all bg-secondary/30 flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white flex items-center justify-center border border-gray-100 group-hover:border-accent transition-colors shrink-0">
                                            <Package className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">Products</h4>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate">Catalog</p>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent ml-auto shrink-0" />
                                    </Link>
                                    <Link href="/admin/orders" className="group p-4 border border-gray-100 hover:border-accent transition-all bg-secondary/30 flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white flex items-center justify-center border border-gray-100 group-hover:border-accent transition-colors shrink-0">
                                            <ShoppingBag className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">Orders</h4>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate">Fulfillment</p>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent ml-auto shrink-0" />
                                    </Link>
                                    <Link href="/admin/users" className="group p-4 border border-gray-100 hover:border-accent transition-all bg-secondary/30 flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white flex items-center justify-center border border-gray-100 group-hover:border-accent transition-colors shrink-0">
                                            <Users className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">Users</h4>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate">Accounts</p>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-accent ml-auto shrink-0" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-white p-5 border border-gray-100 shadow-sm h-full">
                                <h3 className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-4 pb-2 border-b border-gray-100">Status</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight">API</p>
                                            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight">DB</p>
                                            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Connected</p>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight">Stripe</p>
                                            <p className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Sandbox</p>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    </div>
                                </div>
                                <div className="mt-6 p-3 bg-secondary/50 border border-gray-100">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Version</p>
                                    <p className="text-[10px] font-mono">v1.2</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

