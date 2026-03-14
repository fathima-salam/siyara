"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import DashboardSidebar from "./DashboardSidebar";
import { motion } from "framer-motion";

export default function DashboardLayout({ children, title }) {
    return (
        <main className="min-h-screen bg-[#fcfcfc] flex flex-col">
            <section className="py-12 flex-1">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar */}
                        <div className="w-full lg:w-72 sticky top-12 h-fit">
                            <DashboardSidebar />
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                            {title && (
                                <h1 className="text-3xl font-bold uppercase tracking-tight mb-10 text-primary">
                                    {title}
                                </h1>
                            )}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {children}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
