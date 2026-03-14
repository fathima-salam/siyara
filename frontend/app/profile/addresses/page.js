"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AddressesPage() {
    const { userInfo } = useAuthStore();
    const [addresses, setAddresses] = useState([
        { id: 1, type: "Default", address: userInfo?.address || "No address saved", isDefault: true }
    ]);

    return (
        <DashboardLayout title="Saved Addresses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {addresses.map((addr) => (
                    <div key={addr.id} className={`bg-white p-8 border ${addr.isDefault ? 'border-accent shadow-md' : 'border-gray-100 shadow-sm'} relative group`}>
                        {addr.isDefault && (
                            <div className="absolute top-0 right-0 bg-accent text-white text-[8px] font-black uppercase tracking-tighter px-3 py-1">
                                Default
                            </div>
                        )}
                        <div className="flex items-center space-x-3 text-primary mb-6">
                            <MapPin className={`w-4 h-4 ${addr.isDefault ? 'text-accent' : 'text-gray-400'}`} />
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black">{addr.type} Address</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-8 italic min-h-[60px]">
                            "{addr.address}"
                        </p>
                        <div className="flex items-center space-x-6 pt-6 border-t border-gray-50">
                            <button className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-primary transition-colors">
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                            </button>
                            {!addr.isDefault && (
                                <button className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-black text-red-400 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add New Address Card */}
                <button className="border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-gray-300 hover:border-accent hover:text-accent transition-all group min-h-[220px]">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black">Add New Address</span>
                </button>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 p-6 flex items-start space-x-4">
                <div className="bg-amber-100 p-2 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-amber-800 mb-1">Shipping Tip</h4>
                    <p className="text-[11px] text-amber-700 leading-relaxed">Ensure your default address is up to date for the fastest checkout experience.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
