"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary">
            {/* Background Image with Parallax effect */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-fixed opacity-60"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070')" }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center text-white">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-6"
                >
                    Modest Fashion
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-none mb-10"
                >
                    Hijabs & scarves <br /> for every style
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="max-w-xl mx-auto text-sm md:text-base text-white/80 leading-relaxed mb-12"
                >
                    Discover premium hijabs, scarves and modest wear—carefully selected for quality, comfort and timeless elegance.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/shop" className="btn-primary bg-white text-primary border-white">
                        Shop Hijabs
                    </Link>
                    <Link href="/about" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                        Our Story
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
            </motion.div>
        </section>
    );
}
