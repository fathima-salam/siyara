"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Bell, Shield, Tag, Package, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPage() {
    const notifications = [
        { 
            id: 1, 
            type: "order", 
            title: "Order Shipped!", 
            desc: "Your order #8F2A01 has been handed over to our delivery partner.", 
            time: "2 hours ago",
            icon: Package,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        { 
            id: 2, 
            type: "promo", 
            title: "New Collection Live", 
            desc: "Discover our latest Premium Silk collection. limited stock available.", 
            time: "5 hours ago",
            icon: Tag,
            color: "text-accent",
            bg: "bg-accent/10"
        },
        { 
            id: 3, 
            type: "security", 
            title: "Password Changed", 
            desc: "The password for your Siyara account was recently updated.", 
            time: "1 day ago",
            icon: Shield,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        }
    ];

    return (
        <DashboardLayout title="Notifications">
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">Recent Alerts</p>
                    <button className="text-[9px] uppercase tracking-widest font-black text-accent hover:underline">Mark all as read</button>
                </div>
                
                <div className="divide-y divide-gray-50">
                    {notifications.map((notif, idx) => (
                        <motion.div 
                            key={notif.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 md:p-8 flex items-start space-x-6 hover:bg-gray-50 transition-colors group cursor-pointer"
                        >
                            <div className={`w-12 h-12 flex-shrink-0 ${notif.bg} ${notif.color} rounded-full flex items-center justify-center`}>
                                <notif.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">{notif.title}</h3>
                                    <span className="text-[9px] font-bold text-gray-300 uppercase shrink-0">{notif.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed mb-4">{notif.desc}</p>
                                <button className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center group-hover:translate-x-1 transition-transform">
                                    View Details <ChevronRight className="w-3 h-3 ml-1" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            <div className="mt-8 p-6 text-center border border-gray-100 bg-white">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">You're all caught up!</p>
            </div>
        </DashboardLayout>
    );
}
