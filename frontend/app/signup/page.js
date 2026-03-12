"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Mail, ArrowRight, User, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      setUserInfo({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
        token: data.token,
      });
      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="pt-28 pb-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 shadow-sm p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-3">
                Join Siyara
              </p>
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-primary mb-1">
                Create account
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Siyara Hijab Store
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-primary mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-secondary/30"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-primary mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-secondary/30"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-primary mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full border border-gray-200 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-secondary/30"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
              >
                {loading ? (
                  <span className="uppercase tracking-widest">
                    Creating account...
                  </span>
                ) : (
                  <>
                    <span className="uppercase tracking-widest">
                      Create account
                    </span>
                    <UserPlus className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Already have an account?
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-accent transition-colors"
              >
                Sign in
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-primary transition-colors"
              >
                ← Back to store
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
