"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { adminOrderService } from "@/api";
import { 
  ArrowLeft, Package, User, DollarSign, Truck, Calendar, 
  ChevronDown, CheckCircle2, Clock, MapPin, Phone, Mail, 
  CreditCard, Tag, ExternalLink
} from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { toast } from "react-hot-toast";

const ORDER_STATUSES = [
  "order placed", "shipped", "out for delivery", 
  "delivered", "return requested", "returned", "cancelled"
];

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
        toast.error("Failed to load order");
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
      toast.success(`Order set to ${newStatus}`);
    } catch (e) {
      console.error(e);
      toast.error("Status update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleReturn = async (action) => {
    if (!order) return;
    setUpdating(true);
    try {
      await adminOrderService.handleReturn(order._id, action);
      const newStatus = action === "approve" ? "returned" : "delivered";
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Return ${action}ed`);
    } catch (e) {
      console.error(e);
      toast.error("Return processing failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );

  if (!order) return (
    <main className="h-screen p-10 flex flex-col items-center justify-center bg-gray-50">
      <Package className="w-12 h-12 text-gray-200 mb-4" />
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order Not Found</p>
      <Link href="/admin/orders" className="mt-6 text-xs font-black text-primary border-b border-primary uppercase pb-1">Return to Archive</Link>
    </main>
  );

  const customer = order.customerId || {};
  const items = order.items || [];
  const address = customer.addresses?.[0] || {};

  return (
    <main className="h-[calc(100vh-48px)] lg:h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-gray-50/30">
      {/* Action Header */}
      <header className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-50 rounded-full transition-colors group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-tighter">Reference</span>
              <span className="text-[10px] font-black text-primary uppercase">#{order._id.slice(-10).toUpperCase()}</span>
            </div>
            <h1 className="text-lg font-black text-primary leading-tight">Order Lifecycle</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {order.status === "return requested" ? (
            <div className="flex gap-2">
              <button onClick={() => handleReturn("approve")} disabled={updating} className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-emerald-700 shadow-md transition-all">Approve Return</button>
              <button onClick={() => handleReturn("reject")} disabled={updating} className="px-4 py-2 bg-gray-500 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-gray-600 shadow-md transition-all">Reject Request</button>
            </div>
          ) : (
            <div className="relative">
              <select
                className="bg-primary text-white text-[10px] font-black uppercase pl-4 pr-10 py-2.5 rounded-lg cursor-pointer appearance-none focus:ring-2 focus:ring-primary/20 shadow-lg"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
              >
                {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-white text-primary">{s}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70" />
            </div>
          )}
        </div>
      </header>

      {/* Main Container - Three Column Grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-12 gap-1 p-1 h-full">
        
        {/* Column 1: Identity & Logistics */}
        <aside className="col-span-3 h-full overflow-y-auto custom-scrollbar space-y-1">
          <section className="bg-white p-6 rounded-lg border border-gray-100 flex flex-col gap-6">
            <div>
               <h3 className="text-[10px] uppercase font-black text-gray-400 mb-4 flex items-center gap-2">
                 <User className="w-3.5 h-3.5" /> Customer Identity
               </h3>
               <div className="space-y-1">
                  <p className="text-lg font-black text-primary leading-tight">{customer.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-2 pt-1">
                    <Mail className="w-3 h-3" /> {customer.email || "—"}
                  </p>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                    <Phone className="w-3 h-3" /> {customer.phone || "—"}
                  </p>
               </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
               <h3 className="text-[10px] uppercase font-black text-gray-400 mb-4 flex items-center gap-2">
                 <MapPin className="w-3.5 h-3.5" /> Logistical Destination
               </h3>
               <div className="text-[11px] text-primary/80 leading-relaxed font-bold uppercase tracking-tight">
                  {address.street ? (
                    <>
                      <p>{address.street}, {address.city}</p>
                      <p>{address.state}, {address.zipCode}</p>
                      <p className="text-primary font-black pt-1">{address.country}</p>
                    </>
                  ) : (
                    <p className="text-gray-300">No delivery address specified</p>
                  )}
               </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
               <h3 className="text-[10px] uppercase font-black text-gray-400 mb-4 flex items-center gap-2">
                 <Truck className="w-3.5 h-3.5" /> Shipping Profile
               </h3>
               <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 uppercase">Method</span>
                    <span className="text-primary uppercase">{order.shippingMethod || "Standard Ground"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 uppercase">Est. Delivery</span>
                    <span className="text-primary uppercase">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "Pending"}</span>
                  </div>
               </div>
            </div>
          </section>
        </aside>

        {/* Column 2: Manifest Content (Scrollable) */}
        <div className="col-span-6 h-full flex flex-col bg-white border border-gray-100 rounded-lg overflow-hidden relative">
          <div className="shrink-0 p-5 border-b border-gray-50 flex justify-between items-center z-10 bg-white/80 backdrop-blur-md">
             <h3 className="text-[10px] uppercase font-black text-gray-400 flex items-center gap-2">
               <Package className="w-4 h-4" /> Manifest Content ({items.length} units)
             </h3>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase text-primary">Live Data</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
             {items.map((item, i) => {
               const product = item.productId;
               const thumbnail = product?.thumbnails?.[0] || product?.variants?.[0]?.images?.[0];
               return (
                 <div key={i} className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all group border border-transparent hover:border-gray-100">
                   <div className="relative w-20 h-20 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                     <SafeImage src={thumbnail} fill className="object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start">
                        <p className="text-sm font-black text-primary truncate pr-4">{product?.productName || "Product Reference"}</p>
                        <span className="text-[10px] font-black text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity uppercase">Detailed manifest</span>
                     </div>
                     <p className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest mt-0.5">ID: {product?.productId || item.productId?.toString().slice(-8)}</p>
                     
                     <div className="flex gap-4 items-center mt-3">
                        <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2 py-0.5 rounded shadow-sm">
                           <div className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.color }} />
                           <span className="text-[9px] font-black uppercase text-gray-500">{item.color}</span>
                        </div>
                        {item.size && (
                           <div className="bg-gray-900 text-white px-2 py-0.5 rounded shadow-sm">
                              <span className="text-[9px] font-black uppercase tracking-tighter">Size: {item.size}</span>
                           </div>
                        )}
                        <div className="text-[9px] font-black uppercase text-gray-400 flex items-center gap-1">
                           <span>Qty:</span>
                           <span className="text-primary">{item.quantity}</span>
                        </div>
                     </div>
                   </div>
                   <div className="text-right flex flex-col justify-center">
                     <p className="text-md font-black text-primary leading-none mb-1">₹{Number(item.price).toLocaleString()}</p>
                     <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Base / unit</p>
                   </div>
                 </div>
               );
             })}
          </div>
        </div>

        {/* Column 3: Financial Summary & Timeline */}
        <aside className="col-span-3 h-full overflow-y-auto custom-scrollbar space-y-1">
          <section className="bg-white p-6 rounded-lg border border-gray-100 space-y-6">
            <div>
               <h3 className="text-[10px] uppercase font-black text-gray-400 mb-4 flex items-center gap-2">
                 <CreditCard className="w-3.5 h-3.5" /> Settlement Summary
               </h3>
               
               <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20 text-white relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                  <p className="text-[9px] uppercase font-black text-white/60 mb-1 tracking-widest">Total Collected</p>
                  <p className="text-3xl font-black tracking-tight">₹{Number(order.finalPrice).toLocaleString()}</p>
                  
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-white/50" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{order.transactionDetails?.paymentMethod || "COD"}</span>
                     </div>
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border border-white/20 ${order.transactionDetails?.paymentStatus === 'paid' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {order.transactionDetails?.paymentStatus || "UNPAID"}
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-3 pt-2">
               <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-gray-400 uppercase">Market Total</span>
                  <span className="text-primary font-black">₹{Number(order.total).toLocaleString()}</span>
               </div>
               {order.discount > 0 && (
                  <div className="flex justify-between items-center text-[10px] font-bold text-red-500">
                    <span className="uppercase">Offer Applied</span>
                    <span className="font-black">-₹{Number(order.discount).toLocaleString()}</span>
                  </div>
               )}
               {order.deliveryAmount > 0 && (
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 uppercase">Delivery Fee</span>
                    <span className="text-primary font-black">₹{Number(order.deliveryAmount).toLocaleString()}</span>
                  </div>
               )}
            </div>

            <div className="pt-6 border-t border-gray-50">
               <h3 className="text-[10px] uppercase font-black text-gray-400 mb-4 flex items-center gap-2">
                 <Calendar className="w-3.5 h-3.5" /> Order Timeline
               </h3>
               <div className="space-y-4">
                  <div className="flex gap-3 relative before:absolute before:left-[7px] before:top-[18px] before:bottom-[-10px] before:w-[2px] before:bg-gray-100 last:before:hidden">
                     <div className="w-4 h-4 rounded-full bg-primary shrink-0 z-10 border-2 border-white shadow-sm" />
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-primary uppercase leading-tight">Order Created</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(order.createdAt).toLocaleString()}</p>
                     </div>
                  </div>
                  {order.deliveryDate && (
                    <div className="flex gap-3">
                       <div className="w-4 h-4 rounded-full bg-gray-200 shrink-0 border-2 border-white shadow-xs" />
                       <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase leading-tight">Expected Fullfillment</p>
                          <p className="text-[9px] text-gray-300 font-bold uppercase">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </section>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>
    </main>
  );
}
