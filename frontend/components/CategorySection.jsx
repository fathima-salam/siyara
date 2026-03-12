"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
    {
        name: "Hijabs",
        subtitle: "Classic & modern styles",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
        link: "/shop?category=Hijabs",
        span: "md:col-span-2 md:row-span-2",
    },
    {
        name: "Scarves",
        subtitle: "Lightweight & versatile",
        image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=800",
        link: "/shop?category=Scarves",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        name: "Abayas & More",
        subtitle: "Modest wear",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        link: "/shop?category=Abayas",
        span: "md:col-span-1 md:row-span-1",
    },
];

export default function CategorySection() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className={`relative group overflow-hidden ${cat.span}`}
                        >
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-0 group-hover:opacity-100 mt-4 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    {cat.subtitle}
                                </p>
                                <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
                                    {cat.name}
                                </h3>
                                <Link
                                    href={cat.link}
                                    className="text-[10px] uppercase tracking-[0.2em] font-bold border-b-2 border-white pb-1 hover:text-accent hover:border-accent transition-all transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500"
                                >
                                    Explore More
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
