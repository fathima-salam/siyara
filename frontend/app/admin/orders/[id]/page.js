"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminOrderService } from "@/api";
import { ArrowLeft, Package, User, DollarSign, Truck } from "lucide-react";

const ORDER_STATUSES = ["order placed", "shipped", "out for delivery", "delivered", "return requested", "returned", "cancelled"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await adminOrderService.getById(params.id);
        setOrder(data);
      } catch (e) {
        console.error(e);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchOrder();
  }, [params.id]);

  const handleStatusChange = async (newStatus) => {
    if (!order || !ORDER_STATUSES.includes(newStatus)) return;
    setUpdating(true);
    try {
      await adminOrderService.updateStatus(order._id, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleReturn = async (action) => {
    if (!order) return;
    setUpdating(true);
    try {
      await adminOrderService.handleReturn(order._id, action);
      setOrder((prev) => (prev ? { ...prev, status: action === "approve" ? "returned" : "delivered" } : null));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen p-6">
        <p className="text-sm text-gray-500">Order not found.</p>
        <Link href="/admin/orders" className="text-primary font-bold text-sm mt-4 inline-block">← Back to Orders</Link>
      </main>
    );
  }

  const customer = order.customerId || {};
  const items = order.items || [];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-4xl p-6">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-primary mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>

        <div className="mb-6">
          <nav className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Admin / Orders</nav>
          <h1 className="text-xl font-bold uppercase tracking-tight text-primary">Order #{order._id?.toString().slice(-8)}</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-lg p-6">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Customer</h2>
            <p className="text-sm font-bold">{customer.name || "—"}</p>
            <p className="text-xs text-gray-500">{customer.email || "—"}</p>
            {customer.phone && <p className="text-xs text-gray-500">{customer.phone}</p>}
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-6">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-4 flex items-center gap-2"><Package className="w-4 h-4" /> Order details</h2>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-500">Status</dt>
              <dd>
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-xs"
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </dd>
              <dt className="text-gray-500">Order date</dt>
              <dd>{order.orderDate ? new Date(order.orderDate).toLocaleString() : "—"}</dd>
              <dt className="text-gray-500">Shipping method</dt>
              <dd>{order.shippingMethod || "—"}</dd>
              <dt className="text-gray-500">Delivery date</dt>
              <dd>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : "—"}</dd>
            </dl>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Items</h3>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex justify-between text-xs">
                    <span>Product ref: {item.productId?.toString?.()?.slice(-8) || "—"} · {item.color} × {item.quantity}</span>
                    <span>${Number(item.price || 0).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] uppercase text-gray-500">Total</span>
              <span className="font-bold">${Number(order.total ?? 0).toFixed(2)}</span>
              {order.discount > 0 && <span className="text-gray-500 text-xs">Discount: ${order.discount}</span>}
              <span className="text-[10px] uppercase text-gray-500 ml-2">Final</span>
              <span className="font-bold">${Number(order.finalPrice ?? 0).toFixed(2)}</span>
            </div>

            {order.status === "return requested" && (
              <div className="mt-4 flex gap-2">
                <button onClick={() => handleReturn("approve")} disabled={updating} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase rounded hover:bg-emerald-700">Approve return</button>
                <button onClick={() => handleReturn("reject")} disabled={updating} className="px-4 py-2 bg-gray-500 text-white text-xs font-bold uppercase rounded hover:bg-gray-600">Reject</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
