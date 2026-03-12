"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/api";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const setUserInfo = useAuthStore(state => state.setUserInfo);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            if (!data?.isAdmin) {
                setError("Access denied. Admin credentials required.");
                setLoading(false);
                return;
            }
            setUserInfo({
                _id: data._id,
                name: data.name,
                email: data.email,
                isAdmin: data.isAdmin,
                token: data.token,
            });
            router.push("/admin");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Invalid credentials or unauthorized access.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-primary flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xs bg-white p-6 shadow-lg border border-gray-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-[0.04] -rotate-12">
                    <ShieldAlert size={120} className="text-primary" />
                </div>

                <div className="text-center mb-6 relative z-10">
                    <div className="inline-block px-2.5 py-1 bg-secondary border border-gray-100 mb-3">
                        <p className="text-[9px] text-primary font-bold uppercase tracking-wider">Secure Access</p>
                    </div>
                    <h1 className="text-xl font-bold uppercase tracking-tight mb-1 text-primary">Admin Login</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Siyara Hijab Store</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mb-4 p-2.5 bg-red-50 border border-red-100 text-red-600 text-[9px] font-bold uppercase tracking-wider text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            className="w-full border border-gray-200 pl-9 pr-3 py-2.5 text-xs font-medium tracking-wide focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-secondary/50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full border border-gray-200 pl-9 pr-3 py-2.5 text-xs font-medium tracking-wide focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-secondary/50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full h-10 text-[10px] flex items-center justify-center gap-2 group disabled:opacity-50 py-2"
                    >
                        <span>{loading ? "Signing in..." : "Sign in"}</span>
                        {!loading && <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />}
                    </button>
                </form>

                <div className="mt-6 text-center pt-4 border-t border-gray-100">
                    <button
                        onClick={() => router.push("/")}
                        className="text-[9px] text-gray-400 font-bold uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        &larr; Storefront
                    </button>
                </div>
            </motion.div>
        </main>
    );
}
