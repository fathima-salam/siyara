"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
    Package, 
    ChevronRight,
    Clock,
    CheckCircle,
    XCircle,
    Truck
} from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

const STATUS_ICONS = {
    "Pending": { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    "Processing": { icon: Truck, color: "text-blue-500", bg: "bg-blue-50" },
    "Shipped": { icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
    "Delivered": { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    "Cancelled": { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <DashboardLayout title="My Orders">
            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white p-20 text-center border border-gray-100 shadow-sm">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                    <p className="text-gray-500 uppercase tracking-widest font-bold text-xs mb-8">You haven't placed any orders yet.</p>
                    <Link href="/shop" className="btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const status = order.orderStatus || "Pending";
                        const StatusIcon = STATUS_ICONS[status]?.icon || Clock;
                        const statusColor = STATUS_ICONS[status]?.color || "text-gray-400";
                        const statusBg = STATUS_ICONS[status]?.bg || "bg-gray-50";

                        return (
                            <div 
                                key={order._id}
                                className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm hover:border-accent transition-all group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-secondary px-2 py-1">
                                                Order #{order._id?.slice(-8)}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            {(order.orderItems || []).slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="relative w-12 h-16 bg-gray-50 border border-gray-50">
                                                    <SafeImage src={item.image} alt="product" fill className="object-cover" />
                                                </div>
                                            ))}
                                            {(order.orderItems || []).length > 4 && (
                                                <div className="w-12 h-16 bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-50">
                                                    +{(order.orderItems || []).length - 4}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold truncate max-w-sm">
                                            {(order.orderItems || []).map(i => i.name).join(", ")}
                                        </p>
                                    </div>

                                    <div className="flex flex-col md:items-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                                        <div className="text-xl font-black uppercase tracking-tight text-primary">
                                            ₹{order.totalPrice?.toFixed(2)}
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex items-center space-x-1.5 px-3 py-1 ${statusBg} ${statusColor} rounded-full`}>
                                                <StatusIcon className="w-3 h-3" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
                                            </div>
                                            
                                            <Link 
                                                href={`/profile/orders/${order._id}`}
                                                className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-accent transition-all pb-1 hover:border-primary"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}
