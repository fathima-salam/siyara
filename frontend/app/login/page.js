"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import PhoneLogin from "@/components/PhoneLogin";

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const onPhoneSuccess = (data) => {
    const path = redirectTo && typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/";
    router.push(path);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="pt-32 pb-20 px-4 bg-secondary/30 flex items-center justify-center min-h-[85vh]">
        <div className="w-full max-w-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-10 shadow-sm border border-gray-100 rounded-sm"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="mt-4">
              <PhoneLogin onSuccess={onPhoneSuccess} />
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/"
                className="text-[12px] text-gray-400 uppercase tracking-[0.2em] font-bold hover:text-primary transition-colors"
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
