"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ShieldCheck, Smartphone, Eye, EyeOff, Lock, Laptop, Globe, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <DashboardLayout title="Security Settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Password Change */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-3 text-primary mb-8 border-b border-gray-50 pb-4">
                        <Lock className="w-4 h-4 text-accent" />
                        <h2 className="text-[10px] uppercase tracking-[0.2em] font-black">Change Password</h2>
                    </div>
                    
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Current Password</label>
                            <input 
                                type="password" 
                                className="w-full border border-gray-100 p-4 text-sm focus:outline-none focus:border-accent transition-colors bg-gray-50/30"
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">New Password</label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="w-full border border-gray-100 p-4 text-sm focus:outline-none focus:border-accent transition-colors bg-gray-50/30"
                            />
                            <button 
                                type="button" 
                                className="absolute right-4 bottom-4 p-1 text-gray-300 hover:text-primary transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <button type="submit" className="btn-primary w-full py-4 text-[9px] font-black tracking-[0.2em]">
                            Update Password
                        </button>
                    </form>
                </div>

                {/* Two Factor / Other Security */}
                <div className="space-y-8">
                    <div className="bg-white p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                        <div className="flex items-start justify-between">
                            <div className="flex-1 pr-6">
                                <div className="flex items-center space-x-3 text-primary mb-4">
                                    <Smartphone className="w-4 h-4 text-emerald-500" />
                                    <h2 className="text-[10px] uppercase tracking-[0.2em] font-black">Two-Factor Auth</h2>
                                </div>
                                <p className="text-xs text-gray-400 mb-6 leading-relaxed">Add an extra layer of security to your account by using a phone-based authentication method.</p>
                                <button className="text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100 px-4 py-2 hover:bg-emerald-50 transition-colors">
                                    Enable Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 shadow-sm">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">Login Activity</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {[
                                { device: "MacBook Pro", browser: "Chrome", location: "Mumbai, India", active: true, icon: Laptop },
                                { device: "iPhone 15", browser: "Safari", location: "Mumbai, India", active: false, icon: Smartphone },
                                { device: "Unknown Tablet", browser: "Firefox", location: "London, UK", active: false, icon: Globe },
                            ].map((session, idx) => (
                                <div key={idx} className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                                        <session.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-primary truncate">{session.device} • {session.browser}</p>
                                        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">{session.location}</p>
                                    </div>
                                    {session.active ? (
                                        <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-500 bg-emerald-50 px-2 py-0.5">Active</span>
                                    ) : (
                                        <button className="text-[8px] font-black uppercase tracking-tighter text-gray-300 hover:text-red-500 transition-colors">Log out</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-10 bg-primary text-white text-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <ShieldCheck className="w-64 h-64 -ml-16 -mt-16" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-4 relative z-10">Protect your account</h3>
                <p className="text-xs text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed relative z-10">We recommend rotating your password every 90 days and using a unique password for each of your online accounts.</p>
                <div className="inline-flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-accent border-b border-accent pb-1 cursor-pointer hover:text-white hover:border-white transition-all relative z-10">
                    <span>Account Recovery Options</span>
                    <ChevronRight className="w-3 h-3" />
                </div>
            </div>
        </DashboardLayout>
    );
}
