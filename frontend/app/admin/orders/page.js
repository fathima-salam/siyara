"use client";

import { useState, useEffect } from "react";
import { adminOrderService } from "@/api";
import { Package, Truck, Search, ExternalLink, CheckCircle2, Clock, RotateCcw, ChevronDown, CheckSquare, Square, MoreVertical, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { toast } from "react-hot-toast";

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
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const params = statusFilter !== "all" && ORDER_STATUSES.includes(statusFilter) ? { status: statusFilter } : {};
      const data = await adminOrderService.getAll(params);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      setOrders([]);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    setSelectedOrders([]);
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await adminOrderService.updateStatus(id, status);
      toast.success(`Order updated to ${status}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleBulkUpdate = async (status) => {
    if (selectedOrders.length === 0) return;
    setIsBulkLoading(true);
    try {
      await adminOrderService.bulkUpdateStatus(selectedOrders, status);
      toast.success(`Updated ${selectedOrders.length} orders to ${status}`);
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.error("Bulk update error:", error);
      toast.error("Failed to update orders in bulk");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleReturn = async (id, action) => {
    try {
      await adminOrderService.handleReturn(id, action);
      toast.success(`Return ${action}ed`);
      fetchOrders();
    } catch (error) {
      console.error("Error handling return:", error);
      toast.error("Failed to process return");
    }
  };

  const toggleSelectOrder = (id) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o._id));
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
    <main className="min-h-screen pb-20">
      <section className="pb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <nav className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Admin</nav>
              <h1 className="text-2xl font-black uppercase tracking-tight text-primary">Order Management</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                {filteredOrders.length} orders total
              </p>
            </div>
          </div>

          <div className="bg-white shadow-sm overflow-hidden border border-gray-100">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by customer name or Order ID..."
                    className="w-full bg-white border border-gray-200 pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="text-[10px] uppercase font-bold tracking-wider bg-white border border-gray-200 px-3 py-2 rounded cursor-pointer focus:ring-1 focus:ring-primary"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Filter by Status</option>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Bulk Actions Menu */}
              <AnimatePresence>
                {selectedOrders.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex justify-between items-center bg-primary text-white px-4 py-2 rounded-lg gap-4 shadow-lg"
                  >
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                      {selectedOrders.length} Selected
                    </span>
                    <div className="h-4 w-[1px] bg-white/20" />
                    <div className="flex gap-2">
                      <select 
                        disabled={isBulkLoading}
                        onChange={(e) => handleBulkUpdate(e.target.value)}
                        className="bg-white/10 text-[9px] uppercase font-bold border-none py-1 pl-2 pr-6 rounded focus:ring-0 cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled className="text-black">Bulk Status Update</option>
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s} className="text-black">{s}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <button onClick={toggleSelectAll} className="text-gray-400 hover:text-primary">
                        {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 ? (
                           <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                           <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-black text-gray-500">Order & Products</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-black text-gray-500">Customer</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-black text-gray-500">Payment</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-black text-gray-500">Total</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-black text-gray-500">Status</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-black text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order) => {
                      const firstItem = order.items?.[0];
                      const product = firstItem?.productId;
                      const thumbnail = product?.thumbnails?.[0] || product?.variants?.[0]?.images?.[0] || "/placeholder.png";
                      
                      return (
                        <motion.tr
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={order._id}
                          className={`hover:bg-gray-50/50 transition-colors group ${selectedOrders.includes(order._id) ? "bg-primary/5" : ""}`}
                        >
                          <td className="px-4 py-4">
                            <button onClick={() => toggleSelectOrder(order._id)} className="text-gray-400 hover:text-primary transition-colors">
                              {selectedOrders.includes(order._id) ? (
                                <CheckSquare className="w-4 h-4 text-primary" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden border border-gray-100 flex-shrink-0">
                                <SafeImage 
                                  src={thumbnail} 
                                  alt="Product" 
                                  fill 
                                  className="object-cover"
                                />
                                {order.items?.length > 1 && (
                                  <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 font-bold">
                                    +{order.items.length - 1}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] font-mono text-gray-400 leading-none mb-1">#{order._id?.toString().slice(-8).toUpperCase()}</div>
                                <div className="text-[11px] font-bold text-primary truncate max-w-[180px]">
                                  {product?.productName || "Order Item"}
                                </div>
                                <div className="text-[9px] text-gray-400 font-medium">
                                  {order.items?.reduce((acc, i) => acc + i.quantity, 0)} items • {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{customerName(order)}</span>
                              <span className="text-[9px] text-gray-400">{order.customerId?.phone || "No phone"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{order.transactionDetails?.paymentMethod || "COD"}</span>
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full inline-block w-fit ${
                                order.transactionDetails?.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {order.transactionDetails?.paymentStatus || "pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-[12px] font-black text-primary">₹{Number(order.finalPrice ?? order.total ?? 0).toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit ${
                                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                                    order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                    'bg-blue-50 text-blue-700'
                                }`}>
                                    {order.status || "order placed"}
                                </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2 items-center">
                              {order.status === "return requested" ? (
                                <div className="flex gap-1">
                                  <button onClick={() => handleReturn(order._id, "approve")} className="px-2 py-1 bg-emerald-600 text-white text-[8px] font-bold uppercase tracking-wider hover:bg-emerald-700">Approve</button>
                                  <button onClick={() => handleReturn(order._id, "reject")} className="px-2 py-1 bg-gray-500 text-white text-[8px] font-bold uppercase tracking-wider hover:bg-gray-600">Reject</button>
                                </div>
                              ) : (
                                <div className="relative group/select">
                                  <select
                                    className="text-[9px] uppercase font-bold border border-gray-200 rounded px-2 py-1 bg-transparent hover:border-primary cursor-pointer appearance-none pr-6"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                  >
                                    {ORDER_STATUSES.map((s) => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                </div>
                              )}
                              <Link href={`/admin/orders/${order._id}`} className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-100" title="View details">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="py-20 text-center border-t border-gray-50">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Package className="w-8 h-8 text-gray-200" />
                   </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">No orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
