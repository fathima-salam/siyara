"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard, Plus, Lock, Info, Landmark } from "lucide-react";

export default function PaymentMethodsPage() {
    const paymentMethods = [
        { id: 1, type: "Visa", last4: "4242", expiry: "12/25", isDefault: true, brand: "visa" },
    ];

    return (
        <DashboardLayout title="Payment Methods">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {paymentMethods.map((method) => (
                    <div key={method.id} className="relative overflow-hidden bg-primary p-8 text-white shadow-xl group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Landmark className="w-32 h-32 rotate-12" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <CreditCard className="w-8 h-8 text-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest bg-accent px-2 py-0.5 text-primary">
                                    Default
                                </span>
                            </div>
                            
                            <div className="mb-8">
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2">Card Number</p>
                                <p className="text-xl font-bold tracking-[0.2em]">•••• •••• •••• {method.last4}</p>
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-1">Expiry Date</p>
                                    <p className="text-sm font-bold">{method.expiry}</p>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest underline cursor-pointer hover:text-accent transition-colors">
                                    Remove
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-gray-300 hover:border-accent hover:text-accent transition-all group min-h-[220px]">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black">Link New Card</span>
                </button>
            </div>

            <div className="bg-white p-8 border border-gray-100 shadow-sm flex items-start space-x-6">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-primary mb-2">Secure Payments</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Your payment information is encrypted and securely stored. Siyara does not store full card details on our servers.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
