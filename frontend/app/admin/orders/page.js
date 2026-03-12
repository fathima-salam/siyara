"use client";

import { useState, useEffect } from "react";
import { adminOrderService } from "@/api";
import { Package, Truck, Search, ExternalLink, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ORDER_STATUSES = [
  "order placed",
  "shipped",
  "out for delivery",
  "delivered",
  "return requested",
  "returned",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const params = statusFilter !== "all" && ORDER_STATUSES.includes(statusFilter) ? { status: statusFilter } : {};
      const data = await adminOrderService.getAll(params);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await adminOrderService.updateStatus(id, status);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleReturn = async (id, action) => {
    try {
      await adminOrderService.handleReturn(id, action);
      fetchOrders();
    } catch (error) {
      console.error("Error handling return:", error);
    }
  };

  const customerName = (order) =>
    (order.customerId && (order.customerId.name || order.customerId.email)) || "—";

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const name = (customerName(order) || "").toLowerCase();
    const id = (order._id && String(order._id)) || "";
    return name.includes(search) || id.toLowerCase().includes(search);
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <main className="min-h-screen">
      <section className="pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-4">
            <nav className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Admin</nav>
            <h1 className="text-lg font-bold uppercase tracking-tight text-primary">Orders</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{filteredOrders.length} orders</p>
          </div>

          <div className="bg-white shadow-sm overflow-hidden border border-gray-100">
            <div className="p-3 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-2 bg-secondary/20">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customer or ID..."
                  className="w-full bg-white border border-gray-100 pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="text-[9px] uppercase font-bold tracking-wider bg-transparent border border-gray-100 px-2 py-1.5 rounded cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/30 border-b border-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">ID</th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Customer</th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Date</th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Total</th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Status</th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={order._id}
                        className="hover:bg-secondary/20 transition-colors group"
                      >
                        <td className="px-3 py-2 text-[10px] text-gray-400 font-mono">#{order._id?.toString().slice(-8)}</td>
                        <td className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider">{customerName(order)}</td>
                        <td className="px-3 py-2 text-[10px] text-gray-500">
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-3 py-2 text-[11px] font-bold">₹{Number(order.finalPrice ?? order.total ?? 0).toFixed(2)}</td>
                        <td className="px-3 py-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-600">{order.status || "order placed"}</span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex justify-end gap-1 items-center flex-wrap">
                            {order.status === "return requested" && (
                              <>
                                <button onClick={() => handleReturn(order._id, "approve")} className="px-2 py-1 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-700">Approve return</button>
                                <button onClick={() => handleReturn(order._id, "reject")} className="px-2 py-1 bg-gray-500 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-gray-600">Reject</button>
                              </>
                            )}
                            {order.status !== "delivered" && order.status !== "returned" && order.status !== "cancelled" && (
                              <select
                                className="text-[9px] border border-gray-200 rounded px-2 py-1"
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                              >
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            )}
                            <Link href={`/admin/orders/${order._id}`} className="p-1.5 text-gray-400 hover:text-primary" title="View details"><ExternalLink className="w-3.5 h-3.5" /></Link>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">No orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
